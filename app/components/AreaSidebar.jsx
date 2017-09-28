import React from "react";
import { connect } from "react-redux";
import GeminiScrollbar from "react-gemini-scrollbar";

import SelectCustom from "components/SelectCustom";
import ChartTypeSelect from "components/SelectChartType";

import "gemini-scrollbar/gemini-scrollbar.css";
import "styles/AreaSidebar.css";

function Sidebar(props) {
	return (
		<div className="side-panel">
			<p className="group">
				<span className="label">I want to see</span>
				<SelectCustom
					value={props.drilldown}
					options={props.all_dd}
					onChange={props.onSetDrilldown}
				/>
			</p>
			<p className="group">
				<span className="label">shown as a</span>
				<ChartTypeSelect value={props.viztype} onChange={props.onSetViztype} />
			</p>
			<p className="group">
				<span className="label">sized by</span>
				<SelectCustom
					value={props.measure}
					options={props.all_ms}
					onChange={props.onSetMeasure}
				/>
			</p>
			<p className="group">
				<span className="label">grouped by</span>
				<SelectCustom
					value={props.groupBy}
					options={props.all_dd}
					onChange={props.onSetGrouping}
				/>
			</p>
			<p className="group">
				<span className="label">colored by</span>
				<SelectCustom
					value={props.colorBy}
					options={props.all_cl}
					placeholder={{ label: "None", value: "" }}
					onChange={props.onSetColorIndex}
				/>
			</p>
			<p className="group">
				<span className="label">labeled by</span>
			</p>
		</div>
	);
}

function mapStateToProps(state) {
	let currentCb = state.cubes.current,
		currentDd = state.aggregators.drilldowns[0] || {},
		currentMs = state.aggregators.measures[0] || {},
		currentGb = state.aggregators.groupBy[0] || {},
		currentCl = state.aggregators.colorBy[0] || {};

	let colorMeasureFilter = RegExp("growth|average|median|percent", "i"),
		treemapMeasureFilter = RegExp("average|median", "i");

	let all_ms = currentCb.measures;
	if (state.visuals.chart.type === "treemap")
		all_ms = all_ms.filter(ms => !treemapMeasureFilter.test(ms.name));

	return {
		cube: currentCb,
		drilldown: currentDd,
		viztype: state.visuals.chart.type,
		measure: currentMs,
		groupBy: currentGb,
		colorBy: currentCl,

		all_cb: state.cubes.all,
		all_dd: currentCb.drilldowns,
		all_ms,
		all_cl: currentCb.measures.filter(ms => colorMeasureFilter.test(ms.name))
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
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: item.value });
		},

		onSetMeasure(item) {
			dispatch({ type: "MEASURE_SET", payload: item });
		},

		onSetGrouping(item) {
			dispatch({ type: "GROUPBY_SET", payload: item });
		},

		onSetColorIndex(item) {
			dispatch({ type: "COLORBY_SET", payload: item.value });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
