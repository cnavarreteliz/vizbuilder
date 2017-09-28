import React from "react";
import { connect } from "react-redux";
import Selector from "components/InputSelect";

import "styles/Bucket.css";

function AgeBucket(props) {
	const options = Array(10)
		.fill()
		.map((e, i) => ({ id: i + 1, value: i + 1 }));
	const { onBucketUpdate } = props;

	if (props.show) {
		return (
			<div className="item">
				Interval of <Selector
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
	return {
		show: state.visuals.axis.x === "Age"
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
