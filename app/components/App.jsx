import React from "react";
import CHARTS from "helpers/charts";

import { prepareHierarchy } from "helpers/prepareHierarchy";
import { connect } from "react-redux";

import AreaContent from "components/AreaContent";
import AreaTop from "components/AreaTop";
import LoadControl from "components/LoadControl";

import "nprogress/nprogress.css";
import "styles/App.css";

function App(props) {
	return (
		<div className="container">
			<LoadControl />
			<AreaTop />
			<AreaContent />
		</div>
	);
}

function mapDispatchToProps(dispatch) {
	return {
		onMeasureChange(measure) {
			dispatch({ type: "MEASURE_ADD", payload: measure });
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "y",
				payload: measure.name
			});
		},

		onDrilldownAdd(dim) {
			dispatch({ type: "DRILLDOWN_ADD", payload: dim });
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "x",
				payload: dim.name
			});
		},

		onChangeViz(type, panel) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type, panel: panel });
		}
	};
}

export default connect(null, mapDispatchToProps)(App);
