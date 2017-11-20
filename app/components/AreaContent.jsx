import React from "react";
import { connect } from "react-redux";

import { applyFilters } from "helpers/filters";

import Chart from "components/Chart";
import AgeBucket from "components/Bucket";
import ContentDefault from "components/ContentDefault";
import InputPopover from "components/InputPopover";
import Toolbar from "components/Toolbar";

import { Button, Dialog } from "@blueprintjs/core";

import "styles/AreaContent.css";

/**
 * @typedef AreaContentState
 * @prop {object} axis The current axis' labels.
 * @prop {Cube} cube The current Cube.
 * @prop {Array} data The raw dataset.
 */

/**
 * @typedef AreaContentDispatch
 * @prop {Function} dispatch
 * @prop {Function} onMeasureChange
 * @prop {Function} onBucketUpdate
 * @prop {Function} onDrilldownChange
 */

/**
 * AreaContent component
 * @param {AreaContentState & AreaContentDispatch} props
 * @returns {JSX.Element}
 */
function AreaContent(props) {
	if (!props.axis.x || !props.axis.y) return <ContentDefault />;

	let state = {
		dialogOpen: false
	};

	return (
		<div className="main-panel">
			<header className="header">
				<Toolbar
					data={props.data}
					cube={props.cube.name}
					axis={props.axis}
					queryString={props.queryString}
				/>
				<div className="title-wrapper">
					<p className="title">
						{props.cube.name + " by "}
						<InputPopover
							value={props.axis.x}
							options={props.cube.levels}
							onClick={props.onDrilldownChange}
						/>
					</p>

					<p className="subtitle">
						{"SIZED BY "}
						<InputPopover
							value={props.axis.y}
							options={props.cube.measures}
							onClick={props.onMeasureChange}
						/>
					</p>
				</div>

				<div className="wrapper-history">
				<Dialog
						iconName="pt-icon-th"
						isOpen={this.state.dialogOpen}
						onClose={this.toggleDialog}
						title={"Hoy"}
					>
					<Button
						className="filter-action remove pt-intent-danger pt-minimal"
						iconName="history"
					/>
					</Dialog>
				</div>
			</header>
			<Chart data={props.data} />
			<div className="chartappearance-wrapper">
				<AgeBucket />
			</div>
		</div>
	);
}

/** 
 * @param {VizbuilderState} state
 * @returns {AreaContentState} 
 */
function mapStateToProps(state) {
	let dd = state.aggregators.drilldowns[0] || { name: "" },
		ms = state.aggregators.measures[0] || { name: "" };

	let measure_filters = state.filters.filter(
		filter =>
			filter.property && filter.property.kind == "measure" && filter.value
	);

	return {
		axis: {
			...state.visuals.axis,
			x: dd.name,
			y: ms.name
		},
		cube: state.cubes.current,
		data: applyFilters(state.data.values, measure_filters)
	};
}

/** @returns {AreaContentDispatch} */
function mapDispatchToProps(dispatch) {
	return {
		dispatch,

		onMeasureChange(measure) {
			dispatch({ type: "MEASURE_SET", payload: measure });
		},

		onBucketUpdate(evt) {
			dispatch({ type: "VIZ_BUCKET_UPDATE", payload: evt.target.value });
		},

		onDrilldownChange(dim) {
			dispatch({ type: "DRILLDOWN_SET", payload: dim });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaContent);
