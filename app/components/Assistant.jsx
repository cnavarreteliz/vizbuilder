import React, { Component } from "react";
import { connect } from "react-redux";
import "./Assistant.css";

function Assistant(props) {
	return (
		<div className="panel-assistant">
			<div className="brand">
				<img src="images/Annie.svg" alt="" />
			</div>
			<h4>Hi. I'm Anni.</h4>
			<p className="subtitle">Your data analytics assistant.</p>
			<hr />
			<h5>Suggested searches:</h5>
			<ul className="search-list">
				<a
					href="#"
					onClick={evt =>
						props.onClickAssistant(
							"Employee Records",
							"Occupation",
							"Salary Average"
						)}
				>
					<li className="search-1">Salary Average in Occupations</li>
				</a>

				<a
					href="#"
					onClick={evt =>
						props.onClickAssistant(
							"Employee Records",
							"Occupation",
							"Record Count"
						)}
				>
					<li className="search-2">People by Occupation</li>
				</a>

				<a
					href="#"
					onClick={evt =>
						props.onClickAssistant(
							"Business Records",
							"Industry",
							"Business Count"
						)}
				>
					<li className="search-3">Number of business by Industry</li>
				</a>

				<a
					href="#"
					onClick={evt =>
						props.onClickAssistant(
							"Education Local",
							"Degree",
							"Student Count"
						)}
				>
					<li className="search-4">Number of students by Degree</li>
				</a>
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
