import React from "react";
import { connect } from "react-redux";

import Chart from "components/Chart";
import AgeBucket from "components/Bucket";
import ContentDefault from "components/ContentDefault";
import InputPopover from "components/InputPopover";
import Toolbar from "components/Toolbar";

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

	return (
		<div className="main-panel">
			<header className="header">
				<Toolbar data={props.data} cube={props.cube.name} axis={props.axis} />
				<p className="title">
					{props.cube.name + " by "}
					<InputPopover
						value={props.axis.x}
						options={props.cube.getLevelHierarchy()}
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

	return {
		axis: {
			...state.visuals.axis,
			x: dd.name,
			y: ms.name
		},
		cube: state.cubes.current,
		data: state.data.values
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
