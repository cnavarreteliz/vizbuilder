import React, { Component } from "react";
import { connect } from "react-redux";

function Assistant(props) {
	return (
		<div className="panel-assistant">
			<h2>Assistant</h2>
			<p>Hello, I'm Ann, your data analytics assistant.</p>
			<hr />
			<h5>Suggested searches:</h5>
			<ul>
				<li>
					<a
						href="#"
						onClick={evt =>
							props.onClickAssistant(
								"Employee Records",
								"Occupation",
								"Salary Average"
							)}
					>
						Salary Average in Occupations
					</a>
				</li>
				<li>
					<a
						href="#"
						onClick={evt =>
							props.onClickAssistant(
								"Employee Records",
								"Occupation",
								"Record Count"
							)}
					>
						Record Count in Occupations
					</a>
				</li>
				<li>
					<a
						href="#"
						onClick={evt =>
							props.onClickAssistant(
								"Business Records",
								"Industry",
								"Business Count"
							)}
					>
						Number of business by Industry
					</a>
				</li>
				<li>
					<a
						href="#"
						onClick={evt =>
							props.onClickAssistant(
								"Education Local",
								"Degree",
								"Student Count"
							)}
					>
						Number of students by Degree
					</a>
				</li>
			</ul>
		</div>
	);
}

function mapDispatchToProps(dispatch) {
	return {
		onClickAssistant(cube, dimension, measure) {
			dispatch({ type: "AXIS_UPDATE", cube, dimension, measure });
			return false;
		}
	};
}

export default connect(null, mapDispatchToProps)(Assistant);
