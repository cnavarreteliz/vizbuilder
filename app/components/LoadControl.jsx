import React from "react";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import union from "lodash/union";
import differenceBy from 'lodash/differenceBy';

import { resetClient, requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";
import { pickUnconflictingTimeDrilldown } from "helpers/manageDimensions";

import { Overlay, ProgressBar } from "@blueprintjs/core";
import { ErrorToaster } from "components/ErrorToaster";

/**
 * @typedef LoadControlProps
 * @prop {string} [src] URL for the current visualization's database
 * @prop {Cube} cube Current cube
 * @prop {Array<Level>} drilldowns Drilldowns
 * @prop {Array<Measure>} measures Measures
 * @prop {Array<Cut>} cuts Cuts
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
			//differenceBy(prev.drilldowns, drilldowns, 'key').length ||
			//differenceBy(prev.measures, measures, 'key').length ||
			!isEqual(prev.drilldowns, drilldowns) ||
			!isEqual(prev.measures, measures) ||
			!isEqual(prev.cube, cube)
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



function getDataFromQuery(query, data) {
	let output = {
		cube: [],
		drilldowns: [],
		measures: []
	}
	query.split("&").map(item => {
		let params = item.split("=")
		if (params[0] === "cb") {
			output.cube = data.find(item => item.name === params[1])
		} else if(params[0] === "dd") {

		} else if(params[0] === "ms") {

		}
	})

	return output
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

	let time_dd = pickUnconflictingTimeDrilldown(cube, drilldowns);
	time_dd && drilldowns.push(time_dd);

	let filters = state.filters.reduce(
		(all, filter) => {
			if (filter.property) {
				let kind = filter.property.kind;
				all[kind].push(filter.property);
			}
			return all;
		},
		{ measure: [], level: [] }
	);

	let hash = ownProps.search.substring(1)
	if (ownProps.slug === "query" && hash.length > 0) {
		console.log(getDataFromQuery(hash, state.cubes.all))
	}

	return {
		cube,
		drilldowns: union(drilldowns, filters.level),
		measures: union(measures, filters.measure),
		cuts: state.filters.filter(validFilter).map(filter => ({level: filter.property, members: filter.values})),
		loading: state.cubes.fetching || state.data.fetching,
		error: state.cubes.error || state.data.error
	};
}

function validFilter(filter) {
	return filter.property && filter.property.kind == 'level' && filter.value;
}

export default connect(mapStateToProps)(LoadControl);
