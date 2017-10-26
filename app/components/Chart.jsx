import React from "react";
import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea, Plot } from "d3plus-react";
import { Tooltip } from "d3plus-tooltip";
import { max, mean, min, sum } from "d3-array";
import { Tooltip2, Popover2 } from "@blueprintjs/labs";
import { Button, Position, PopoverInteractionKind } from "@blueprintjs/core";

import { COLORS_RAINFALL, COLORS_DISCRETE } from "helpers/colors";
import { CHARTCONFIG, yearControls } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { groupLowestCategories, calculateGrowth } from "helpers/prepareViz";

import "styles/Chart.css";

function Chart(props) {
	let data = groupLowestCategories(props.data),
		label = props.options.groupBy ? props.options.groupBy : props.options.x,
		items = legends(data, label);

	// Apply filters hide/isolate in data
	if (props.filters.options.length > 0) {
		let type = props.filters.type,
			filters = props.filters.options,
			property = props.options.groupBy ? props.options.groupBy : props.options.x;

		data = data.reduce((all, item) => {
			if (type === "hide" && !filters.includes(item[property])) all.push(item);
			else if (type === "isolate" && filters.includes(item[property]))
				all.push(item);

			return all;
		}, []);
	}

	// Create buckets if drilldown selected is Age
	data =
		props.options.x === "Age" ? createBuckets(data, props.num_buckets) : data;

	if (props.chart.growthType) {
		let attributes = calculateGrowth(
			data,
			props.options.colorScale !== "" ? "colorScale" : props.options.y
		);

		data = data.map(attr => ({
			...attr,
			Growth: attributes[attr[props.options.x]],
		}));
	}

	let color_length = COLORS_DISCRETE.length
	
	data = data.map(attr => ({
		...attr,
		color: COLORS_DISCRETE[ items.indexOf(attr[label]) % color_length ] 
	}));

	let COLORSCALE = {
		colorScale: props.chart.growth ? "Growth" : props.options.colorScale,
		colorScalePosition:
			props.options.colorScale !== "" || props.chart.growth ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		}
	};

	// If "colorScale" is selected, shapeConfig doesn't must include "fill" option
	let shapeConfig = props.options.colorScale !== ""
		? {}
		: { fill: d => d.color };

	let VIZCONFIG = {
		...COLORSCALE,
		aggs: {
			[props.options.y]: measureType(props.options.y) ? mean : sum
		},
		shapeConfig: shapeConfig,
		legend: false,
		groupBy: props.options.groupBy
			? [props.options.groupBy, props.options.x]
			: [props.options.x],
		data: data.map(elm => {
			return { ...elm, value: elm[props.options.y] };
		}),
		on: {
			"click.shape": d => {
				alert(d[props.options.x]);
			}
		}
	};

	let TREEMAPCONFIG = {
		...VIZCONFIG,
		padding: 2,
		shapeConfig: {
			...shapeConfig,
			labelConfig: {
				fontWeight: 600
			},
			labelPadding: 8
		}
	};

	let PIECONFIG = {
		...VIZCONFIG
	};

	let PLOTCONFIG = {
		...VIZCONFIG,
		y: props.options.y, // Y axis option
		x: props.options.x, // X axis option
		xConfig: {
			title: props.options.x
		},
		yConfig: {
			title: props.options.y
		}
	};

	let BUBBLECONFIG = {
		...PLOTCONFIG,
		y: props.options.y,
		x: props.options.y
	};

	// Only use AREACONFIG if there is timeDimension in x-axis
	let AREACONFIG = {
		...VIZCONFIG,
		y: props.options.y,
		x: "Year"
	};

	switch (props.chart.type) {
		case "treemap":
			return (
				<div className="chart">
					<Treemap config={TREEMAPCONFIG} />
					<div className="legend-wrapper">
						{legendControl(data, label, props)}
					</div>
				</div>
			);

		case "donut":
			return <Donut config={PIECONFIG} />;

		case "pie":
			return <Pie config={PIECONFIG} />;

		case "bubble":
			return <Plot config={BUBBLECONFIG} />;

		case "bar":
			return (
				<div className="chart">
					<BarChart config={PLOTCONFIG} />
					<div className="legend-wrapper">
						{legendControl(data, label, props)}
					</div>
				</div>
			);

		case "stacked":
			return <StackedArea config={AREACONFIG} />;

		default:
			return <div />;
	}
}

function legends(data, key) {
	return Array.from(new Set(data.map(d => d[key]))).sort();
}

function legendControl(data, key, props) {
	const legend = Array.from(new Set(data.map(d => d[key]))).sort();

	return legend.map((e, key) => {
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
		let customKey = key % COLORS_DISCRETE.length

		let divStyle = {
			backgroundColor: COLORS_DISCRETE[customKey] ? COLORS_DISCRETE[customKey] : "tomato"
		};
		return (
			<div className="legend" style={divStyle}>
				<Popover2
					content={popoverContent}
					position={Position.TOP}
					popoverClassName={"customtooltip"}
					interactionKind={PopoverInteractionKind.HOVER}
				>
					<div className="legend" style={divStyle} />
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

	props.y = aggr.measures.filter(ms => ms.name === state.visuals.axis.y)[0].name;

	if (state.cubes.current.timeDimensions.length > 0) {
		props.year = state.cubes.current.timeDimensions[0].name;
	}

	return {
		chart: state.visuals.chart,
		filters: state.data.filters,
		data: state.data.values,
		num_buckets: state.visuals.buckets,
		options: props
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