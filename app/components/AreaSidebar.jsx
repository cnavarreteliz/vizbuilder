import React from "react";
import { connect } from "react-redux";

import SelectDrillable from "components/SelectDrillable";
import SelectChartType from "components/SelectChartType";
import { Omnibox } from "@blueprintjs/labs"

import { generateColorSelector } from "helpers/prepareInput"

import "styles/AreaSidebar.css";

function Panel(props) {
	switch(type) {
		case "treemap":
		case "donut":
			return true
			
		case "bubble":
		case "stacked":
		case "bar":
			return true
	}
}

function Sidebar(props) {
	return (
		<div className="side-panel">
			<div className="group">
				<span className="label">Dataset</span>
				<SelectDrillable
					value={props.cube}
					items={props.all_cb}
					onItemSelect={props.onSetCube}
				/>
			</div>
			<div className="group">
				<span className="label">I want to see</span>
				<SelectDrillable
					value={props.drilldown}
					items={props.all_dd}
					onItemSelect={props.onSetDrilldown}
				/>
			</div>
			<div className="group">
				<span className="label">shown as a</span>
				<SelectChartType
					value={props.viztype}
					onItemSelect={props.onSetViztype}
				/>
			</div>
			<div className="group">
				<span className="label">sized by</span>
				<SelectDrillable
					value={props.measure}
					items={props.all_ms}
					onItemSelect={props.onSetMeasure}
				/>
			</div>
			<div className="group">
				<span className="label">grouped by</span>
				<SelectDrillable
					value={props.groupBy}
					items={props.all_dd}
					onItemSelect={props.onSetGrouping}
				/>
			</div>
			<div className="group">
				<span className="label">colored by</span>
				<SelectDrillable
					value={props.colorBy}
					items={props.all_cl}
					onItemSelect={props.onSetColorIndex}
				/>
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	let currentCb = state.cubes.current,
		currentDd = state.aggregators.drilldowns[0] || {},
		currentMs = state.aggregators.measures[0] || {},
		currentGb = state.aggregators.groupBy[0] || {},
		currentCl = state.aggregators.colorBy[0] || {};

	console.log(state.aggregators.drilldowns)

	let colorMeasureFilter = RegExp("growth|average|median|percent", "i"),
		treemapMeasureFilter = RegExp("average|median", "i");

	let all_ms = currentCb.measures;
	//if (state.visuals.chart.type === "treemap")
	//all_ms = all_ms.filter(ms => !treemapMeasureFilter.test(ms.name));

	let all_cl = generateColorSelector(currentCb.measures);
	currentCl = all_cl.find(item => item.measure == currentCl) || all_cl[0];

	return {
		cube: currentCb,
		drilldown: currentDd,
		viztype: state.visuals.chart.type,
		measure: currentMs,
		groupBy: currentGb,
		colorBy: currentCl,

		all_cb: state.cubes.all,
		all_dd: currentCb.stdDimensions, 
		all_ms,
		all_cl: generateColorSelector(currentCb.measures),
		isOpen: true
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onSetCube(item) {
			dispatch({ type: "CUBES_SET", payload: item });
		},

		onSetDrilldown(item) {
			dispatch({ type: "DRILLDOWN_SET", payload: item });
		},

		onSetViztype(item) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: item.name });
		},

		onSetMeasure(item) {
			dispatch({ type: "MEASURE_SET", payload: item });
		},

		onSetGrouping(item) {
			dispatch({ type: "GROUPBY_SET", payload: item });
		},

		onSetColorIndex(item) {
			dispatch({ type: "COLORBY_SET", payload: item.measure, growth: item.growthType });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
