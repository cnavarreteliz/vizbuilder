import React from "react";
import PropTypes from "prop-types";

import { KIND_NUMBER, KIND_TEXT } from "helpers/operators";
import { makeRandomId } from "helpers/random";

import { Button, Dialog, Intent } from "@blueprintjs/core";
import FilterItem from "components/FilterItem";
import CustomSelect from "components/CustomSelect";

/**
 * @typedef FilterManagerProps
 * @prop {Array<Filter>} filters Current filters list
 * @prop {Array<Measure>} measures Available measures list
 * @prop {Array<Level>} dimensions Available level list
 * @prop {Array<MondrianMember>} members
 * @prop {(filter: Filter) => void} onAddFilter
 * @prop {(filter: Filter) => void} onUpdateFilter
 * @prop {(filter: Filter) => void} onRemoveFilter
 */

/**
 * @typedef FilterManagerState
 * @prop {boolean} isOpen Defines if the Dialog is open
 * @prop {Filter} old_filter Saves the old filter state in case of cancelling
 * @prop {number} current Index of the Filter element to edit in the Dialog
 * @prop {Dimension} dimension Saves the dimension to let choose from its drilldowns
 */

/** @augments {React.Component<FilterManagerProps, FilterManagerState>} */
class FilterManager extends React.Component {
	static propTypes = {
		filters: PropTypes.array.isRequired,
		measures: PropTypes.array.isRequired,
		levels: PropTypes.array.isRequired,
		members: PropTypes.array.isRequired,
		onAddFilter: PropTypes.func.isRequired,
		onUpdateFilter: PropTypes.func.isRequired,
		onRemoveFilter: PropTypes.func.isRequired
	};

	/** @type {FilterManagerState} */
	state = {
		isOpen: false,
		old_filter: undefined,
		dimension: undefined,
		current: -1
	};

	get currentFilter() {
		return this.props.filters[this.state.current];
	}

	render() {
		let dialogBody = null;

		let filter = this.currentFilter;

		if (filter) {
			let parent = filter.property || this.state.dimension;

			let option_handler = [];

			if (parent) {
				if (parent.kind == "measure") {
					option_handler = this.renderMeasureOptions.call(this);
				}
				else if (parent.kind == "dimension") {
					option_handler = this.renderDimensionOptions.call(this);
				}
			}

			/** @type {Array<Measure&Level>} */ 
			let parents = []
				.concat(this.props.measures, this.props.dimensions)
				.filter(Boolean);

			dialogBody = (
				<div className="pt-dialog-body">
					<div className="group">
						<span className="label">Filter by</span>
						<CustomSelect
							value={parent}
							items={parents}
							onItemSelect={this.setPrimary}
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
				{Object.keys(KIND_NUMBER).map(ms => <option value={ms}>{ms}</option>)}
			</select>,
			<input type="number" value={filter.value} onInput={this.setValue} />
		];
	}

	renderDimensionOptions() {
		let dimension = this.state.dimension,
			members = this.props.members,
			filter = this.currentFilter;

		return [
			<CustomSelect
				value={filter.property}
				items={dimension.drilldowns}
				onItemSelect={this.setProperty}
			/>,
			<select multiple={true} value={filter.operator} onChange={this.setOperator}>
				{members[dim].map(item => <option value={item.name}>{item.name}</option>)}
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

	setPrimary = primary => {
		if (primary.kind == "measure") this.setProperty(primary);
		else this.setState({ dimension: primary });
	};

	setProperty = value => {
		this.props.onUpdateFilter({
			...this.currentFilter,
			property: value
		});
	};

	setOperator = evt => {
		this.props.onUpdateFilter({
			...this.currentFilter,
			operator: evt.target.value
		});
	};

	setValue = evt => {
		this.props.onUpdateFilter({
			...this.currentFilter,
			value: parseFloat(evt.target.value)
		});
	};
}

export default FilterManager;
