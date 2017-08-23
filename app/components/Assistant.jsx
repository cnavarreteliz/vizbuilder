import React, { Component } from "react";
import { connect } from "react-redux";
import AssistantPanel from "components/AssistantPanel";

class Assistant extends Component {

	renderAssistantElements(props) {
		return (
			<div className="assistant-options">
				<AssistantPanel
					onClick={props.onClickAssistant}
					measure={"Salary Average"}
					title={"Salary Average in Occupations"}
				/>

				<AssistantPanel
					onClick={props.onClickAssistant}
					measure={"Record Count"}
					title={"Record Count in Occupations"}
				/>
                <div onClick={
					props.onClickAssistant("Salary Average")
				}> Test
                </div>
			
			</div>
		);
	}
	render() {
		return (
			<div className="assistant">
				{this.renderAssistantElements(this.props)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		dimension: state.data.dimension,
		measure: state.data.measure,
		cube: state.data.cube
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,

		onClickAssistant(measure) {
            console.log('HOALAAAAAA')
			dispatch({ type: "DATA_ASSISTANT_UPDATE", payload: measure });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Assistant);
