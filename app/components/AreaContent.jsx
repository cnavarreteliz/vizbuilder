import React from "react";
import { connect } from "react-redux";
import pluralize from "pluralize";

// import { prepareHierarchy } from "helpers/prepareHierarchy";

import Chart from "components/Chart";
import AgeBucket from "components/Bucket";
import ChartOptions from "components/ChartOptions";
import ContentDefault from "components/ContentDefault";
import InputPopover from "components/InputPopover";
import Toolbar from "components/Toolbar";

import "styles/AreaContent.css";

function AreaContent(props) {
	if (!props.x || !props.y) return <ContentDefault />;
	return (
		<div className="main-panel">
			<header className="header">
				<Toolbar component={ this } />
				<p className="title">
					{props.cube.name + " by "}
					<InputPopover
						value={props.x}
						options={props.cube.getLevelHierarchy()}
						onClick={props.onDrilldownChange}
					/>
				</p>
				<p className="subtitle">
					{"SIZED BY "}
					<InputPopover
						value={props.y}
						options={props.cube.measures}
						onClick={props.onMeasureChange}
					/>
				</p>
			</header>
			<Chart />
			<div className="chartappearance-wrapper">
				<AgeBucket />
				<ChartOptions />
			</div>
		</div>
	);
}

function prepareTitle(props) {
	if (props.data.values.length > 1) {
		let base = props.visuals.axis.x;
		if (!base.includes("Age") && !base.includes("Gender")) {
			base = pluralize(base);
		}
		return {
			title: props.cubes.current.name + " by " + base + " (All years)",
			subtitle: "sized by "
		};
	}

	return { title: " ", subtitle: " " };
}

function mapStateToProps(state) {
	const header = prepareTitle(state);

	return {
		title: header.title,
		subtitle: header.subtitle,
		cube: state.cubes.current,

		y: state.visuals.axis.y,
		x: state.visuals.axis.x,

		show_viz: state.visuals.panel.show,
		show: state.data.values.length > 1,
		drilldowns: state.aggregators.drilldowns,
		panel: state.visuals.chart.panel,
		type: state.visuals.chart.type,
		measures: state.aggregators.measures ? state.aggregators.measures : []
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
			dispatch({
				type: "VIZ_AXIS_UPDATE",
				axis: "x",
				payload: dim.name
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaContent);
