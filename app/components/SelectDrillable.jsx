import React from "react";
import classnames from "classnames";
import escapeRegExp from "lodash/escapeRegExp";

import { Icon } from "@blueprintjs/core";
import { Select } from "@blueprintjs/labs";

import "@blueprintjs/labs/dist/blueprint-labs.css";
import "styles/SelectDrillable.css";

SelectDrillable.defaultProps = {
	itemListPredicate(query, items) {
		query = query.trim();
		let tester = RegExp(escapeRegExp(query) || ".", "i");
		return items.filter(item => tester.test(item.name));
	},
	itemRenderer({ handleClick, item, isActive }) {
		return (
			<span
				className={classnames("select-option", {
					active: isActive,
					disabled: item.disabled
				})}
				onClick={handleClick}
			>
				{item.name}
			</span>
		);
	},
	popoverProps: {
		popoverClassName: "select-drillable pt-minimal"
	}
};

/**
 * @param {object} props 
 * @param {string|Array<any>} props.className 
 * @param {Selectable} props.value
 * @param {Array<Selectable>} props.items
 * @param {(item: Selectable, event?: Event) => void} props.onItemSelect
 */
function SelectDrillable(props) {
	props.className = classnames("select-drillable", props.className);

	if (!props.value || !props.value.label)
		props.value = { key: "", value: null, label: "Select...", disabled: true };

	return React.createElement(
		Select,
		props,
		<div className="select-option current" title={props.value.label}>
			<span className="value">{props.value.label}</span>
			<Icon iconName="double-caret-vertical" />
		</div>
	);
}

export default SelectDrillable;
