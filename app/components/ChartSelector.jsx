import React from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";

import "styles/ChartSelector.css";

function ChartAxis(props) {
	switch (props.panel) {
		case "PANEL_TYPE_NORMAL":
			return (
				<div>
					<label className="pt-label pt-inline">
						Dimension
						<div className="pt-select">
							<select
								value={props.axis_x}
								onChange={evt => props.onSetAxis("x", evt.target.value)}
							>
								<option>Select...</option>
								{props.label_axis_x.map(item => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
					</label>
					<label className="pt-label pt-inline">
						Size
						<div className="pt-select">
							<select
								value={props.axis_y}
								onChange={evt => props.onSetAxis("y", evt.target.value)}
							>
								<option>Select...</option>
								{props.label_axis_y.map(item => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
					</label>
				</div>
			);
		case "PANEL_TYPE_2D":
			return (
				<div>
					<label className="pt-label pt-inline">
						Axis
						<div className="pt-select">
							<select
								value={props.axis_x}
								onChange={evt => props.onSetAxis("x", evt.target.value)}
							>
								<option>Select...</option>
								{props.label_axis_x.map(item => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
					</label>
					<label className="pt-label pt-inline">
						Value
						<div className="pt-select">
							<select
								value={props.axis_y}
								onChange={evt => props.onSetAxis("y", evt.target.value)}
							>
								<option>Select...</option>
								{props.label_axis_y.map(item => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
					</label>
				</div>
			);
	}
}

function ChartSelector(props) {
	return (
		<div className="chartoptions-wrapper">
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
				{ChartAxis(props)}
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		panel: state.visuals.panel,
		type: state.visuals.type,
		label_axis_x: state.aggregators.drilldowns.map(e => e.name),
		label_axis_y: state.aggregators.measures.map(e => e.name),
		properties: Object.keys(state.data.values[0] || {}),
		axis_x: state.visuals.axis.x,
		axis_y: state.visuals.axis.y
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeViz(type, panel) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type, panel: panel });
		},

		onSetAxis(axis, property) {
			dispatch({ type: "VIZ_AXIS_UPDATE", axis, payload: property });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartSelector);
