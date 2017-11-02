import React from "react";
import { connect } from "react-redux";

import FilterManager from "components/FilterManager";
import CustomSelect from "components/CustomSelect";
import SelectChartType from "components/SelectChartType";

import { generateColorSelector } from "helpers/prepareInput";
import { getCoherentMeasures } from "helpers/manageData";

import "styles/AreaSidebar.css";

function Panel(props) {

	const measures = getCoherentMeasures(props.viztype, props.all_ms)
	
	switch (props.viztype) {
		case "treemap":
			return (
				<div>
					<div className="group">
						<span className="label">sized by</span>
						<CustomSelect
							value={props.measure}
							items={measures}
							onItemSelect={props.onSetMeasure}
						/>
					</div>
					<div className="group">
						<span className="label">grouped by</span>
						<CustomSelect
							value={props.groupBy}
							items={props.all_dd}
							onItemSelect={props.onSetGrouping}
						/>
					</div>
					<div className="group">
						<span className="label">depth by</span>
						<CustomSelect
							value={props.groupBy}
							items={props.all_dd}
							onItemSelect={props.onSetGrouping}
						/>
					</div>
				</div>
			);
		case "donut":
		case "pie":
		case "stacked":
		case "bar":
			return (
				<div>
					<div className="group">
						<span className="label">sized by</span>
						<CustomSelect
							value={props.measure}
							items={measures}
							onItemSelect={props.onSetMeasure}
						/>
					</div>
				</div>
			);

		case "bubble":
			return (
				<div>
					<div className="group">
						<span className="label">X Axis</span>
						<CustomSelect
							value={props.measure}
							items={measures}
							onItemSelect={props.onSetMeasure}
						/>
					</div>
					<div className="group">
						<span className="label">Y Axis</span>
						<CustomSelect
							value={props.measure}
							items={measures}
							onItemSelect={props.onSetMeasure}
						/>
					</div>
				</div>
			);
		default:
			return <div />;
	}
}

function Sidebar(props) {
	return (
		<div className="side-panel">
			<div className="group">
				<span className="label">Dataset</span>
				<CustomSelect
					value={props.cube}
					items={props.all_cb}
					onItemSelect={props.onSetCube}
				/>
			</div>
			<div className="group">
				<span className="label">I want to see</span>
				<CustomSelect
					value={props.drilldown}
					items={props.all_dd}
					onItemSelect={props.onSetDrilldown}
				/>
			</div>
			<div className="group">
				<span className="label">shown as a</span>
				<SelectChartType
					value={props.viztype}
					onItemSelect={props.onSetViztype}
				/>
			</div>

			{Panel(props)}

			<div className="group">
				<span className="label">colored by</span>
				<CustomSelect
					value={props.colorBy}
					items={props.all_cl}
					onItemSelect={props.onSetColorIndex}
				/>
			</div>

			<FilterManager
				filters={props.filters}
				measures={props.cube.measures}
				dimensions={props.cube.dimensions}
				members={props.members}
				onAddFilter={props.addFilter}
				onUpdateFilter={props.updateFilter}
				onRemoveFilter={props.removeFilter}
			/>
		</div>
	);
}

/**
 * @param {VizbuilderState} state
 */
function mapStateToProps(state) {
	let currentCb = state.cubes.current,
		currentDd = state.aggregators.drilldowns[0] || {},
		currentMs = state.aggregators.measures[0] || {},
		currentGb = state.aggregators.groupBy[0] || {},
		currentCl = state.aggregators.colorBy[0] || {};

	let colorMeasureFilter = RegExp("growth|average|median|percent", "i"),
		treemapMeasureFilter = RegExp("average|median", "i");

	let all_cl = generateColorSelector(currentCb.measures);
	currentCl = all_cl.find(item => item.measure == currentCl) || all_cl[0];

	return {
		cube: currentCb,
		drilldown: currentDd,
		viztype: state.visuals.chart.type,
		measure: currentMs,
		groupBy: currentGb,
		colorBy: currentCl,

		filters: state.filters,
		members: state.members,

		all_cb: state.cubes.all,
		all_dd: currentCb.stdDrilldowns,
		all_ms: currentCb.measures,
		all_cl: generateColorSelector(currentCb.measures)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onSetCube(item) {
			dispatch({ type: "CUBES_SET", payload: item });
		},

		onSetDrilldown(item) {
			dispatch({ type: "DRILLDOWN_SET", payload: item });
		},

		onSetViztype(item) {
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: item.name });
		},

		onSetMeasure(item) {
			dispatch({ type: "MEASURE_SET", payload: item });
		},

		onSetGrouping(item) {
			dispatch({ type: "GROUPBY_SET", payload: item });
		},

		onSetColorIndex(item) {
			dispatch({
				type: "COLORBY_SET",
				payload: item.measure,
				growth: item.growthType
			});
		},

		addFilter(filter) {
			dispatch({ type: "FILTER_ADD", payload: filter });
		},

		updateFilter(filter) {
			dispatch({ type: "FILTER_UPDATE", payload: filter });
		},

		removeFilter(filter) {
			dispatch({ type: "FILTER_DELETE", payload: filter });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
