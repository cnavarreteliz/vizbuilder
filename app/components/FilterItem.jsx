import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button } from "@blueprintjs/core";

import OPERATOR from "helpers/operators";

import "styles/FilterItem.css";

class FilterItem extends Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeOperator = this.handleChangeOperator.bind(this);
		this.handleChangeProperty = this.handleChangeProperty.bind(this);
		this.handleChangeValue = this.handleChangeValue.bind(this);
		this.handleDelete = this.handleDelete.bind(this);

		this._uid = Math.random().toString(36).substr(2, 5);
	}

	calculateType(property, value) {
		/*let kind = KINDS.find(obj => obj.property == property);

		if (!kind) {
			let isnumber = !isNaN(parseFloat(value)) && isFinite(value);
			kind = { category: isnumber ? "size" : "axis" };
		}

		kind = kind.category;

		return kind == "size" ? "range" : kind == "time" ? "range" : "text";*/
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
			attributes.min = this.props.min;
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
								{this.renderPropertyOptions.call(this)}
							</select>
						</div>
						<div className="pt-select pt-fill">
							<select
								value={this.props.operator}
								className="filter-operator"
								onChange={this.handleChangeOperator}
							>
								{this.renderOperatorOptions.call(this)}
							</select>
						</div>
					</div>
					{this.renderValueInput.call(this)}
					{this.renderDataList.call(this)}
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

FilterItem.propTypes = {
	index: PropTypes.number.isRequired,
	columns: PropTypes.array,
	value: PropTypes.string.isRequired,
	max: PropTypes.number.isRequired,
	steps: PropTypes.number.isRequired,
	property: PropTypes.string.isRequired,
	operator: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
}


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

export default FilterItem
