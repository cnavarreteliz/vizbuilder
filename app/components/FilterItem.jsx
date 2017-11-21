import React from "react";

import union from "lodash/union";

import { Button } from "@blueprintjs/core";
import CustomSelect from "components/CustomSelect";
import FilterItemClosed from "components/FilterItemClosed";
import FilterItemMeasure from "components/FilterItemMeasure";
import FilterItemLevel from "components/FilterItemLevel";

/**
 * @typedef FilterItemProps
 * @prop {Filter} filter
 * @prop {MembersState} members
 * @prop {Array} properties
 * @prop {(filter: Filter) => void} onEdit
 * @prop {(filter: Filter) => void} onRemove
 * @prop {(level: Level) => void} onLevelSelected
 */

/**
 * @typedef FilterItemState
 * @prop {boolean} isOpen
 * @prop {Filter} prevFilter
 */

/** @augments {React.Component<FilterItemProps, FilterItemState>} */
class FilterItem extends React.Component {
	state = {
		isOpen: true,
		prevFilter: null
	};

	render() {
		const { filter, properties } = this.props;

		if (!this.state.isOpen) {
			return React.createElement(FilterItemClosed, {
				filter: filter,
				onEdit: this.editFilter,
				onRemove: this.removeFilter
			});
		}

		if (!filter.property) {
			return (
				<div className="filter-item">
					<div className="group">
						<span className="label">Select a Property</span>
						<CustomSelect
							value={filter.property}
							items={properties}
							onItemSelect={this.setProperty}
						/>
					</div>
					<div className="group filter-actions">
						<Button
							text="Cancel"
							className="pt-small"
							onClick={this.removeFilter}
						/>
						<Button
							text="Apply"
							className="pt-small pt-intent-primary"
							disabled={true}
						/>
					</div>
				</div>
			);
		}

		let props = {
			filter,
			properties,
			onSetProperty: this.setProperty,
			onSave: this.saveFilter,
			onReset: this.resetFilter
		};

		if (filter.property.kind == "measure") {
			props.onSetOperator = this.setOperator;
			props.onSetValue = this.measureSetValue;

			return React.createElement(FilterItemMeasure, props);
		}

		if (filter.property.kind == "level") {
			let propertyName = filter.property.fullName;

			props.members = this.props.members[propertyName] || [];
			props.onAddValue = this.levelAddValue;
			props.onRemoveValue = this.levelRemoveValue;

			return React.createElement(FilterItemLevel, props);
		}
	}

	editFilter = () => {
		this.setState({
			isOpen: true,
			prevFilter: this.props.filter
		});
	};

	removeFilter = () => {
		this.props.onRemove(this.props.filter);
	};

	resetFilter = () => {
		const prevFilter = this.state.prevFilter;

		if (prevFilter) {
			this.props.onEdit(prevFilter);
			this.setState({ isOpen: false, prevFilter: null });
		} else {
			this.props.onRemove(this.props.filter);
		}
	};

	saveFilter = () => {
		this.setState({ isOpen: false, prevFilter: null });
	};

	setProperty = property => {
		let isLevel = property.kind == "level";

		if (isLevel) this.props.onLevelSelected(property);

		this.props.onEdit({
			...this.props.filter,
			property,
			value: isLevel ? [] : 0
		});
	};

	setOperator = evt => {
		this.props.onEdit({
			...this.props.filter,
			operator: evt.target.value * 1 || 1
		});
	};

	measureSetValue = value => {
		this.props.onEdit({
			...this.props.filter,
			value
		});
	};

	levelAddValue = value => {
		let filter = this.props.filter;
		this.props.onEdit({
			...filter,
			value: union(filter.value, [value])
		});
	};

	levelRemoveValue = value => {
		let filter = this.props.filter;
		this.props.onEdit({
			...filter,
			value: filter.value.filter(item => item == value)
		});
	};
}

export default FilterItem;
