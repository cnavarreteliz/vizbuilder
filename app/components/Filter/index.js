import React, { Component } from "react";

import OPERATOR from "./operators";

import "./style.css";

class Filter extends Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeProperty = this.handleChangeProperty.bind(this);
		this.handleChangeOperator = this.handleChangeOperator.bind(this);
		this.handleChangeValue = this.handleChangeValue.bind(this);

		this.renderPropertyOptions = this.renderPropertyOptions.bind(this);
		// this.renderOperatorOptions = this.renderOperatorOptions.bind(this);

		this.state = {
			type: this.inferValueType(props.value)
		};
	}

	inferValueType(value) {
		let isnumber = !isNaN(parseFloat(value)) && isFinite(value);
		return isnumber ? "number" : "text";
	}

	handleChange(newState) {
		this.props.onChange(this.props.index, newState);
		// this.setState(newState);
	}

	handleChangeProperty(event) {
		this.handleChange({ property: event.target.value });
	}

	handleChangeOperator(event) {
		this.handleChange({ operator: event.target.value * 1 });
	}

	handleChangeValue(event) {
		let value = event.target.value,
			type = this.inferValueType(value);

		// If value is number, convert to number
		if (type == "number") value *= 1;

		this.handleChange({ value });
		this.setState({ type });
	}

	renderPropertyOptions() {
		return this.props.columns.map(opt =>
			<option key={opt} value={opt}>
				{opt}
			</option>
		);
	}

	renderOperatorOptions() {
		return Object.keys(OPERATOR).map(opt =>
			<option key={opt} value={OPERATOR[opt]}>
				{opt}
			</option>
		);
	}

	render() {
		return (
			<div className="filter-element">
				<select
					value={this.props.property}
					className="filter-property"
					onChange={this.handleChangeProperty}
				>
					{this.renderPropertyOptions()}
				</select>
				<select
					value={this.props.operator}
					className="filter-operator"
					onChange={this.handleChangeOperator}
				>
					{this.renderOperatorOptions()}
				</select>
				<input
					className="filter-value"
					type={this.state.type}
					value={this.props.value}
					onChange={this.handleChangeValue}
				/>
			</div>
		);
	}
}

export const defaultFilter = {
	property: "id",
	operator: OPERATOR.LOWEREQUAL,
	value: "20"
};

export const operators = OPERATOR;

export function applyFilters(items, filters) {
	return filters.reduce((output, filter) => {
		if (filter.value === null || filter.value == "") return output;

		return output.filter(item => {
			let property = item[filter.property],
				test = false;

			if (filter.operator & OPERATOR.EQUAL)
				test = test || property == filter.value;

			if (filter.operator & OPERATOR.HIGHER)
				test = test || property > filter.value;

			if (filter.operator & OPERATOR.LOWER)
				test = test || property < filter.value;

			if (filter.operator & OPERATOR.CONTAINS) {
				let lower = prim => (prim + "").toLocaleLowerCase();
				test = test || lower(property).indexOf(lower(filter.value)) > -1;
			}

			return test;
		});
	}, items);
}

export default Filter;
