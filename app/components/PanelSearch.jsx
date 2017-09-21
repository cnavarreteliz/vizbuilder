import React from "react";
import { connect } from "react-redux";
import Select from "react-select";

import { requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";
import { prepareNaturalInput } from "helpers/prepareNaturalInput";

import "styles/PanelSearch.css";
import "react-select/dist/react-select.css";

class PanelSearch extends React.Component {
	render() {
		return (
			<div className="panelsearch-wrapper">
				<div className="chartoptions-wrapper">
					<div>
						<div className="title">Explore all data available for you</div>
						<Select
							options={this.props.ninput}
							placeholder="ex. Industry Group, Sector, Education Sponsored"
							onChange={this.props.onSearchChange}
						/>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		ninput: prepareNaturalInput(state.cubes.all)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,

		onSearchChange(data) {			
			dispatch({ type: "CUBES_SET", payload: data.options.cube });
			dispatch({ type: "DRILLDOWN_SET", payload: data.options.dimension });
			dispatch({ type: "MEASURE_SET", payload: data.options.measure });
			dispatch({
				type: "VIZ_FULL_UPDATE",
				dimension: data.options.dimension.name,
				measure: data.options.measure.name
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelSearch);
