import React from "react";
import { connect } from "react-redux";
import { Treemap, Donut, Pie, BarChart, StackedArea, Plot, LinePlot } from "d3plus-react";
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
	// Duplicate data before modifiyng
	let data = props.data.map(attr => ({ ...attr }));

	// Clean data before map in d3plus
	data = groupLowestCategories(props.data);

	let property = props.options.groupBy || props.axis_x;

	// Hide/isolate Data
	let filters = props.filters;
	if (filters.options.length > 0) {
		data = applyHideIsolateFilters(
			data,
			filters.options,
			filters.type,
			property
		);
	}

	// Custom Age Buckets
	if (props.axis_x === "Age") 
		data = createBuckets(data, props.num_buckets);

	// Add Custom Growth scale
	if (props.chart.growthType) {
		let attributes = calculateGrowth(
			data,
			props.options.colorScale !== "" ? "colorScale" : props.axis_y
		);

		data = data.map(attr => ({
			...attr,
			Growth: attributes[attr[props.axis_x]]
		}));
	}

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

	let VIZCONFIG = {
		...COLORSCALE,
		aggs: {
			[props.axis_y]: measureType(props.options.type) ? mean : sum
		},
		legendConfig: LEGENDCONFIG,
		tooltipConfig: {
			body: d => <div>Hello</div>
		},
		groupBy: props.options.groupBy
			? [props.options.groupBy, props.axis_x]
			: [props.axis_x],
		data: data.map(item => {
			return { ...item, value: item[props.axis_y] };
		}),
		on: {
			"click.shape": d => {
				alert(d[props.axis_x]);
			}
		}
	};

	let TREEMAPCONFIG = {
		...VIZCONFIG,
		padding: 2,
		shapeConfig: SHAPECONFIG
	};

	let PLOTCONFIG = {
		...VIZCONFIG,
		y: [props.axis_y], // Y axis option
		x: [props.axis_x], // X axis option
		xConfig: {
			title: props.axis_x
		},
		yConfig: {
			title: props.axis_y
		}
	};

	switch (props.chart.type) {
		case "treemap": {
			return <Treemap config={TREEMAPCONFIG} />;
		}

		case "donut": {
			return <Donut config={VIZCONFIG} />;
		}

		case "bubble": {
			let BUBBLECONFIG = {
				...PLOTCONFIG,
				y: props.axis_y,
				x: props.axis_y
			};
			return <Plot config={BUBBLECONFIG} />;
		}

		case "lineplot": {
			let AREACONFIG = {
				...VIZCONFIG,
				y: props.axis_y,
				x: "Year"
			};
			return <LinePlot config={AREACONFIG} />;
		}

		case "bar": {
			return <BarChart config={PLOTCONFIG} />;
		}

		case "stacked": {
			// Only use AREACONFIG if there is timeDimension in x-axis
			let AREACONFIG = {
				...VIZCONFIG,
				y: props.axis_y,
				x: "Year"
			};
			return <StackedArea config={AREACONFIG} />;
		}

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

const fakeSelectable = {
	name: "",
	level: ""
};

/** @param {VizbuilderState} state */
function mapStateToProps(state) {
	let aggr = state.aggregators;

	let colorBy = aggr.colorBy[0] || fakeSelectable,
		groupBy = aggr.groupBy[0] || fakeSelectable;

	let props = {
		x: state.data.axis.x.name,
		y: state.data.axis.y.name,
		type: "",
		year: state.data.axis.time,
		colorScale: colorBy.name,
		groupBy: groupBy.level
	};

	let measure = aggr.measures.find(ms => ms.name === props.y);
	if (measure) props.type = measure.type;

	let axis = state.data.axis;

	return {
		axis_x: axis.x.name || '',
		axis_y: axis.y.name || '',
		chart: state.visuals.chart,
		filters: state.data.filters,
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
