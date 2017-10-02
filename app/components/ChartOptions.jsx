import React from "react";
import { connect } from "react-redux";
import Selector from "components/InputSelect";
import { FIRST_YEAR, LATEST_YEAR } from "helpers/consts";

import { RangeSlider, Switch, Slider } from "@blueprintjs/core";

import "styles/ChartOptions.css";

function ChartOptions(props) {
	const { onSetTimeAxis, onChangeColorScale, onChangeTimeAxis } = props;
	return (
		<div className="chartoptions-wrapper">
			{/*<RangeSlider
				min={FIRST_YEAR}
				max={LATEST_YEAR}
				onChange={onChangeTimeAxis}
				stepSize={1}
				labelStepSize={1}
				value={props.range}
			/>*/}
		</div>
	);
}

function mapStateToProps(state) {
	let current_cb = state.cubes.current
	return {
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,

		colorScale: state.visuals.chart.colorScale,
		current: current_cb,
		current_td: current_cb.drilldowns.filter(dm => dm.dimensionType === 1),

		range: state.visuals.range,

		y: {
			labels: state.cubes.current
				? state.cubes.current.measures
				: state.aggregators.measures,
			value: state.visuals.axis.y,
			current: state.aggregators.measures
		}
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeColorScale(cube, measures, property) {
			let measure = cube.measures.filter(item => item.name == property);
			dispatch({ type: "MEASURE_ADD", payload: measure });
			dispatch({ type: "VIZ_COLOR_UPDATE", payload: property });
		},

		onSetTimeAxis(property) {
			dispatch({ type: "DRILLDOWN_ADD", payload: property.value });
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "year",
				payload: property.label
			});
		},

		onChangeTimeAxis(property) {
			dispatch({ type: "VIZ_RANGE_UPDATE", payload: property });
		},

		onGrowthToggle(checked, dd) {
			dispatch({ type: "DRILLDOWN_ADD", payload: dd });
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "year",
				payload: dd.name
			});
			const scale = checked ? "growth" : "";
			dispatch({ type: "VIZ_GROWTH_UPDATE", payload: checked });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartOptions);
