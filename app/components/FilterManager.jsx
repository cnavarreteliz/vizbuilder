import React from "react";
import PropTypes from "prop-types";

import OPERATOR from "helpers/operators";
import { makeRandomId } from "helpers/random";

import { Button, Dialog, Intent } from "@blueprintjs/core";
import FilterItem from "components/FilterItem";

/**
 * @typedef FilterManagerProps
 * @prop {Array<Filter>} filters Current filters list
 * @prop {Array<Measure>} measures Available measures list
 * @prop {Function} onAddFilter
 * @prop {Function} onUpdateFilter
 * @prop {Function} onRemoveFilter
 */

/**
 * @typedef FilterManagerState
 * @prop {boolean} isOpen Defines if the Dialog is open
 * @prop {Filter} current Filter element to edit in the Dialog
 */

/** @augments {React.Component<FilterManagerProps, FilterManagerState>} */
class FilterManager extends React.Component {
	static propTypes = {
		filters: PropTypes.array.isRequired,
		measures: PropTypes.array.isRequired,
		onAddFilter: PropTypes.func.isRequired,
		onUpdateFilter: PropTypes.func.isRequired,
		onRemoveFilter: PropTypes.func.isRequired
	};

	state = {
		isOpen: false,
		current: null
	};

	render() {
		let editFilter = this.editFilter,
			removeFilter = this.props.onRemoveFilter,
			current = this.state.current,
			measures = this.props.measures;

		let dialogBody = null;
		if (current)
			dialogBody = (
				<div className="pt-dialog-body">
					<select>
						<option>Show</option>
						<option>Don't show</option>
					</select>
					<select value={current.property} onChange={this.setProperty}>
						{measures.map(ms => <option value={ms.name}>{ms.name}</option>)}
					</select>
					<select value={current.operator} onChange={this.setOperator}>
						{Object.keys(OPERATOR).map(ms => <option value={ms}>{ms}</option>)}
					</select>
					<input type="number" value={current.value} onInput={this.setValue} />
				</div>
			);

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
					onClose={this.toggleDialog}
					title="Update filter"
				>
					{dialogBody}
					<div className="pt-dialog-footer">
						<div className="pt-dialog-footer-actions">
							<Button text="Cancel" onClick={this.toggleDialog} />
							<Button
								intent={Intent.PRIMARY}
								onClick={this.updateFilter}
								text="Save"
							/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}

	toggleDialog = () => {
		if (this.state.current.property === "")
			this.props.onRemoveFilter(this.state.current);
		this.setState(prevState => ({ isOpen: !prevState.isOpen }));
	};

	setProperty = evt => {
		let value = evt.target.value;
		this.setState(prevState => ({
			current: {
				...prevState.current,
				property: value
			}
		}));
	};

	setOperator = evt => {
		let value = evt.target.value;
		this.setState(prevState => ({
			current: {
				...prevState.current,
				operator: value
			}
		}));
	};

	setValue = evt => {
		let value = evt.target.value;
		this.setState(prevState => ({
			current: {
				...prevState.current,
				value: parseFloat(value)
			}
		}));
	};

	addFilter = () => {
		/** @type {Filter} */
		let newFilter = {
			key: makeRandomId(),
			operator: OPERATOR.EQUAL,
			property: "",
			value: 0
		};

		this.props.onAddFilter(newFilter);
		this.setState({
			isOpen: true,
			current: newFilter
		});
	};

	editFilter = filter => {
		this.setState({
			isOpen: true,
			current: filter
		});
	};

	updateFilter = () => {
		this.props.onUpdateFilter(this.state.current);
		this.setState({
			isOpen: false,
			current: null
		});
	};
}

export default FilterManager;
