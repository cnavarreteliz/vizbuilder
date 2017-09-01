import { connect } from "react-redux";

import { Slider } from "@blueprintjs/core";

function Timeline(props) {
	if (isNaN(props.year)) return null;

	return (
		<div className="timeline">
			<Slider
				min={2009}
				max={2016}
				value={props.year}
				onChange={props.onYearChange}
			/>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		year: state.visuals.axis.year * 1
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onYearChange(year) {
			dispatch({ type: "YEAR_UPDATE", payload: year });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
