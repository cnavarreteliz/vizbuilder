import React from "react";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import union from "lodash/union";
import queryString from 'query-string';

import { resetClient, requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";
import { filterKindReducer } from "helpers/filters";
import { pickUnconflictingTimeDrilldown } from "helpers/manageDimensions";

import { Overlay, ProgressBar } from "@blueprintjs/core";
import { ErrorToaster } from "components/ErrorToaster";

/**
 * @typedef LoadControlProps
 * @prop {string} [src] URL for the current visualization's database
 * @prop {string} [queryString] query for specific properties
 * @prop {Cube} cube Current cube
 * @prop {Array<Level>} drilldowns Drilldowns
 * @prop {Array<Measure>} measures Measures
 * @prop {Array<Filter>} cuts Cuts
 * @prop {boolean} loading Loading state
 * @prop {Error} error Last error
 * @prop {(message: ReduxMessage|Promise|Function) => void} [dispatch]
 */

/** @augments {React.Component<LoadControlProps>} */
class LoadControl extends React.Component {
	componentDidMount() {
		resetClient(this.props.src);

		let params = queryString.parse(this.props.queryString);
		this.props.dispatch(requestCubes(params));
	}

	/** @param {LoadControlProps} prev */
	componentDidUpdate(prev) {
		const { cube, drilldowns, measures, cuts } = this.props;

		if (
			!isEqual(prev.drilldowns, drilldowns) ||
			!isEqual(prev.measures, measures) ||
			!isEqual(prev.cuts, cuts) ||
			!isEqual(prev.cube, cube)
		) {
			let query = buildQuery(cube, drilldowns, measures, cuts);
			query && this.props.dispatch(requestQuery(query));
		}
	}

	render() {
		let cube = this.props.cube,
			dimension = this.props.drilldowns[0];

		let message =
			cube && dimension
				? `Loading ${cube.name} by ${dimension.name}`
				: "Loading...";

		if (this.props.error) {
			ErrorToaster.show({ message: this.props.error.message });
		}

		return (
			<Overlay
				className="progress-overlay"
				isOpen={this.props.loading}
				canEscapeKeyClose={false}
				canOutsideClickClose={false}
			>
				<div className="progress-content">
					<p className="progress-label">{message}</p>
					<ProgressBar className="progress-bar" />
				</div>
			</Overlay>
		);
	}
}

/** 
 * @param {VizbuilderState} state 
 * @returns {LoadControlProps}
*/
function mapStateToProps(state, ownProps) {
	let cube = state.cubes.current;

	let measures = union(state.aggregators.measures, state.aggregators.colorBy);
	let drilldowns = union(
		state.aggregators.drilldowns,
		state.aggregators.groupBy
	);

	let filters = state.filters.reduce(filterKindReducer, { ms: [], lv: [] });

	let time_dd = pickUnconflictingTimeDrilldown(cube, drilldowns);
	time_dd && drilldowns.push(time_dd);

	return {
		cube,
		drilldowns,
		measures: union(measures, filters.ms),
		cuts: filters.lv,
		loading: state.cubes.fetching || state.data.fetching,
		error: state.cubes.error || state.data.error
	};
}

export default connect(mapStateToProps)(LoadControl);
