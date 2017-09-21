import React from "react";
import { connect } from "react-redux";

import CHARTS from "helpers/charts";

import SearchBar from "components/Search";
import InputChartType from "components/InputChartType";

import "styles/AreaTop.css";

function AreaTop(props) {
	return (
		<div className="top-panel">
			<InputChartType
				options={CHARTS}
				value={props.viztype}
				onChange={props.onVizTypeChange}
				position="BOTTOM_LEFT"
			/>
			<div className="search">
				<SearchBar />
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		viztype: state.visuals.chart.type
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onToggleVizPanel(display) {
			dispatch({ type: "VIZ_PANEL_TOGGLE", payload: display });
		},

		onVizTypeChange(type) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaTop);
