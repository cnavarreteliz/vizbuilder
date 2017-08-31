import React from "react";
import { connect } from "react-redux";

import icons from "data/visual-options.json";

import "styles/ChartSelector.css";

function CustomSelector(name, props, axis) {
	return (
		<label className="pt-label pt-inline">
			{name}
			<div className="pt-select">
				<select
					value={props.axis[axis]}
					onChange={evt => props.onSetAxis(axis, evt.target.value)}
				>
					<option>Select...</option>
					{props.label_axis[axis].map(item => <option value={item}>{item}</option>)}
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
					{ CustomSelector('Dimension', props, 'x') }
					{ CustomSelector('Size', props, 'y') }
				</div>
			);
		case "PANEL_TYPE_2D":
			return (
				<div>
					{ CustomSelector('Axis', props, 'x') }
					{ CustomSelector('Value', props, 'y') }
					{ CustomSelector('Year', props, 'year') }
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
		label_axis: {
			x: state.aggregators.drilldowns.map(e => e.name),
			y: state.aggregators.measures.map(e => e.name),
			year: state.aggregators.drilldowns.filter(e => e.name == "Year")
		},
		properties: Object.keys(state.data.values[0] || {}),
		axis: {
			x: state.visuals.axis.x,
			y: state.visuals.axis.y,
			year: state.visuals.axis.year
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
