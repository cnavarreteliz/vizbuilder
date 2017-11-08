import React from "react";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import union from "lodash/union";

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
 * @prop {Array<Filter>} cuts Cuts
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
		const { cube, drilldowns, measures, cuts, urlQuery } = this.props;

		if (
			!isEqual(prev.drilldowns, drilldowns) ||
			!isEqual(prev.measures, measures) ||
			!isEqual(prev.cuts, cuts) ||
			!isEqual(prev.cube, cube)
		) {
			let query = buildQuery(cube, drilldowns, measures, cuts);
			query && this.props.dispatch(requestQuery(query));

			if(urlQuery) {
				this.props.onSetCube(cube);
				this.props.onSetDrilldown(drilldowns);
				this.props.onSetMeasure(measures)
			}

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
	};

	if (data.length > 0) {
		let currentCb;
		query.split("&").map(item => {
			let params = item.split("=");
			
			if (params[0] === "cb") {
				currentCb = data.find(item => item.name === params[1]);
				output.cube = currentCb;
			} else if (params[0] === "dd") {
				params[1].split(",").map(level => {
					output.drilldowns.push(
						currentCb.levels.find(item => item._publicName === decodeURI(level))
					);
				});
			} else if (params[0] === "ms") {
				params[1].split(",").map(ms => {
					
					output.measures.push(
						currentCb.measures.find(item => item.name === decodeURI(ms))
					);
				});
			}
		});
	}

	return output;
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

	/* let filters = state.filters.reduce(
		(all, filter) => {
			if (filter.property) {
				let kind = filter.property.kind;
				all[kind].push(filter.property);
			}
			return all;
		},
		{ measure: [], level: [] }
	); */

	let hash = ownProps.search.substring(1);
	if (ownProps.slug === "query" && hash.length > 0) {
		let query = getDataFromQuery(hash, state.cubes.all)
		if(query.cube) cube = query.cube
		if(query.drilldowns) drilldowns = query.drilldowns
		if(query.measures) measures = query.measures
		
	}

	return {
		cube,
		drilldowns,
		measures: union(measures, filters.ms),
		cuts: filters.lv,
		loading: state.cubes.fetching || state.data.fetching,
		error: state.cubes.error || state.data.error,
		urlQuery: hash.length > 0
	};
}

/**
 * 
 * @param {{ms: Array<Measure>, lv: Array<Filter>}} all 
 * @param {Filter} filter 
 */
function filterKindReducer(all, filter) {
	if (!filter.property) return all;

	if (filter.property.kind == "level" && filter.value.length) {
		all.lv.push(filter);
	} else if (
		filter.property.kind == "measure" &&
		filter.operator &&
		filter.value
	) {
		all.ms.push(filter.property);
	}

	return all;
}
function mapDispatchToProps(dispatch) {
	return {
		dispatch,

		onSetCube(item) {
			dispatch({ type: "CUBES_SET", payload: item });
		},

		onSetDrilldown(item) {
			dispatch({ type: "DRILLDOWN_SET", payload: item });
		},

		onSetMeasure(item) {
			dispatch({ type: "MEASURE_SET", payload: item });
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(LoadControl);
