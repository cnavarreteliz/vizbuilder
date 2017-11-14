import React from "react";
import PropTypes from "prop-types";
import map from "lodash/map";
import union from "lodash/union";

import OPERATORS, {
	KIND_NUMBER as NUMBER_OPERATORS,
	LABELS as OPERATOR_LABELS
} from "helpers/operators";
import { makeRandomId } from "helpers/random";

import { Button, Dialog, Intent, NumericInput } from "@blueprintjs/core";
import FilterItem from "components/FilterItem";
import CustomSelect from "components/CustomSelect";
import MembersSelect from "components/MembersSelect";

/**
 * @typedef FilterManagerProps
 * @prop {Cube} cube Current cube
 * @prop {Array<Filter>} filters Current filters list
 * @prop {MembersState} members Available members
 * @prop {(filter: Filter) => void} onAddFilter
 * @prop {(filter: Filter) => void} onUpdateFilter
 * @prop {(filter: Filter) => void} onRemoveFilter
 * @prop {(level: Level) => void} onLevelChosen
 */

/**
 * @typedef FilterManagerState
 * @prop {boolean} isOpen Defines if the Dialog is open
 * @prop {Filter} old_filter Saves the old filter state in case of cancelling
 * @prop {number} current Index of the Filter element to edit in the Dialog
 */

/** @augments {React.Component<FilterManagerProps, FilterManagerState>} */
class FilterManager extends React.Component {
	static propTypes = {
		cube: PropTypes.object.isRequired,
		filters: PropTypes.array.isRequired,
		members: PropTypes.object.isRequired,
		onAddFilter: PropTypes.func.isRequired,
		onUpdateFilter: PropTypes.func.isRequired,
		onRemoveFilter: PropTypes.func.isRequired,
		onLevelChosen: PropTypes.func.isRequired
	};

	/** @type {FilterManagerState} */
	state = {
		isOpen: false,
		old_filter: undefined,
		current: -1
	};

	get currentFilter() {
		return this.props.filters[this.state.current];
	}

	render() {
		let cube = this.props.cube;

		let dialogBody = null;

		let filter = this.currentFilter;

		if (filter) {
			let parent = filter.property;

			let option_handler;

			if (parent) {
				if (parent.kind == "measure") {
					option_handler = this.renderMeasureOptions.call(this);
				} else if (parent.kind == "level") {
					option_handler = this.renderLevelOptions.call(this);
				}
			}

			let parents = [].concat(cube.measures, cube.levels);

			dialogBody = (
				<div className="pt-dialog-body dialog-filter-body">
					<div className="group">
						<span className="label">Filter by</span>
						<CustomSelect
							value={parent}
							items={parents}
							onItemSelect={this.setProperty}
						/>
					</div>
					{option_handler}
				</div>
			);
		}

		let editFilter = this.editFilter,
			removeFilter = this.props.onRemoveFilter;

		return (
			<div className="group filters-wrapper">
				<span className="label">filtered by</span>
				<div className="filter-items">
					{this.props.filters.map(filter => (
						<FilterItem
							item={filter}
							onEdit={editFilter}
							onRemove={removeFilter}
						/>
					))}
				</div>
				<Button className="pt-fill" iconName="insert" onClick={this.addFilter}>
					Add filter
				</Button>
				<Dialog
					className="dialog-filter"
					iconName="filter"
					isOpen={this.state.isOpen}
					onClose={this.dialogCancel}
					title="Update filter"
				>
					{dialogBody}
					<div className="pt-dialog-footer">
						<div className="pt-dialog-footer-actions">
							<Button text="Cancel" onClick={this.dialogCancel} />
							<Button
								intent={Intent.PRIMARY}
								onClick={this.dialogSave}
								text="Save"
							/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}

	renderMeasureOptions() {
		let filter = this.currentFilter;
		return (
			<div className="group">
				<div className="pt-control-group">
					<div className="pt-select">
						<select value={filter.operator} onChange={this.setOperator}>
							{NUMBER_OPERATORS.map(ms => (
								<option value={OPERATORS[ms]}>{OPERATOR_LABELS[ms]}</option>
							))}
						</select>
					</div>
					<NumericInput className="pt-fill" value={filter.value} onValueChange={this.setMeasureValue} />
				</div>
			</div>
		);
	}

	renderLevelOptions() {
		let filter = this.currentFilter,
			fullname = filter.property.fullName;

		let members = this.props.members[fullname] || [];

		return (
			<div className="group">
				<MembersSelect
					items={members}
					selectedItems={filter.value}
					onItemSelect={this.filterValueAdd}
					onItemRemove={this.filterValueRemove}
				/>
			</div>
		);
	}

	dialogSave = () => {
		let filter = this.currentFilter;
		if (filter && !filter.property) this.props.onRemoveFilter(filter);
		this.setState({ isOpen: false, current: -1 });
	};

	dialogCancel = () => {
		let filter = this.state.old_filter;
		if (filter) {
			if (filter.property) this.props.onUpdateFilter(filter);
			else this.props.onRemoveFilter(filter);
		}
		this.setState({ isOpen: false, current: -1 });
	};

	addFilter = () => {
		/** @type {Filter} */
		let newFilter = {
			key: makeRandomId(),
			property: undefined,
			operator: 1,
			value: undefined
		};

		this.props.onAddFilter(newFilter);
		this.setState({
			isOpen: true,
			old_filter: newFilter,
			current: this.props.filters.length
		});
	};

	editFilter = filter => {
		this.setState({
			isOpen: true,
			old_filter: filter,
			current: this.props.filters.findIndex(item => filter.key == item.key)
		});
	};

	setProperty = property => {
		if (property.kind == "level") {
			if (!this.props.members.hasOwnProperty(property.fullName))
				this.props.onLevelChosen(property);

			this.props.onUpdateFilter({
				...this.currentFilter,
				kind: property.kind,
				property,
				value: []
			});
		} else {
			this.props.onUpdateFilter({
				...this.currentFilter,
				kind: property.kind,
				property,
				value: 0
			});
		}
	};

	setOperator = evt => {
		this.props.onUpdateFilter({
			...this.currentFilter,
			operator: evt.target.value
		});
	};

	setMeasureValue = value => {
		let filter = this.currentFilter;

		if (!filter.property) return;

		this.props.onUpdateFilter({
			...filter,
			value
		});
	};

	filterValueAdd = value => {
		let filter = this.currentFilter;
		this.props.onUpdateFilter({
			...filter,
			value: union(filter.value, [value])
		});
	};

	filterValueRemove = value => {
		let filter = this.currentFilter;
		console.log(filter.value, value);
		this.props.onUpdateFilter({
			...filter,
			value: filter.value.filter(item => item == value)
		});
	};
}

export default FilterManager;
