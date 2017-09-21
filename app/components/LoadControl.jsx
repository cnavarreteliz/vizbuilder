import React from "react";
import { connect } from "react-redux";

import { requestCubes, requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";

class LoadControl extends React.Component {
	componentDidMount() {
		this.props.dispatch(requestCubes);
	}

	componentDidUpdate(prev) {
		const { cb, dd, ms, ct } = this.props;

		if (
			cb.key !== prev.cb.key ||
			(dd.length && prev.dd.length && dd[0].key !== prev.dd[0].key) || 
			(ms.length && prev.ms.length && ms[0].key !== prev.ms[0].key) ||
			ct.length !== prev.ct.length
		) {
			let query = buildQuery(cb, dd, ms, ct);
			this.props.dispatch(requestQuery(query));
		}
	}

	render() {
		return null;
	}
}

function mapStateToProps(state) {
	return {
		cb: state.cubes.current,
		dd: state.aggregators.drilldowns,
		ms: state.aggregators.measures,
		ct: []
	};
}

export default connect(mapStateToProps)(LoadControl);
