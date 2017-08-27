import React from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";

import "styles/ChartSelector.css";

function ChartSelector(props) {
	return (
		<div className="chartoptions-wrapper">
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
			<label className="pt-label pt-inline">
				X Axis
				<div className="pt-select">
					<select
						value={props.axis_x}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					>
						{props.properties.map(item =>
							<option value={item}>
								{item}
							</option>
						)}
					</select>
				</div>
			</label>
			<label className="pt-label pt-inline">
				Y Axis
				<div className="pt-select">
					<select
						value={props.axis_y}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					>
						{props.properties.map(item =>
							<option value={item}>
								{item}
							</option>
						)}
					</select>
				</div>
			</label>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		type: state.visuals.type,
		properties: Object.keys(state.data.values[0] || {}),
		axis_x: state.visuals.axis.x,
		axis_y: state.visuals.axis.y
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeViz(type) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type });
		},

		onSetAxis(axis, property) {
			dispatch({ type: "VIZ_AXIS_UPDATE", axis, payload: property });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartSelector);
