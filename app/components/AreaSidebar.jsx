import React from "react";
import { connect } from "react-redux";
import GeminiScrollbar from 'react-gemini-scrollbar'

import CustomSelect from "components/SelectCustom";
import ChartTypeSelect from 'components/SelectChartType'

import 'gemini-scrollbar/gemini-scrollbar.css'
import "styles/AreaSidebar.css";

function Sidebar(props) {
	return (
		<div className="side-panel">
			<GeminiScrollbar>
			<p className="group">
				<span className="label">I want to see</span>
				<CustomSelect value={props.curr_dd} options={props.all_dd} onChange={props.onSetDrilldown} />
			</p>
			<p className="group">
				<span className="label">shown as a</span>
				<ChartTypeSelect value={props.viztype} onChange={props.onSetViztype} />
			</p>
			<p className="group">
				<span className="label">sized by</span>
				<CustomSelect value={props.curr_ms} options={props.all_ms} onChange={props.onSetMeasure} />
			</p>
			<p className="group">
				<span className="label">grouped by</span>
			</p>
			<p className="group">
				<span className="label">colored by</span>
			</p>
			<p className="group">
				<span className="label">labeled by</span>
			</p>
			</GeminiScrollbar>
		</div>
	);
}

function mapStateToProps(state) {
	let currentCb = state.cubes.current,
		currentDd = state.aggregators.drilldowns[0] || {},
		currentMs = state.aggregators.measures[0] || {};

	return {
		viztype: state.visuals.chart.type,

		all_cb: state.cubes.all,
		curr_cb: currentCb,
		
		all_dd: currentCb.drilldowns,
		curr_dd: currentDd,
		
		all_ms: currentCb.measures,
		curr_ms: currentMs,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onSetCube(item) {
			dispatch({
				type: "CUBES_SET",
				payload: item
			});
		},

		onSetDrilldown(item) {
			dispatch({
				type: "DRILLDOWN_SET",
				payload: item
			});

			// Generate suggested Viztype
			switch(item.name) {
				case "Age":
				case "Age Bucket":
					dispatch({
						type: "VIZ_TYPE_UPDATE",
						payload: "bar"
					});
					return
				default:
					dispatch({
						type: "VIZ_TYPE_UPDATE",
						payload: "treemap"
					});
					return
			}

		},

		onSetMeasure(item) {
			dispatch({
				type: "MEASURE_SET",
				payload: item
			});
		},

		onSetViztype(item) {
			dispatch({
				type: "VIZ_TYPE_UPDATE",
				payload: item.value
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
