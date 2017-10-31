import React from "react";
import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea, Plot } from "d3plus-react";
import { max, mean, min, sum } from "d3-array";
import { Tooltip2, Popover2 } from "@blueprintjs/labs";
import { Button, Position, PopoverInteractionKind } from "@blueprintjs/core";

import Tooltip from "components/Tooltip";

import { COLORS_RAINFALL, COLORS_DISCRETE } from "helpers/colors";
import { CHARTCONFIG, LEGENDCONFIG, yearControls } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { setChartOptions } from "helpers/visuals";
import { calculateGrowth } from "helpers/prepareViz";
import {
	groupLowestCategories,
	applyHideIsolateFilters,
	applyYearFilter
} from "helpers/manageData";

import "styles/Chart.css";

function Chart(props) {
	/**
	 * Clean data before map in d3plus
	 */
	let data = groupLowestCategories(props.data),
		property = props.options.groupBy ? props.options.groupBy : props.options.x,
		items = Array.from(new Set(data.map(d => d[property]))).sort(),
		years = Array.from(new Set(data.map(d => d.Year))).sort(),
		filters = props.filters;

	// Hide/isolate Data
	if (filters.options.length > 0) {
		data = applyHideIsolateFilters(
			data,
			filters.options,
			filters.type,
			property
		);
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
			Growth: attributes[attr[props.options.x]]
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

	// Set legend properties

	let SHAPECONFIG = {
		labelConfig: {
			fontWeight: 600
		},
		labelPadding: 8
	};

	let max = Math.max(
			...data.map(elm => {
				return elm.Year;
			})
		),
		min = Math.min(
			...data.map(elm => {
				return elm.Year;
			})
		);

	//data = applyYearFilter(data, max)

	let VIZCONFIG = {
		...COLORSCALE,
		aggs: {
			[props.options.y]: measureType(props.options.type) ? mean : sum
		},
		legendConfig: LEGENDCONFIG,
		tooltipConfig: {
		body: d => { 
				let content = <div>"Hello"</div>
				return content 
			}
		},
		groupBy: props.options.groupBy
			? [props.options.groupBy, props.options.x]
			: [props.options.x],
		data: data.map(item => {
			return { ...item, value: item[props.options.y] };
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
		shapeConfig: SHAPECONFIG
	};

	let PIECONFIG = {
		...VIZCONFIG
	};

	let PLOTCONFIG = {
		...VIZCONFIG,
		y: [props.options.y], // Y axis option
		x: [props.options.x], // X axis option
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

	let props = setChartOptions(state.aggregators, state.visuals.axis.y)
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
