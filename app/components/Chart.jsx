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
import inRange from "lodash/inRange";

import { COLORS_RAINFALL, COLORS_DISCRETE } from "helpers/colors";
import { CHARTCONFIG, LEGENDCONFIG, yearControls } from "helpers/d3plus";
import { createBuckets } from "helpers/buckets";
import { calculateGrowth } from "helpers/growth";
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

	let property = props.config.groupBy || props.axis_x;

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

	// Get max/min (in members)
	let allYears =
			uniq(data.map(dm => parseInt(dm[props.axis_time]))).sort((a, b) => {
				return a - b;
			}) || [],
		min = Math.min(...allYears),
		max = Math.max(...allYears);

	// Add Custom Growth scale
	if (props.color.type === "growth") {
		// Select range where calculate growth
		switch (props.time.length) {
			// By default
			case 0:
				data = data.filter(item =>
					inRange(
						parseInt(item[props.axis_time]),
						allYears[allYears.length - 2],
						allYears[allYears.length - 1] + 1
					)
				);
				break;
				
			// It's selected one year
			case 1:
				if (allYears.indexOf(props.time[0]) === 0) {
					data = data.filter(item =>
						inRange(
							parseInt(item[props.axis_time]),
							allYears[allYears.indexOf(props.time[0]) - 1],
							props.time[0] + 1
						)
					);
				}
				break;
			// It's selected a range of years
			case 2:
				data = data.filter(item =>
					inRange(
						parseInt(item[props.axis_time]),
						props.time[0],
						props.time[1] + 1
					)
				);
				break;
		}

		console.log(data)
		let attributes = calculateGrowth(
			data,
			props.axis_x,
			props.axis_y,
			props.axis_time
		);

		console.log(attributes)

		data = data.map(attr => ({
			...attr,
			Growth: attributes[attr[props.axis_x]]
		}));
	}

	// Set COLORSCALE properties
	let COLORSCALE = {
		colorScale:
			props.color.type === "growth" ? "Growth" : props.config.colorScale,
		colorScalePosition:
			props.config.colorScale !== "" || props.color.type === "growth"
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
			[props.axis_y]: measureType(props.config.type) ? mean : sum,
			Growth: mean
		},
		groupBy: [props.axis_x],
		legendConfig: LEGENDCONFIG,
		tooltipConfig: {
			body: d => "<div></div>"
		},
		time: props.axis_time ? props.axis_time : false,
		timelineConfig: {
			on: {
				end: d => {
					if (d !== undefined) {
						let time = Array.isArray(d)
							? d.map(item => item.getFullYear())
							: [].concat(d.getFullYear());
						props.onYearChange(time);
					}
				}
			}
		},
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
		groupBy: props.config.groupBy
			? [props.config.groupBy, props.axis_x]
			: [props.axis_x],
		padding: 2,
		shapeConfig: SHAPECONFIG
	};

	let PLOTCONFIG = {
		...VIZCONFIG,
		y: [props.axis_y], // Y axis option
		x: [props.axis_x], // X axis option
		groupBy: props.config.groupBy ? [props.config.groupBy] : [props.axis_x],
		stacked:
			props.config.members.groupBy.length < 5 && !measureType(props.config.type)
				? false
				: true,
		groupPadding: 5,
		xConfig: {
			title: props.axis_x
		},
		yConfig: {
			title: props.axis_y
		}
	};

	var bubbleX = props.bubbleAxis.x ? props.bubbleAxis.x : props.axis_y,
		bubbleY = props.bubbleAxis.y ? props.bubbleAxis.y : props.axis_y,
		bubbleSize = props.bubbleAxis.size ? props.bubbleAxis.size : props.axis_y;

	var allValues = uniq(data.map(dm => parseInt(dm[bubbleSize]))) || [],
		minValue = Math.min(...allValues),
		maxValue = Math.max(...allValues);

	var BUBBLECONFIG = {
		...VIZCONFIG,
		data: data,
		groupBy: props.axis_x,
		y: bubbleY,
		x: bubbleX,
		timelineConfig: {
			...VIZCONFIG.timelineConfig,
			selection: [min, max]
		},
		shapeConfig: {
			Circle: {
				scale: d =>
					(d[bubbleSize] - minValue) / (maxValue - minValue) * (10 - 1) + 1
			}
		}
	};

	switch (props.chart.type) {
		case "treemap": {
			return <Treemap config={TREEMAPCONFIG} />;
		}

		case "donut": {
			return <Donut config={VIZCONFIG} />;
		}

		case "pie": {
			return <Pie config={VIZCONFIG} />;
		}

		case "bubble": {
			return <Plot config={BUBBLECONFIG} />;
		}

		case "lineplot": {
			let LINECONFIG = {
				...VIZCONFIG,
				y: props.axis_y,
				x: "Year",
				shapeConfig: {
					Line: {
						strokeWidth: 5
					}
				}
			};
			return <LinePlot config={LINECONFIG} />;
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
		groupBy: groupBy.levelName,
		members: {
			groupBy: state.members[groupBy.fullName] || []
		}
	};

	let measure = aggr.measures.find(ms => ms.name === props.y);
	if (measure) props.type = measure.type;

	let axis = state.data.axis;

	return {
		bubbleAxis: state.visuals.axis.bubble,
		axis_x: axis.x.level || "",
		axis_y: axis.y.name || "",
		axis_time: axis.time.level || "",
		chart: state.visuals.chart,
		filters: state.data.filters,
		num_buckets: state.visuals.chart.buckets,
		config: props,
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
