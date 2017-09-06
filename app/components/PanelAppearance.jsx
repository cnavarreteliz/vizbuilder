import React from "react";
import Select from "react-select";
import { connect } from "react-redux";

import icons from "data/visual-options.json";

import "styles/PanelAppearance.css";

function PanelAppearance(props) {
	return (
		<div className="appearance-wrapper">
			<div className="title">{props.type}</div>

			<div className="icons">
				{icons.map(icon =>
					React.createElement("img", {
						title: icon.title,
						className: props.type == icon.name ? "icon active" : "icon",
						src: "/images/viz/icon-" + icon.name + ".svg",
						onClick() {
							props.onChangeViz(icon.name, icon.panel);
						}
					})
				)}
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		panel: state.visuals.panel,
		type: state.visuals.type
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeViz(type, panel) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type, panel: panel });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelAppearance);
