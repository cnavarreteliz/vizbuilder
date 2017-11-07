import React from "react";
import { connect } from "react-redux";

import FilterManager from "components/FilterManager";
import CustomSelect from "components/CustomSelect";
import SelectChartType from "components/SelectChartType";
import InputTable from "components/InputTable";

import union from "lodash/union";

import { requestMembers } from "actions/datasource";
import { generateColorSelector } from "helpers/prepareInput";
import { getCoherentMeasures } from "helpers/manageData";

import { Tag, Intent } from "@blueprintjs/core";

import "styles/AreaSidebar.css";

function Panel(props) {
	const measures = getCoherentMeasures(props.viztype, props.all_ms);

	switch (props.viztype) {
		case "table":
			return (
				<div>
					{union(props.measures, props.drilldowns).map(ms => {
						return (
							<Tag
								intent={Intent.PRIMARY}
								onRemove={evt => props.removeTag(ms)}
							>
								{ms.name}
							</Tag>
						);
					})}

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

function Sidebar(props) {
	const measures = getCoherentMeasures(props.viztype, props.all_ms);

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

			<FilterManager
				cube={props.cube}
				filters={props.filters}
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

		measures: state.aggregators.measures,

		filters: state.filters,
		members: state.members,

		all_cb: state.cubes.all,
		all_dd: currentCb.stdLevels,
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

		onMeasureChange(item) {
			if (item.kind === "measure") {
				dispatch({ type: "MEASURE_ADD", payload: item });
			} else if(item.kind === "level") {
				dispatch({ type: "DRILLDOWN_ADD", payload: item });
			}
		},

		addFilter(filter) {
			dispatch({ type: "FILTER_ADD", payload: filter });
		},

		updateFilter(filter) {
			if (filter.property && filter.property.kind == "level")
				dispatch(requestMembers(filter.property));

			dispatch({ type: "FILTER_UPDATE", payload: filter });
		},

		removeFilter(filter) {
			dispatch({ type: "FILTER_DELETE", payload: filter });
		},

		removeTag(item) {
			if (item.kind === "measure") {
				dispatch({ type: "MEASURE_DELETE", payload: item });
			} else if(item.kind === "level") {
				dispatch({ type: "DRILLDOWN_DELETE", payload: item });
			}
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
