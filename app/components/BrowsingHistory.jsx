import React from "react";
import { Icon } from "@blueprintjs/core";

class BrowsingHistory extends React.Component {
	render() {
		let history = localStorage.getItem("vizbuilder-history").split("/") || [];
		history = history.map(item => JSON.parse(item));

		return history.map(item => {
			<div>
				<h5>
					<Icon iconName="control" /> {"History title"}
				</h5>
				<div>{}</div>
			</div>;
		});
	}
}

export default BrowsingHistory;
