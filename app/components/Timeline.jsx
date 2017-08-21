import { connect } from "react-redux";

function Timeline(props) {
	return (
		<div className="timeline">
			<input type="range" value={props.year} onChange={props.onYearChange}/>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		year: state.year
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
