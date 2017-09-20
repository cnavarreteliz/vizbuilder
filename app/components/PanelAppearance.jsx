import React from "react";
import Select from "react-select";
import { connect } from "react-redux";

import CHARTS from "helpers/charts";
import CustomSelector from "components/InputSelect";
import { prepareHierarchy } from "helpers/prepareHierarchy";

import "styles/PanelAppearance.css";
import "react-select/dist/react-select.css";

function ChartAxis(props) {
	const { onSetTimeAxis, onChangeColorScale } = props;

	switch (props.panel) {
		case "PANEL_TYPE_NORMAL":
			return (
				<div>
					<CustomSelector
						title="Dimension"
						options={prepareSelectorColor(props.x.labels)}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						title="Size"
						options={prepareSelectorColor(props.y.labels)}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
				</div>
			);
		case "PANEL_TYPE_2D":
			return (
				<div>
					<CustomSelector
						title="Axis"
						options={prepareSelectorColor(props.x.labels)}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						title="Value"
						options={prepareSelectorColor(props.y.labels)}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
				</div>
			);
		case "PANEL_TYPE_TABLE":
			return null;
	}
}

function PanelAppearance(props) {
	return (
		<div className="appearance-wrapper">
			<div className="title">{props.type}</div>

			<div className="icons">
				{CHARTS.map(chart =>
					React.createElement("img", {
						title: chart.name,
						className: props.type == chart.name ? "icon active" : "icon",
						src: require("assets/charts/icon-" + chart.name + ".svg"),
						onClick() {
							props.onChangeViz(chart.name, icon.panel);
						}
					})
				)}
			</div>
			{ChartAxis(props)}
		</div>
	);
}

function prepareSelector(obj) {
	return []
		.concat(obj)
		.filter(Boolean)
		.map(e => ({
			label: e.name,
			value: e
		}));
}

function prepareSelectorColor(obj) {
	return []
		.concat(obj)
		.filter(Boolean)
		.map(e => ({
			label: e.name,
			value: e.name
		}));
}

// Detect Time Dimension in Series
function timeDimensions(dims) {
	dims = []
		.concat(dims)
		.filter(Boolean)
		.filter(e => e.dimensionType == 1);
	return prepareHierarchy(dims);
}

function mapStateToProps(state, ownProps) {
	return {
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,
		//colorScale: state.cubes.current ? state.cubes.current.measures : {},
		colorScale: state.visuals.chart.colorScale,
		current: state.cubes.current,

		x: {
			labels: state.aggregators.drilldowns,
			value: state.visuals.axis.x
		},

		y: {
			labels: state.cubes.current.measures,
			value: state.visuals.axis.y,
			current: state.aggregators.measures
		},

		year: {
			labels: timeDimensions(state.cubes.current.dimensions),
			value: state.visuals.axis.year
		}
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeColorScale(cube, measures, property) {
			if (measures.filter(item => item == property).length == 0) {
				let measure = cube.measures.filter(item => item.name == property);
				dispatch({ type: "MEASURE_ADD", payload: measure });
			}

			dispatch({ type: "VIZ_COLOR_UPDATE", payload: property });
		},

		onChangeViz(type, panel) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: type, panel: panel });
		},

		onSetTimeAxis(property) {
			dispatch({ type: "DRILLDOWN_ADD", payload: property.value });
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "year",
				payload: property.label
			});
		},

		onSetAxis(axis, property) {
			dispatch({ type: "VIZ_AXIS_UPDATE", axis, payload: property });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelAppearance);
