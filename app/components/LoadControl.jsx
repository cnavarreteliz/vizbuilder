import React from "react";
import { connect } from "react-redux";
import isEqual from "lodash/isEqual";
import union from "lodash/union";

import { resetClient, requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";

import { Overlay, ProgressBar } from "@blueprintjs/core";

/**
 * @typedef LoadControlProps
 * @prop {string} src URL for the current visualization's database
 * @prop {Cube} cube Current cube
 * @prop {Array<Drillable>} dd Drilldowns
 * @prop {Array<Drillable>} gb Group-by property
 * @prop {Array<Drillable>} ct Cuts
 * @prop {Array<Measure>} ms Measures
 * @prop {Array<Measure>} cl Color-by property
 * @prop {boolean} loading
 * @prop {Function} dispatch
 */

/** @augments {React.Component<LoadControlProps>} */
class LoadControl extends React.Component {
	componentDidMount() {
		resetClient(this.props.src);
		this.props.dispatch(requestCubes);
	}

	componentDidUpdate(prev) {
		const { cube, dd, gb, ms, cl, ct } = this.props;

		if (
			!isEqual(prev.cube, cube) ||
			!isEqual(prev.dd, dd) ||
			!isEqual(prev.gb, gb) ||
			!isEqual(prev.ms, ms) ||
			!isEqual(prev.cl, cl) ||
			!isEqual(prev.ct, ct)
		) {
			let query = buildQuery(cube, union(dd, gb), union(ms, cl), ct);
			this.props.dispatch(requestQuery(query));
		}
	}

	render() {
		return (
			<Overlay
			className='progress-overlay'
				isOpen={this.props.loading}
				canEscapeKeyClose={false}
				canOutsideClickClose={false}
			>
				<ProgressBar className='progress-bar' />
			</Overlay>
		);
	}
}

/** @param {VizbuilderState} state */
function mapStateToProps(state) {
	return {
		cube: state.cubes.current,
		dd: state.aggregators.drilldowns,
		gb: state.aggregators.groupBy,
		cl: state.aggregators.colorBy,
		ms: state.aggregators.measures,
		ct: [],
		loading: state.cubes.fetching || state.data.fetching
	};
}

export default connect(mapStateToProps)(LoadControl);
