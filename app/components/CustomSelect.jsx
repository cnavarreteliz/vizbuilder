import React from "react";
import classnames from "classnames";
import escapeRegExp from "lodash/escapeRegExp";

import { Icon } from "@blueprintjs/core";
import { Select } from "@blueprintjs/labs";

import "@blueprintjs/labs/dist/blueprint-labs.css";
import "styles/CustomSelect.css";

CustomSelect.defaultProps = {
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
				{item.icon ? <Icon iconName={item.icon} /> : null}
				<span className="select-option-label">{item.name}</span>
			</span>
		);
	},
	popoverProps: {
		popoverClassName: "custom-select pt-minimal"
	}
};

/**
 * @class CustomSelect
 * @augments {React.Component<CustomSelectProps>}
 * @static {object} defaultProps
 * @param {object} props 
 * @param {string|Array<any>} [props.className] 
 * @param {JSX.Element|Array<JSX.Element>} [props.children]
 * @param {Array<Selectable>} props.items
 * @param {(item: Selectable, event?: Event) => void} props.onItemSelect
 * @param {Selectable} props.value
 */
function CustomSelect(props) {
	props = {
		...props,
		className: classnames("custom-select", props.className)
	};

	if (!props.value || !props.value.name)
		props.value = { value: null, name: "Select...", disabled: true };

	if (!props.children)
		props.children = (
			<div className="select-option current" title={props.value.name}>
				<span className="value">{props.value.name}</span>
				<Icon iconName="double-caret-vertical" />
			</div>
		);

	return React.createElement(Select, props, props.children);
}

export default CustomSelect;
