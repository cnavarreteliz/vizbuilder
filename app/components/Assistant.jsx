import React, { Component } from "react";
import { connect } from "react-redux";

function Assistant(props) {
	return (
		<div className="panel-assistant">
			<h2>Assistant</h2>
			<p>Hello, I'm Liz, your data analytics assistant.</p>
			<hr />
			<h5>Suggested searches:</h5>
			<ul>
				<li>
					<a href="#" onClick={evt => props.onClickAssistant("Salary Average")}>
						Salary Average in Occupations
					</a>
				</li>
				<li>
					<a href="#" onClick={evt => props.onClickAssistant("Record Count")}>
						Record Count in Occupations
					</a>
				</li>
			</ul>
		</div>
	);
}

function mapDispatchToProps(dispatch) {
	return {
		onClickAssistant(measure) {
			dispatch({ type: "AXIS_UPDATE", measure });
			return false;
		}
	};
}

export default connect(null, mapDispatchToProps)(Assistant);
