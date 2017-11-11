import React from "react";
import { connect } from "react-redux";
import {
	Treemap,
	Donut,
	Pie,
	BarChart,
	StackedArea,
	Plot,
	LinePlot
} from "d3plus-react";
import { max, mean, min, sum } from "d3-array";
import { Tooltip2, Popover2 } from "@blueprintjs/labs";
import { Button, Position, PopoverInteractionKind } from "@blueprintjs/core";

import { NumberRange, RangeSlider, Switch, Slider } from "@blueprintjs/core";

import Tooltip from "components/Tooltip";
import CustomTable from "components/CustomTable";

import uniq from "lodash/uniq";
import union from "lodash/union";

import { COLORS_RAINFALL, COLORS_DISCRETE } from "helpers/colors";
import { CHARTCONFIG, LEGENDCONFIG, yearControls } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { calculateGrowth } from "helpers/prepareViz";
import {
	groupLowestCategories,
	applyHideIsolateFilters
} from "helpers/manageData";
import { makeRandomId } from "helpers/random";

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
	if (props.axis_x === "Age") data = createBuckets(data, props.num_buckets);

	// Add Custom Growth scale
	if (props.color.type === "growth") {
		let attributes = calculateGrowth(
			data,
			props.axis_x,
			props.axis_y,
			props.axis_time
		);

		data = data.map(attr => ({
			...attr,
			Growth: attributes[attr[props.axis_x]]
		}));
	}

	// Get max/min (in members)
	let allYears = uniq(data.map(dm => parseInt(dm[props.axis_time]))) || [],
		min = Math.min(...allYears),
		max = Math.max(...allYears);

	console.log(props.color);
	// Set COLORSCALE properties
	let COLORSCALE = {
		colorScale:
			props.color.type === "growth" ? "Growth" : props.options.colorScale,
		colorScalePosition:
			props.options.colorScale !== "" || props.color.type === "growth"
				? "bottom"
				: false,
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
			[props.axis_y]: measureType(props.options.type) ? mean : sum,
			Growth: mean
		},
		legendConfig: LEGENDCONFIG,
		tooltipConfig: {
			body: d => "<div>Hello</div>"
		},
		time: props.axis_time ? props.axis_time : false,
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
			//			let range = props.time.length > 0 ? props.time : [2005, 2010]
			return <Treemap config={TREEMAPCONFIG} />;
		}

		case "donut": {
			return <Donut config={VIZCONFIG} />;
		}

		case "pie": {
			return <Pie config={VIZCONFIG} />;
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
			return <LinePlot config={PLOTCONFIG} />;
		}

		case "bar": {
			return <BarChart config={PLOTCONFIG} />;
		}

		case "table": {
			return <CustomTable data={data} />;
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
		case "MEDIAN":
		case "INDEX":
			return true;
		case "SUM":
		case "UNKNOWN":
		default:
			return false;
	}
}

const fakeSelectable = {
	name: "",
	levelName: ""
};

/** @param {VizbuilderState} state */
function mapStateToProps(state) {
	let aggr = state.aggregators;

	let colorBy = aggr.colorBy[0] || fakeSelectable,
		growthBy = aggr.growthBy[0] || fakeSelectable,
		groupBy = aggr.groupBy[0] || fakeSelectable;

	let props = {
		x: state.data.axis.x.name,
		y: state.data.axis.y.name,
		type: "",
		time: state.data.axis.time,
		colorScale: colorBy.name,
		groupBy: groupBy.levelName
	};

	let measure = aggr.measures.find(ms => ms.name === props.y);
	if (measure) props.type = measure.type;

	let axis = state.data.axis;

	return {
		axis_x: axis.x.level || "",
		axis_y: axis.y.name || "",
		axis_time: axis.time.level || "",
		chart: state.visuals.chart,
		filters: state.data.filters,
		num_buckets: state.visuals.buckets,
		options: props,
		color: {
			type: aggr.growthBy.length > 0 ? "growth" : "standard",
			measure: union(colorBy, growthBy)[0]
		},
		time: state.visuals.chart.time
	};
}

function mapDispatchToProps(dispatch) {
	return {
		hideDimension(evt) {
			dispatch({ type: "FILTER_HIDE_DIMENSION", payload: evt });
		},

		isolateDimension(evt) {
			dispatch({ type: "FILTER_ISOLATE_DIMENSION", payload: evt });
		},

		addTimeFilter(filter) {
			dispatch({ type: "FILTER_ADD", payload: filter });
		},

		onYearChange(item) {
			dispatch({ type: "VIZ_CHART_TIME_SET", payload: item });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
