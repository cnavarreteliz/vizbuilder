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
import { calculateGrowth } from "helpers/prepareViz";
import { groupLowestCategories, applyHideIsolateFilters, applyYearFilter } from "helpers/manageData";

import "styles/Chart.css";

function Chart(props) {
	/**
	 * Clean data before map in d3plus
	 */
	let data = groupLowestCategories(props.data),
		property = props.options.groupBy ? props.options.groupBy : props.options.x,
		items = Array.from(new Set(data.map(d => d[property]))).sort(),
		years = Array.from(new Set(data.map(d => d.Year))).sort(),
		filters = props.filters
	
	// Hide/isolate in data
	if (filters.options.length > 0) {
		data = applyHideIsolateFilters(data, filters.options, filters.type, property)
	}

	// Custom Age Buckets
	data =
		props.options.x === "Age" ? createBuckets(data, props.num_buckets) : data;

	// Add Custom Growth scale
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
	
	data = data.map(attr => ({
		...attr
	}));


	// Set COLORSCALE properties
	let COLORSCALE = {
		colorScale: props.chart.growth ? "Growth" : props.options.colorScale,
		colorScalePosition:
			props.options.colorScale !== "" || props.chart.growth ? "bottom" : false,
		colorScaleConfig: {
			color: COLORS_RAINFALL
		}
	};
	
	let LEGENDCONFIG = {
		marginLeft: 8,
		padding: 8,
		shapeConfig: {
			label: false,
			labelConfig: {
				fontColor: "rgba(0, 0, 0, 0.8)",
				fontResize: false,
				fontSize: 0,
				fontWeight: 600
			},
			height: () => 25,
			width: () => 25
		},
		tooltipConfig: {
			body: false
		}
	}
	
	let SHAPECONFIG ={
		labelConfig: {
			fontWeight: 600
		},
		labelPadding: 8
	}

	// 
	let max = Math.max(...data.map(elm => { return elm.Year })),
		min = Math.min(...data.map(elm => { return elm.Year }))

	console.log(data.length)
	
	//data = applyYearFilter(data, max)
	console.log(data.length)

	let VIZCONFIG = {
		...COLORSCALE,
		aggs: {
			[props.options.y]: measureType(props.options.type) ? mean : sum
		},
		legendConfig: LEGENDCONFIG,
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
		controls: yearControls(data, "Year"),
		padding: 2,
		shapeConfig: SHAPECONFIG
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
			return <Treemap config={TREEMAPCONFIG} />;

		case "donut":
			return <Donut config={PIECONFIG} />;

		case "pie":
			return <Pie config={PIECONFIG} />;

		case "bubble":
			return <Plot config={BUBBLECONFIG} />;

		case "bar":
			return <BarChart config={PLOTCONFIG} />;

		case "stacked":
			return <StackedArea config={AREACONFIG} />;

		default:
			return <div />;
	}
}

function measureType(ms) {
	switch (ms) {
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
			type: "",
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
	props.type = aggr.measures.filter(ms => ms.name === state.visuals.axis.y)[0].type;

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