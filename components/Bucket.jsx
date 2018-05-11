import React from "react";
import { connect } from "react-redux";
import times from 'lodash/times'

import { NumericInput } from "@blueprintjs/core";

import "styles/Bucket.css";

function AgeBucket(props) {
	if (props.show) {
		return (
			<div className="item age-bucket">
				{"Interval of "}
				<NumericInput className="pt-inline" value={props.num} min={1} max={25} clampValueOnBlur={true} onValueChange={props.onBucketUpdate} />
				{" years"}
			</div>
		);
	}
	
	return <div />;
}

function mapStateToProps(state) {
	let dim = state.aggregators.drilldowns[0];

	return {
		show: dim && dim.level === "Age",
		num: state.visuals.chart.buckets
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onBucketUpdate(value) {
			dispatch({ type: "VIZ_BUCKET_UPDATE", payload: value });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AgeBucket);
