import React from "react";
import PropTypes from "prop-types";
import { Button } from "@blueprintjs/core";

import "styles/FilterItem.css";

/**
 * @typedef FilterItemProps
 * @prop {Filter} item
 * @prop {Function} onEdit
 * @prop {Function} onRemove
 */

/** @augments {React.Component<FilterItemProps>} */
class FilterItem extends React.Component {
	propTypes = {
		item: PropTypes.object.isRequired,
		onEdit: PropTypes.func.isRequired,
		onRemove: PropTypes.func.isRequired
	};
	
	render() {
		let filter = this.props.item;

		return (
			<div className="filter-item">
				<span className="filter-content">
					<span className="filter-prop">{filter.property ? filter.property.name : ''}</span>
					<span className="filter-oper">{filter.operator}</span>
					<span className="filter-value">{filter.value}</span>
				</span>
				<Button
					className="filter-action remove pt-intent-danger pt-minimal"
					iconName="trash"
					onClick={this.removeHandler}
				/>
				<Button
					className="filter-action update pt-intent-primary pt-minimal"
					iconName="cog"
					onClick={this.updateHandler}
				/>
			</div>
		);
	}

	updateHandler = () => {
		this.props.onEdit(this.props.item);
	}

	removeHandler = () => {
		this.props.onRemove(this.props.item);
	}
}

export default FilterItem;
