import React from "react";
import PropTypes from "prop-types";
import map from "lodash/map";

import { OPERATOR_NUMBER } from "helpers/operators";
import { makeRandomId } from "helpers/random";

import { Button, Dialog, Intent } from "@blueprintjs/core";
import FilterItem from "components/FilterItem";
import CustomSelect from "components/CustomSelect";

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

			let option_handler = [];

			if (parent) {
				if (parent.kind == "measure") {
					option_handler = this.renderMeasureOptions.call(this);
				} else if (parent.kind == "level") {
					option_handler = this.renderLevelOptions.call(this);
				}
			}

			let parents = [].concat(cube.measures, cube.levels);

			dialogBody = (
				<div className="pt-dialog-body">
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
		return [
			<select value={filter.operator} onChange={this.setOperator}>
				{Object.keys(OPERATOR_NUMBER).map(ms => <option value={ms}>{ms}</option>)}
			</select>,
			<input type="number" value={filter.value} onInput={this.setMeasureValue} />
		];
	}

	renderLevelOptions() {
		let filter = this.currentFilter,
			fullname = filter.property.fullName;

		let members = this.props.members[fullname] || [];

		return [
			<select multiple={true} value={filter.value} onChange={this.setLevelValue}>
				{members.map(m => <option key={m.key} value={m.key}>{m.caption}</option>)}
			</select>
		];
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
			operator: 0,
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
		if (property.kind == 'level') {
			if (!this.props.members.hasOwnProperty(property.fullName)) this.props.onLevelChosen(property);

			this.props.onUpdateFilter({
				...this.currentFilter,
				property,
				value: []
			});
		} else {
			this.props.onUpdateFilter({
				...this.currentFilter,
				property,
				value: ''
			});
		}
	};

	setOperator = evt => {
		this.props.onUpdateFilter({
			...this.currentFilter,
			operator: evt.target.value
		});
	};

	setMeasureValue = evt => {
		let filter = this.currentFilter;

		if (!filter.property) return;

		this.props.onUpdateFilter({
			...filter,
			value: evt.target.value
		});
	};

	setLevelValue = evt => {
		let filter = this.currentFilter;

		if (!filter.property) return;

		this.props.onUpdateFilter({
			...filter,
			value: map(evt.target.selectedOptions, option => option.value).filter(Boolean)
		});
	}
}

export default FilterManager;
