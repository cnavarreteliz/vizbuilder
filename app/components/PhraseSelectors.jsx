import React from "react";
import { connect } from "react-redux";

import CHARTTYPES from "helpers/charts";
import InlineSelect from "components/InlineSelect";

function NaturalSelectors(props) {
	return (
		<span className="natural-selectors">
			<span className="static">From </span>
			<InlineSelect
				value={props.cb}
				options={props.cb_all}
				onChange={props.onCbChange}
			/>
			<span className="static">, show me </span>
			<InlineSelect
				value={props.ms}
				options={props.ms_all}
				onChange={props.onMsChange}
			/>
			<span className="static"> by </span>
			<InlineSelect
				value={props.dd}
				options={props.dd_all}
				onChange={props.onDdChange}
			/>
			<span className="static"> in </span>
			<InlineSelect
				value={props.viztype}
				options={CHARTTYPES}
				onChange={props.onVizChange}
			/>
		</span>
	);
}

function mapStateToProps(state) {
	let currentCb = state.cubes.current,
		currentDd = state.aggregators.drilldowns[0] || {},
		currentMs = state.aggregators.measures[0] || {};

	return {
		cb: currentCb.name,
		cb_all: state.cubes.all.map(cb => ({ key: cb.id, value: cb.name })),
		dd: currentDd.name,
		dd_all: currentCb.drilldowns.map(dd => ({
			ms: dd.name,
			key: dd.id,
			value: dd.level
		})),
		ms: currentMs.name,
		ms_all: currentCb.measures.map(ms => ({
			key: ms.id,
			value: ms.name
		})),
		viztype: state.visuals.type
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onCbChange(evt) {
			dispatch({
				type: "CUBES_SET",
				payload: evt.target.value
			});
		},

		onDdChange(evt) {
			dispatch({
				type: "DRILLDOWN_SET",
				payload: evt.target.value
			});
		},

		onMsChange(evt) {
			dispatch({
				type: "MEASURE_SET",
				payload: evt.target.value
			});
		},

		onVizChange(evt) {
			dispatch({
				type: "VIZ_TYPE_UPDATE",
				payload: evt.target.value
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(NaturalSelectors);
