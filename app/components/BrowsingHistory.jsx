import React from "react";
import { Icon } from "@blueprintjs/core";
import { Link } from "react-router";

import concat from "lodash/concat";
import CHARTS from "helpers/charts";

import "styles/Browsinghistory.css";

class BrowsingHistory extends React.Component {
	
	render() {
		let history =
			concat([], JSON.parse(localStorage.getItem("vizbuilder-history"))) || [];

		if (history)
			return (
				<div className="history-items">
					{history.map(item => {
						let icon = CHARTS.find(chart => chart.key == item.chart).icon
						return (
							<a href={item.queryString}>
								<div className="history-item">
									<div>
										<Icon iconName={icon} className="icon" />
									</div>
									<div className="content">
										<h5>{item.title}</h5>
										<p>Saved at {item.datetime}</p>
									</div>
								</div>
							</a>
						);
					})}
				</div>
			);

		return <div />;
	}
}

export default BrowsingHistory;
