import React from "react";
import { connect } from "react-redux";
import pluralize from "pluralize";
import numeral from "numeral";

import uniq from "lodash/uniq";
import inRange from "lodash/inRange";
import groupBy from "lodash/groupBy";

class ToolbarInfo extends React.Component {
	getBody(topcateg, axis) {
		switch (topcateg.length) {
			case 0:
			case 1:
				return <span />;
			case 2:
				return (
					<span>
						{axis.x} with the highest {axis.y} was {topcateg[0].name} with a
						value of {topcateg[0].value}.
					</span>
				);
			default:
				return (
					<span>
						{axis.x} with the highest {axis.y} was {topcateg[0].name} with a
						value of {topcateg[0].value}, followed by {topcateg[1].name} and{" "}
						{topcateg[2].name}, with respective values of {topcateg[1].value}{" "}
						and {topcateg[2].value}.
					</span>
				);
		}
	}

	getTopCategories(data, time, axis) {
		// Filter data by Year
		data = data.filter(item =>
			inRange(parseInt(item[axis.time]), time[0], time[1] + 1)
		);

		// Group by Dimension
		data = groupBy(data, axis.x);
		data = Object.keys(data).map(item => {
			let value = (data[item] = data[item].reduce((all, subitem) => {
				return all + subitem[axis.y];
			}, 0));
			return { name: item, value };
		});

		// Return sorted data
		return data.sort((a, b) => {
			return b.value - a.value;
		});
	}

	render() {
		let props = this.props,
			text,
			time = this.props.time,
			body;

		let top_categories = this.getTopCategories(
			this.props.data,
			time,
			this.props.axis
		);

		switch (props.time.length) {
			// By default
			case 0:
				let allYears =
						uniq(
							this.props.data.map(dm => parseInt(dm[this.props.axis.time]))
						) || [],
					max = Math.max(...allYears);
				return (
					<div>
						In {max},{" "}
						{this.getBody(
							this.getTopCategories(this.props.data, [max], this.props.axis),
							this.props.axis
						)}
					</div>
				);

			// It's selected one year
			case 1:
				return (
					<div>
						In {time[0]},{" "}
						{this.getBody(
							this.getTopCategories(this.props.data, time, this.props.axis),
							this.props.axis
						)}
					</div>
				);

			// It's selected a range of years
			case 2:
				return (
					<div>
						In the period {time[0]}-{time[1]},{" "}
						{this.getBody(
							this.getTopCategories(this.props.data, time, this.props.axis),
							this.props.axis
						)}
					</div>
				);
		}
	}
}

function mapStateToProps(state) {
	let axis = state.data.axis;
	return {
		time: state.visuals.chart.time,
		axis: {
			x: axis.x.level || "",
			y: axis.y.name || "",
			time: axis.time.level || ""
		}
	};
}

export default connect(mapStateToProps)(ToolbarInfo);
