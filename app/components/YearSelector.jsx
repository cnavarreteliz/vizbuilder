import React, { Component } from "react";

// Selector year
class YearSelector extends Component {
	render() {
		const interval = interval_years(this.props.since, this.props.until);
		return (
			<select>
				{interval.map(year =>
					<option value={year}>
						{year}
					</option>
				)}
			</select>
		);
	}
}

// Custom functions
function interval_years(since, until) {
	var output = [];
	for (let i = since; i <= until; i++) {
		output.push(i);
	}
	return output;
}

export default YearSelector;
