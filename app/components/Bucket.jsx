import React from "react";
import { connect } from "react-redux";
import Selector from "components/InputSelect";

import "styles/Bucket.css";

function AgeBucket(props) {
	const options = Array(25)
		.fill()
		.map((e, i) => ({ id: i + 1, value: i + 1 }));
	const { onBucketUpdate } = props;

	if (props.show) {
		return (
			<div className="item">
				Interval of <Selector
					value={props.num}
					options={options}
					onChange={onBucketUpdate}
				/>{" "}
				years
			</div>
		);
	} else {
		return <div />;
	}
}

function mapStateToProps(state) {
	let aggr = state.aggregators,
		xor = aggr.drilldowns[0].dimensionType === 0,
		dim = aggr.drilldowns[xor ? 0 : 1].level;

	return {
		show: dim === "Age",
		num: state.visuals.buckets
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onBucketUpdate(evt) {
			dispatch({ type: "VIZ_BUCKET_UPDATE", payload: evt.target.value });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AgeBucket);
