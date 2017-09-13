import React from "react";
import { Component, createElement } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { requestCubes, requestQuery, buildQuery } from "actions/mondrian";

import { prepareNaturalInput } from "helpers/prepareNaturalInput";

import "styles/PanelSearch.css";
import "react-select/dist/react-select.css";

class PanelSearch extends Component {
	componentDidMount() {
		this.props.dispatch(requestCubes());
	}

	componentDidUpdate(prev) {
		const { cube, drilldowns, measures, cuts, error } = this.props;

		if (
			cube.name != prev.cube.name ||
			drilldowns != prev.drilldowns ||
			measures != prev.measures ||
			cuts != prev.cuts
		) {
			let query = buildQuery(cube, drilldowns, measures, cuts);
			this.props.dispatch(requestQuery(query));
		}

		if (error != prev.error) alert({ message: error.message });
	}
	render() {
        const props = this.props;
        let { onSearchChange } = props;
		return (
			<div className="panelsearch-wrapper">
				<div className="chartoptions-wrapper">
					<div>
						<div className="title">Explore all data available for you</div>
						<Select
							options={props.ninput}
							placeholder="ex. Industry Group, Sector, Education Sponsored"
							onChange={onSearchChange}
						/>
					</div>
				</div>
			</div>
		);
	}
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
