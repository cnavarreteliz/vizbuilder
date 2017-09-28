import React from "react";
import { connect } from "react-redux";
import zip from "lodash/zip";
import union from "lodash/union";

import { requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";

function simpleCompare(elements) {
	return elements[0] !== elements[1];
}

class LoadControl extends React.Component {
	componentDidMount() {
		this.props.dispatch(requestCubes);
	}

	componentDidUpdate(prev) {
		const { cube, dd, gb, ms, cl, ct } = this.props;

		if (
			(cube && cube.key && cube.key !== prev.cube.key) ||
			zip(prev.dd, dd).some(simpleCompare) ||
			zip(prev.gb, gb).some(simpleCompare) ||
			zip(prev.ms, ms).some(simpleCompare) ||
			zip(prev.cl, cl).some(simpleCompare) ||
			zip(prev.ct, ct).some(simpleCompare)
		) {
			let query = buildQuery(cube, union(dd, gb), union(ms, cl), ct);
			this.props.dispatch(requestQuery(query));
		}
	}

	render() {
		return null;
	}
}

function mapStateToProps(state) {
	return {
		cube: state.cubes.current,
		dd: state.aggregators.drilldowns,
		gb: state.aggregators.groupBy,
		cl: state.aggregators.colorBy,
		ms: state.aggregators.measures,
		ct: []
	};
}

export default connect(mapStateToProps)(LoadControl);
