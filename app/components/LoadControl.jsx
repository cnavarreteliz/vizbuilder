import React from "react";
import { connect } from "react-redux";
import isEqualWith from "lodash/isEqualWith";
import union from "lodash/union";

import { resetClient, requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";
import { pickUnconflictingTimeDrilldown } from "helpers/manageDimensions";

import { Overlay, ProgressBar } from "@blueprintjs/core";
import { ErrorToaster } from "components/ErrorToaster";

const compareByKeys = (prev, next) => prev.key == next.key;

/**
 * @typedef LoadControlProps
 * @prop {string} [src] URL for the current visualization's database
 * @prop {Cube} cube Current cube
 * @prop {Array<Level>} drilldowns Drilldowns
 * @prop {Array<Measure>} measures Measures
 * @prop {boolean} loading Loading state
 * @prop {Error} error Last error
 * @prop {(message: ReduxMessage|Promise|Function) => void} [dispatch]
 */

/** @augments {React.Component<LoadControlProps>} */
class LoadControl extends React.Component {
	componentDidMount() {
		resetClient(this.props.src);
		this.props.dispatch(requestCubes);
	}

	/** @param {LoadControlProps} prev */
	componentDidUpdate(prev) {
		const { cube, drilldowns, measures } = this.props;

		if (
			!isEqualWith(prev.drilldowns, drilldowns, compareByKeys) ||
			!isEqualWith(prev.measures, measures, compareByKeys) ||
			!isEqualWith(prev.cube, cube, compareByKeys)
		) {
			let query = buildQuery(cube, drilldowns, measures, []);
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
function mapStateToProps(state) {
	let cube = state.cubes.current;

	let measures = union(state.aggregators.measures, state.aggregators.colorBy);
	let drilldowns = union(
		state.aggregators.drilldowns,
		state.aggregators.groupBy
	);

	let time_dd = pickUnconflictingTimeDrilldown(cube, drilldowns);
	time_dd && drilldowns.push(time_dd);

	let filters = state.filters.reduce(
		(all, filter) => {
			let kind = filter.property.kind;
			all[kind].push(filter.property);
			return all;
		},
		{ measure: [], level: [] }
	);

	drilldowns = union(drilldowns, filters.level);
	measures = union(measures, filters.measure);

	return {
		cube,
		drilldowns,
		measures,
		loading: state.cubes.fetching || state.data.fetching,
		error: state.cubes.error || state.data.error
	};
}

export default connect(mapStateToProps)(LoadControl);
