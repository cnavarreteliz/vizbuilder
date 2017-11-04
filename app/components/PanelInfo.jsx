import { Component, createElement } from "react";
import pluralize from "pluralize";
import numeral from "numeral";

import "styles/PanelInfo.css";

class PanelInfo extends Component {
	render() {
		const props = this.props;
		const info = this.preparePanelInfo(props.data, props.axis.y, props.axis.x);

		return (
			<div className="panelinfo-wrapper">
				<h4 className="title">
					{numeral(info.total)
						.format("0.0 a")
						.toUpperCase()}
				</h4>
				<p className="subtitle">Total {props.axis.y}</p>
				<div className="content">
					<h4 className="title">Top {pluralize(props.axis.x)}</h4>
					<p>
						In {info.maxYear}, Top-3 {pluralize(props.axis.x)} by {props.axis.y}{" "}
						are:
					</p>
					{this.prepareTopCategories(
						info.data,
						props.axis.x,
						info.maxYear
					).map((item, key) => {
						return (
							<div className="item-ranking">
								{key + 1}. {item}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
	prepareTopCategories(data, dm, year) {
		let output = [];
		if (data[0].Year) {
			data = data.filter(e => parseInt(e.Year) === year);
			let size = data.length > 3 ? 3 : 1;
			for (let i = 0; i < size; i++) {
				output.push(data[i][dm]);
			}
		}
		return output;
	}
	preparePanelInfo(data, ms, dm) {
		data = data.sort((a, b) => {
			return b[ms] - a[ms];
		});
		let maxYear;
		if (data[0].Year) maxYear = Math.max(...data.map(dm => parseInt(dm.Year)));

		let total = data.reduce((a, b) => {
			return a + b[ms];
		}, 0);
		return { data, maxYear, total };
	}
}

export default PanelInfo;
