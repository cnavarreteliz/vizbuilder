import React from "react";
import Select from "react-select";
import { connect } from "react-redux";

import icons from "data/visual-options.json";
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
					<CustomSelector
						title="Color"
						options={prepareSelectorColor(props.y.labels)}
						value={props.colorScale}
						onChange={evt =>
							props.onChangeColorScale(
								props.current,
								props.y.current,
								evt.target.value
							)}
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
					Time Dimension
					<Select
						placeholder="ex. Year"
						options={prepareSelector(props.year.labels)}
						onChange={onSetTimeAxis}
					/>
				</div>
			);
		case "PANEL_TYPE_TABLE":
			return <div />
	}
}

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
			{ChartAxis(props)}
		</div>
	);
}

function prepareSelector(obj) {
	return obj.map(e => {
		return {
			label: e.name,
			value: e
		};
	});
}

function prepareSelectorColor(obj) {
	return obj.map(e => {
		return {
			label: e.name,
			value: e.name
		};
	});
}

// Detect Time Dimension in Series
function timeDimensions(obj) {
	return prepareHierarchy(obj.filter(e => e.dimensionType == 1));
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
			labels: state.cubes.current
				? state.cubes.current.measures
				: state.aggregators.measures,
			value: state.visuals.axis.y,
			current: state.aggregators.measures
		},

		year: {
			labels:
				state.cubes.current != null
					? timeDimensions(state.cubes.current.dimensions)
					: "",
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
