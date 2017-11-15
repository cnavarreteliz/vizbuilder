import React from "react";
import { connect } from "react-redux";

import FilterManager from "components/FilterManager";
import CustomSelect from "components/CustomSelect";
import SelectChartType from "components/SelectChartType";
import InputTable from "components/InputTable";

import union from "lodash/union";

import { requestMembers } from "actions/datasource";
import { colorSelector } from "helpers/selectors";
import { getCoherentMeasures } from "helpers/manageData";

import { Tag, Intent, Button } from "@blueprintjs/core";

import "styles/AreaSidebar.css";

function Panel(props) {
	const measures = getCoherentMeasures(props.viztype, props.all_ms);

	switch (props.viztype) {
		case "table":
			return (
				<div>
					<span className="label">attributes</span>
					<p>
						{union(props.measures, props.drilldowns).map(item => {
							return (
								<div className="filter-item">
									<span className="filter-content">
										<span className="filter-prop">{item.name}</span>
									</span>
									<Button
										className="filter-action remove pt-intent-danger pt-minimal"
										iconName="trash"
										onClick={evt => props.removeTag(item)}
									/>
								</div>
							);
						})}
					</p>
					<InputTable
						options={union(measures, props.all_dd)}
						onClick={props.onMeasureChange}
					/>
				</div>
			);
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
						<span className="label">colored by</span>
						<CustomSelect
							value={props.colorBy}
							items={props.all_cl}
							onItemSelect={props.onSetColorIndex}
						/>
					</div>
				</div>
			);

		case "lineplot":
		case "donut":
		case "pie":
		case "stacked":
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
						<span className="label">colored by</span>
						<CustomSelect
							value={props.colorBy}
							items={props.all_cl}
							onItemSelect={props.onSetColorIndex}
						/>
					</div>
				</div>
			);

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
					<div className="group">
						<span className="label">grouped by</span>
						<CustomSelect
							value={props.groupBy}
							items={props.all_dd}
							onItemSelect={props.onSetGrouping}
						/>
					</div>
					<div className="group">
						<span className="label">colored by</span>
						<CustomSelect
							value={props.colorBy}
							items={props.all_cl}
							onItemSelect={props.onSetColorIndex}
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
					<div className="group">
						<span className="label">colored by</span>
						<CustomSelect
							value={props.colorBy}
							items={props.all_cl}
							onItemSelect={props.onSetColorIndex}
						/>
					</div>
				</div>
			);
		default:
			return <div />;
	}
}

function Dataset(props) {
	if (props.all_cb.length > 1) {
		return (
			<div className="group">
				<span className="label">Dataset</span>
				<CustomSelect
					value={props.cube}
					items={props.all_cb}
					onItemSelect={props.onSetCube}
				/>
			</div>
		);
	} else {
		return <div />;
	}
}

function Sidebar(props) {
	const measures = getCoherentMeasures(props.viztype, props.all_ms);

	return (
		<div className="side-panel">
			{Dataset(props)}
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

			<FilterManager
				cube={props.cube}
				filters={props.filters}
				members={props.members}
				onAddFilter={props.addFilter}
				onUpdateFilter={props.updateFilter}
				onRemoveFilter={props.removeFilter}
				onLevelChosen={props.requestMembers}
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
		currentGw = state.aggregators.growthBy[0] || {},
		currentCl = state.aggregators.colorBy[0] || {};

	let colorMeasureFilter = RegExp("growth|average|median|percent", "i"),
		treemapMeasureFilter = RegExp("average|median", "i");

	let all_cl = colorSelector(currentCb.measures);

	if (state.aggregators.colorBy.length > 0) {
		currentCl = all_cl.find(
			item => item.measure === currentCl && item.type === "standard"
		);
	} else if (state.aggregators.growthBy.length > 0) {
		currentCl = all_cl.find(
			item => item.measure === currentGw && item.type === "growth"
		);
	} else {
		currentCl = all_cl[0];
	}

	return {
		cube: currentCb,
		drilldown: currentDd,
		viztype: state.visuals.chart.type,
		measure: currentMs,
		groupBy: currentGb,
		colorBy: currentCl,

		measures: state.aggregators.measures,
		drilldowns: state.aggregators.drilldowns,

		filters: state.filters,
		members: state.members,

		all_cb: state.cubes.all,
		all_dd: currentCb.stdLevels,
		all_ms: currentCb.measures,
		all_cl: colorSelector(currentCb.measures)
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
			dispatch({ type: "VIZ_TYPE_UPDATE", payload: item.key });
		},

		onSetMeasure(item) {
			dispatch({ type: "MEASURE_SET", payload: item });
		},

		onSetGrouping(item) {
			dispatch({ type: "GROUPBY_SET", payload: item });
			dispatch(requestMembers(item));
		},

		onSetColorIndex(item) {
			if (item.type === "standard") {
				dispatch({
					type: "COLORBY_SET",
					payload: item.measure
				});
			} else if (item.type === "growth") {
				dispatch({
					type: "GROWTHBY_SET",
					payload: item.measure
				});
			} else {
				dispatch({
					type: "COLORBY_DELETE"
				});
			}
		},

		onMeasureChange(item) {
			if (item.kind === "measure") {
				dispatch({ type: "MEASURE_ADD", payload: item });
			} else if (item.kind === "level") {
				dispatch({ type: "DRILLDOWN_ADD", payload: item });
			}
		},

		requestMembers(level) {
			dispatch(requestMembers(level));
		},

		addFilter(filter) {
			dispatch({ type: "FILTER_ADD", payload: filter });
		},

		updateFilter(filter) {
			dispatch({ type: "FILTER_UPDATE", payload: filter });
		},

		removeFilter(filter) {
			dispatch({ type: "FILTER_DELETE", payload: filter });
		},

		removeTag(item) {
			if (item.kind === "measure") {
				dispatch({ type: "MEASURE_DELETE", payload: item });
			} else if (item.kind === "level") {
				dispatch({ type: "DRILLDOWN_DELETE", payload: item });
			}
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
