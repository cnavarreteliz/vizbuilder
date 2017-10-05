import React from "react";
import { connect } from "react-redux";

import Chart from "components/Chart";
import AgeBucket from "components/Bucket";
import ChartOptions from "components/ChartOptions";
import ContentDefault from "components/ContentDefault";
import InputPopover from "components/InputPopover";
import Toolbar from "components/Toolbar";

import "styles/AreaContent.css";

function AreaContent(props) {
	if (!props.axis.x || !props.axis.y) return <ContentDefault />;

	return (
		<div className="main-panel">
			<header className="header">
				<Toolbar
					data={props.data}
					cube={props.cube.name}
					axis={props.axis}
				/>
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
			<Chart />
			<div className="chartappearance-wrapper">
				<AgeBucket />
				{/* <ChartOptions /> */}
			</div>
		</div>
	);
}

function mapStateToProps(state) {

	return {
		axis: state.visuals.axis,
		cube: state.cubes.current,
		data: state.data.values,
	};
}

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
