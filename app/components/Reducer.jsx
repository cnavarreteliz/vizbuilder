import React, { Component } from "react";

import "./Reducer.css";

class Reducer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			property: props.property || props.columns[0],
			action: props.action || OPERATOR.EQUAL
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeProperty = this.handleChangeProperty.bind(this);
		this.handleChangeOperator = this.handleChangeOperator.bind(this);
		this.handleChangeValue = this.handleChangeValue.bind(this);

		this.renderPropertyOptions = this.renderPropertyOptions.bind(this);
		// this.renderOperatorOptions = this.renderOperatorOptions.bind(this);
	}

	handleChange(newState) {
		this.props.onChange(this.props.index, newState);
		this.setState(newState);
	}

	render() {
		return (
			<div className="filter-element">
				<select
					className="filter-property"
					onChange={this.handleChangeProperty}
				>
					{this.renderPropertyOptions()}
				</select>
				<select
					className="filter-operator"
					onChange={this.handleChangeOperator}
				>
					{this.renderOperatorOptions()}
				</select>
				<input
					className="filter-value"
					type={this.type}
					value={this.state.value}
					onChange={this.handleChangeValue}
				/>
			</div>
		);
	}
}

export function applyReducers(items, reducers, source, size) {
	let reduction = items
		/*.filter(item => !!item.name)
		.reduce((output, item) => {
			let property = item.name;

			if (!output.hasOwnProperty(property)) output[property] = 0;

			output[property] += item.value;

			return output;
		}, {});*/

	return reduction

	/*return Object.keys(reduction).map(item => ({
		id: item.id,
		//value: reduction[item]
		value: item.value,
		group: item.group,
		name: item.name
	}));*/
}
