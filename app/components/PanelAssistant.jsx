import React, { Component } from "react";
import { connect } from "react-redux";
import PanelAggregators from "components/PanelAggregators";

import "styles/Assistant.css";

function Assistant(props) {
	return (
		<div className="panel-assistant">
			<PanelAggregators />
		</div>
	);
}

function mapDispatchToProps(dispatch) {
	return {
		onClickAssistant(cube, dimension, measure) {
			dispatch({ type: "AXIS_UPDATE", cube, dimension, measure });
			return false;
		}
	};
}

export default connect(null, mapDispatchToProps)(Assistant);
