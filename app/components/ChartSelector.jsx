import React from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";

import "styles/ChartSelector.css";

function CustomSelector(props) {
	return (
		<label className="pt-label pt-inline">
			{props.name}
			<div className="pt-select">
				<select value={props.value} onChange={props.onChange}>
					<option>Select...</option>
					{props.options.map(item =>
						<option value={item}>
							{item}
						</option>
					)}
				</select>
			</div>
		</label>
	);
}

function ChartAxis(props) {
	switch (props.panel) {
		case "PANEL_TYPE_NORMAL":
			return (
				<div>
					<CustomSelector
						name="Dimension"
						options={props.x.labels}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						name="Size"
						options={props.y.labels}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
				</div>
			);
		case "PANEL_TYPE_2D":
			return (
				<div>
					<CustomSelector
						name="Axis"
						options={props.x.labels}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						name="Value"
						options={props.y.labels}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
					<CustomSelector
						name="Year"
						options={props.year.labels}
						value={props.year.value}
						onChange={evt => props.onSetAxis("year", evt.target.value)}
					/>
				</div>
			);
	}
}

function ChartSelector(props) {
	return (
		<div className="chartoptions-wrapper">
			<div className="title">
				{props.type}
			</div>
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

		x: {
			labels: state.aggregators.drilldowns.map(e => e.name),
			value: state.visuals.axis.x
		},

		y: {
			labels: state.aggregators.measures.map(e => e.name),
			value: state.visuals.axis.y
		},

		year: {
			labels: state.aggregators.drilldowns.filter(e => e.name == "Year"),
			value: state.visuals.axis.year
		}
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
