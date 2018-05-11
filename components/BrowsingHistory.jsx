import React from "react";
import { connect } from "react-redux";

import { Icon } from "@blueprintjs/core";
import { Link } from "react-router";

import concat from "lodash/concat";
import CHARTS from "helpers/charts";

import "styles/BrowsingHistory.css";

class BrowsingHistory extends React.Component {

	render() {
		let history = this.props.history;

		if (history)
			return (
				<div className="history-items">
					{history.map(item => {
						let icon = CHARTS.find(chart => chart.key == item.chart).icon;
						return (
							<div className="history-item">
								<a href={item.queryString}>
									<div>
										<Icon iconName={icon} className="icon" />
									</div>
									<div className="content">
										<h5>{item.title}</h5>
										<p>Saved at {item.datetime}</p>
									</div>
								</a>
								<div>
									<Icon
										className="remove pt-intent-danger"
										iconName="trash"
										onClick={evt => this.props.onSetHistory(item, history)}
									/>
								</div>
							</div>
						);
					})}
				</div>
			);

		return <div />;
	}
}

function mapStateToProps(state) {
	let axis = state.data.axis;
	return {
		history: state.visuals.history
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onSetHistory(property, history) {

			let newHistory = history.filter(item => item !== property)	
			localStorage.setItem("vizbuilder-history", JSON.stringify(newHistory));
			dispatch({ type: "HISTORY_SET", payload: newHistory });
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(BrowsingHistory);