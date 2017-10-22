import React from "react";
import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea, Plot } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import { max, mean, min, sum } from "d3-array";
import { Tooltip2, Popover2 } from "@blueprintjs/labs";
import { Button, Position, PopoverInteractionKind } from "@blueprintjs/core";

import { COLORS_RAINFALL } from "helpers/colors";
import { CHARTCONFIG, yearControls } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { groupLowestCategories, calculateGrowth } from "helpers/prepareViz";

import "styles/Chart.css";

function Chart(props) {
	// Create buckets if drilldown selected is Age
	console.log(props.filters);
	let data2 = props.data;
	/*if (props.filters.options.length > 0) {
		data2 = props.filters.options.reduce((all, filter) => {
			let property = props.options.x;
			data2.map(item => {
				if(props.filters.type === "hide") {
					if (item[property] !== filter) all.push(item);
				} else {
					if (item[property] === filter) all.push(item);
				}
			});
			return all;
		}, []);
	}*/

	if (props.filters.options.length > 0) {
		let type = props.filters.type,
			filters = props.filters.options,
			property = props.options.x;

		data2 = data2.reduce((all, item) => {
			if (type === "hide") {
				if (!filters.includes(item[property])) all.push(item);
			} else {
				if (filters.includes(item[property])) all.push(item);
			}
			return all;
		}, []);
	}

	let data = mapDataForChart(data2, props.chart, props.options);
	data =
		props.options.x === "Age" ? createBuckets(data, props.num_buckets) : data;

	if (props.growthType) {
		let attributes = calculateGrowth(
			data,
			props.chart.colorScale !== "" ? "colorScale" : "value"
		);

		data = data.map(attr => ({
			...attr,
			growth: attributes[attr.id],
			source: {
				...attr.source,
				Growth: attributes[attr.id]
			}
		}));
	}

	data = groupLowestCategories(data);

	let max = Math.max(...data.map(d => d.year)),
		min = Math.min(...data.map(d => d.year));

	let colorScale;
	if (props.chart.colorScale === "" && props.chart.growth) {
		colorScale = "growth";
	} else if (props.chart.colorScale === "" && !props.chart.growth) {
		colorScale = false;
	} else if (props.chart.colorScale !== "" && props.chart.growth) {
		colorScale = "growth";
	} else {
		colorScale = "colorScale";
	}

	let COLORSCALE = {
		colorScale: props.chart.growth ? "growth" : props.chart.colorScale,
		colorScalePosition:
			props.chart.colorScale !== "" || props.chart.growth ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		}
	};

	let config = {
		...CHARTCONFIG,
		groupBy: ["id"],
		aggs: {
			growth: mean,
			colorScale: mean,
			value: measureType(props.options.y) ? mean : sum,
			y: measureType(props.options.y) ? mean : sum
		},
		data: data,
		colorScale: colorScale,
		colorScalePosition:
			props.chart.colorScale !== "" || props.chart.growth ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		},
		type: props.chart.type
	};

	let TREEMAPCONFIG = {
		...COLORSCALE,
		colorScale: colorScale,
		data: data,
		groupBy: props.groupBy.name ? ["groupBy", "id"] : ["id"],
		padding: 2,
		legend: false,
		shapeConfig: {
			labelConfig: {
				fontWeight: 600
			},
			labelPadding: 8
		}
		//on: ("click", d => { alert("Hello") })
	};

	data2 =
		props.options.x === "Age" ? createBuckets(data2, props.num_buckets) : data2;

	let VIZCONFIG = {
		aggs: {
			[props.options.y]: measureType(props.options.y) ? mean : sum
		},
		legend: false,
		groupBy: [props.options.x],
		data: data2
	};

	let PLOTCONFIG = {
		...VIZCONFIG,
		...COLORSCALE,
		y: props.options.y, // Y axis option
		x: props.options.x, // X axis option
		xConfig: {
			title: props.options.x
		},
		yConfig: {
			title: props.options.y
		}
	};

	// Only use AREACONFIG if there is timeDimension in x-axis
	let AREACONFIG = {
		...VIZCONFIG,
		...COLORSCALE,
		y: props.options.y,
		x: "Year"
	};

	switch (config.type) {
		case "treemap":
			return (
				<div className="viz">
					<Treemap config={TREEMAPCONFIG} />
					<div className="legend-wrapper">
						{legendControl(data2, props.options.x, props)}
					</div>
				</div>
			);

		case "donut":
			return <Donut config={config} />;

		case "pie":
			return <Pie config={config} />;

		case "bubble":
			return <Plot config={config} />;

		case "bar":
			return (
				<div className="viz">
					<BarChart config={PLOTCONFIG} />
					<div className="legend-wrapper">
						{legendControl(data2, props.options.x, props)}
					</div>
				</div>
			);

		case "stacked":
			return <StackedArea config={AREACONFIG} />;

		default:
			return <div />;
	}
}

function legendControl(data, key, props) {
	const legend = Array.from(new Set(data.map(d => d[key]))).sort();
	return legend.map(e => {
		let popoverContent = (
			<div>
				<h4>{e}</h4>
				<div className="pt-button-group pt-minimal">
					<Button
						className="pt-button pt-icon-eye-off"
						tabIndex="0"
						role="button"
						onClick={evt => props.hideDimension(e)}
					>
						Hide
					</Button>
					<Button
						className="pt-button pt-icon-pin"
						tabIndex="1"
						role="button"
						onClick={evt => props.isolateDimension(e)}
					>
						Isolate
					</Button>
				</div>
			</div>
		);
		return (
			<div className="legend">
				<Popover2
					content={popoverContent}
					position={Position.TOP}
					popoverClassName={"customtooltip"}
					interactionKind={PopoverInteractionKind.HOVER}
				>
					<div className="legend" />
				</Popover2>
			</div>
		);
	});
}

function measureType(ms) {
	switch (ms.type) {
		case "AVG":
			return true;
		case "SUM":
		case "UNKNOWN":
		default:
			return false;
	}
}

// Preprocess data for charts
function mapDataForChart(data, chart, props) {
	switch (chart.type) {
		case "treemap":
		case "donut":
		case "pie":
			return data.reduce((all, item) => {
				all.push({
					id: item[props.x],
					name: item[props.x],
					year: parseInt(item[props.year] || item.Year),
					groupBy: item[props.groupBy],
					colorScale: item[props.colorScale],
					value: item[props.y],
					source: item
				});
				return all;
			}, []);

		case "bubble":
			return data.reduce((all, item) => {
				all.push({
					id: item[props.x],
					name: item[props.x],
					year: parseInt(item[props.year] || item.Year),
					colorScale: item[props.colorScale],
					x: item[props.y],
					y: item[props.y],
					value: item[props.y],
					source: item
				});
				return all;
			}, []);

		case "bar":
		case "stacked":
			return data.reduce((all, item) => {
				all.push({
					id: item[props.x],
					name: item[props.x],
					year: parseInt(item[props.year] || item.Year),
					colorScale: item[props.colorScale],
					x: item[props.x],
					y: item[props.y],
					value: item[props.y],
					source: item
				});
				return all;
			}, []);

		case "table":
		default:
			return data;
	}
}

function mapStateToProps(state) {
	let aggr = state.aggregators,
		colorBy = aggr.colorBy[0] || {},
		groupBy = aggr.groupBy[0] || {},
		props = {
			x: state.visuals.axis.x,
			y: state.visuals.axis.y,
			year: "",
			colorScale: colorBy.name || "",
			groupBy: groupBy.level || ""
		};

	if (aggr.drilldowns.length > 1) {
		let xor = aggr.drilldowns[0].dimensionType === 0;
		props.x = aggr.drilldowns[xor ? 0 : 1].level;
		props.year = aggr.drilldowns[xor ? 1 : 0].level;
	} else if (aggr.drilldowns.length > 0) {
		props.x = aggr.drilldowns[0].level;
	}

	props.y = aggr.measures.filter(ms => ms.name === state.visuals.axis.y)[0];

	if (state.cubes.current.timeDimensions.length > 0) {
		props.year = state.cubes.current.timeDimensions[0].name;
	}

	let chart = { ...state.visuals.chart, colorScale: props.colorScale };
	let opt = {
		x: props.x,
		y: props.y.name,
		year: props.year,
		colorScale: colorBy.name || "",
		groupBy: groupBy.level || ""
	};

	return {
		chart: chart,
		filters: state.data.filters,
		growthType: state.visuals.chart.growth,
		groupBy: groupBy,
		axis: state.visuals.axis,
		data: state.data.values,
		num_buckets: state.visuals.buckets,
		options: opt
	};
}

function mapDispatchToProps(dispatch) {
	return {
		hideDimension(evt) {
			dispatch({ type: "FILTER_HIDE_DIMENSION", payload: evt });
		},

		isolateDimension(evt) {
			dispatch({ type: "FILTER_ISOLATE_DIMENSION", payload: evt });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
