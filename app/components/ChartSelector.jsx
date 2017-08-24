import React from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";

import "styles/ChartSelector.css";

function ChartSelector(props) {
	return (
		<div className="charttype-wrapper">
			{icons.map(icon =>
				React.createElement("img", {
					title: icon.title,
					className: props.type == icon.name ? "icon active" : "icon",
					src: "/images/viz/icon-" + icon.name + ".svg",
					onClick() {
						props.onChangeViz(icon.name);
					}
				})
			)}
		</div>
	);
}

function mapStateToProps(state) {
	return {
		type: state.visuals.type
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeViz(type) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type });
		}
	};
}

export default connect(null, mapDispatchToProps)(ChartSelector);
