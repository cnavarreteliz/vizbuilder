import React from "react";
import Select from "react-select";
import { connect } from "react-redux";

import icons from "data/visual-options.json";
import CustomSelector from "components/InputSelect";
import PanelAggregators from "components/PanelAggregators";
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
						options={prepareSelector(props.x.labels)}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						title="Size"
						options={prepareSelector(props.y.labels)}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
					<CustomSelector
						title="Color"
						options={prepareSelectorColor(props.y.labels)}
						value={props.colorScale}
						onChange={onChangeColorScale}
					/>
				</div>
			);
		case "PANEL_TYPE_2D":
			return (
				<div>
					<CustomSelector
						title="Axis"
						options={prepareSelector(props.x.labels)}
						value={props.x.value}
						onChange={evt => props.onSetAxis("x", evt.target.value)}
					/>
					<CustomSelector
						title="Value"
						options={prepareSelector(props.y.labels)}
						value={props.y.value}
						onChange={evt => props.onSetAxis("y", evt.target.value)}
					/>
					<Select
						options={prepareSelector(props.year.labels)}
						selectValue={
							props.year.value.length > 0 ? (
								prepareSelector(props.year.labels).filter(
									e => e.label == props.year.value
								)[0].value
							) : null
						}
						placeholder="Time Dimension"
						onChange={onSetTimeAxis}
					/>
				</div>
			);
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
			<PanelAggregators />
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

function mapStateToProps(state) {
	return {
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,
		colorScale: state.visuals.chart.colorScale,

		x: {
			labels: state.aggregators.drilldowns,
			value: state.visuals.axis.x
		},

		y: {
			labels: state.aggregators.measures,
			value: state.visuals.axis.y
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
		onChangeColorScale(property) {
			dispatch({ type: "VIZ_COLOR_UPDATE", payload: property.target.value });
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
