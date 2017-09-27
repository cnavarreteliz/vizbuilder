import React from "react";
import { connect } from "react-redux";
import Selector from "components/InputSelect";
import { FIRST_YEAR, LATEST_YEAR } from "helpers/consts";

import { RangeSlider, Switch, Slider } from "@blueprintjs/core";

import "styles/ChartOptions.css";

function YearlyGrowth(show) {
	const { onGrowthToggle } = props;
	if (show) {
		return (
			<Switch
				onChange={evt => onGrowthToggle(evt.target.checked)}
				label={"Yearly growth"}
			/>
		);
	}
}

function ChartOptions(props) {
	const { onSetTimeAxis, onChangeColorScale, onChangeTimeAxis } = props;
	return (
		<div className="chartoptions-wrapper">
			<div>
				{/*<RangeSlider
					min={FIRST_YEAR - 1}
					max={LATEST_YEAR + 1}
					onChange={onChangeTimeAxis}
					stepSize={1}
                    labelStepSize={1}
					value={props.range}
				/>*/}
			</div>
			<div className="item">
				<div>Color </div>
				<div>
					<Selector
						options={prepareSelectorColor(props.y.labels).filter(
							e =>
								e.label.includes("Growth") ||
								e.label.includes("Average") ||
								e.label.includes("Median") ||
								e.label.includes("Percent")
						)}
						value={props.colorScale}
						onChange={evt =>
							props.onChangeColorScale(
								props.current,
								props.y.current,
								evt.target.value
							)}
					/>
				</div>
			</div>
			<div className="item">{YearlyGrowth(props.show_yg)}</div>
		</div>
	);
}

function prepareSelectorColor(obj) {
	return obj.map(e => {
		return {
			label: e.name,
			value: e.name
		};
	});
}

function mapStateToProps(state) {
	return {
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,

		colorScale: state.visuals.chart.colorScale,
		current: state.cubes.current,
		show_yg: state.visuals.timeDimension,

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

			/*dispatch({ type: "MEASURE_SET", payload: measures });
			if (measures.filter(item => item == property).length == 0) {
				let measure = cube.measures.filter(item => item.name == property);
				dispatch({ type: "MEASURE_ADD", payload: measure });
			}

			*/
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

		onChangeTimeAxis(property) {
			dispatch({ type: "VIZ_RANGE_UPDATE", payload: property });
		},

		onSetAxis(axis, property) {
			dispatch({ type: "VIZ_AXIS_UPDATE", axis, payload: property });
		},

		onGrowthToggle(checked) {
			const scale = checked ? "growth" : "colorScale";
			dispatch({ type: "VIZ_COLOR_UPDATE", payload: scale });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartOptions);
