import React from "react";
import { connect } from "react-redux";

import { requestQuery } from "actions/datasource";
import { buildQuery } from "helpers/mondrian";

class LoadControl extends React.Component {
	componentDidUpdate(prev) {
		const { cb, dd, ms, ct } = this.props;

		if (
			cb.name !== prev.cb.name ||
			dd.length !== prev.dd.length ||
			ms.length !== prev.ms.length ||
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
