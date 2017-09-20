import React from "react";
import { Component, createElement } from "react";
import Select from "react-select";
import Search from "components/Search";
import { connect } from "react-redux";
import { requestCubes, requestQuery, buildQuery } from "actions/mondrian";

import { prepareNaturalInput } from "helpers/prepareNaturalInput";
import { renderDrilldownSelector } from "helpers/prepareSelector";

import "styles/PanelSearch.css";
import "react-select/dist/react-select.css";

function PanelSearch(props) {
	return (
		<div className="panelsearch-wrapper">
			<Search />
		</div>
	);
}

function mapStateToProps(state) {
	return {
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,
		ninput: prepareNaturalInput(state.cubes.all),
		cube: state.cubes.current || {},
		cubes: state.cubes.all,
		drilldowns: state.aggregators.drilldowns,
		measures: state.aggregators.measures,
		cuts: state.aggregators.cuts,
		error: state.cubes.error
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		onChangeViz(type, panel) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type, panel: panel });
		},

		onSearchChange(data) {
			dispatch({ type: "CUBES_SET", payload: data.options.cube });
			dispatch({
				type: "DATA_SET",
				payload: {
					measure: data.options.measure,
					dimension: data.options.dimension
				}
			});
			dispatch({
				type: "VIZ_FULL_UPDATE",
				dimension: data.options.dimension.name,
				measure: data.options.measure.name
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelSearch);
