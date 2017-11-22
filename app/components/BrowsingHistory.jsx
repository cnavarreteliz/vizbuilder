import React from "react";
import { Icon } from "@blueprintjs/core";
import { Link } from "react-router";

import concat from "lodash/concat";
import CHARTS from "helpers/charts";

import "styles/Browsinghistory.css";

class BrowsingHistory extends React.Component {
	state = {
		history:
			concat([], JSON.parse(localStorage.getItem("vizbuilder-history"))).filter(
				Boolean
			) || []
	};
	render() {
		let history = this.state.history;

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
										onClick={evt => this.deleteHistory(item)}
									/>
								</div>
							</div>
						);
					})}
				</div>
			);

		return <div />;
	}

	deleteHistory(history) {
		this.setState(state => ({
			history: this.state.history.filter(item => item !== history)
		}));

		localStorage.setItem("vizbuilder-history", JSON.stringify(history));
	}
}

export default BrowsingHistory;
