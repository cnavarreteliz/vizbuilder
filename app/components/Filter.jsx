import React, { Component } from "react";
import { Button } from "@blueprintjs/core";

import OPERATOR from "assets/operators";
import KINDS from "data/properties.json";

import "./Filter.css";

class Filter extends Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeOperator = this.handleChangeOperator.bind(this);
		this.handleChangeProperty = this.handleChangeProperty.bind(this);
		this.handleChangeValue = this.handleChangeValue.bind(this);
		this.handleDelete = this.handleDelete.bind(this);

		this.renderPropertyOptions = this.renderPropertyOptions.bind(this);
		this.renderValueInput = this.renderValueInput.bind(this);
		this.renderDataList = this.renderDataList.bind(this);
		// this.renderOperatorOptions = this.renderOperatorOptions.bind(this);

		this._uid = Math.random().toString(36).substr(2, 5);
	}

	calculateType(property, value) {
		let kind = KINDS.find(obj => obj.property == property);

		if (!kind) {
			let isnumber = !isNaN(parseFloat(value)) && isFinite(value);
			kind = { category: isnumber ? "size" : "axis" };
		}

		kind = kind.category;

		return kind == "size" ? "range" : kind == "time" ? "range" : "text";
	}

	handleChange(newState) {
		this.props.onChange(this.props.index, newState);
	}

	handleChangeProperty(event) {
		this.handleChange({ property: event.target.value });
	}

	handleChangeOperator(event) {
		this.handleChange({ operator: event.target.value * 1 });
	}

	handleChangeValue(event) {
		let value = event.target.value;
		this.handleChange({ value: value * 1 || value });
	}

	handleDelete() {
		this.props.onDelete(this.props.index);
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

	renderValueInput() {
		let attributes = {
			className: "filter-value pt-input pt-fill",
			dir: "auto",
			type: this._type,
			onChange: this.handleChangeValue,
			value: this.props.value
		};

		if (attributes.type == "range") {
			attributes.min = 0;
			attributes.max = this.props.max;
			attributes.list = this._uid;
		}

		return React.createElement("input", attributes);
	}

	renderDataList() {
		if (this._type == "range") {
			let steps = this.props.steps || [];
			return (
				<datalist id={this._uid}>
					{steps.map(step =>
						<option>
							{step}
						</option>
					)}
				</datalist>
			);
		}
	}

	render() {
		this._type = this.calculateType(this.props.property, this.props.value);

		return (
			<div className="filter-element">
				<div className="pt-control-group pt-vertical">
					<div className="pt-control-group">
						<div className="pt-select pt-fill">
							<select
								value={this.props.property}
								className="filter-property"
								onChange={this.handleChangeProperty}
							>
								{this.renderPropertyOptions()}
							</select>
						</div>
						<div className="pt-select pt-fill">
							<select
								value={this.props.operator}
								className="filter-operator"
								onChange={this.handleChangeOperator}
							>
								{this.renderOperatorOptions()}
							</select>
						</div>
					</div>
					{this.renderValueInput()}
					{this.renderDataList()}
				</div>
				<Button
					className="filter-delete pt-intent-danger pt-minimal"
					iconName="delete"
					onClick={this.handleDelete}
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
