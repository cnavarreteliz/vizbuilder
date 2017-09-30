import React from "react";
import escape from "regex-escape";
import classnames from "classnames";

import { Icon } from "@blueprintjs/core";
import { Select } from "@blueprintjs/labs";

import "@blueprintjs/labs/dist/blueprint-labs.css";
import "styles/SelectDrillable.css";

SelectDrillable.defaultProps = {
	itemListPredicate(query, items) {
		query = query.trim();
		let tester = RegExp(escape(query) || ".", "i");
		return items.filter(item => tester.test(item.name));
	},
	itemRenderer({ handleClick, item, isActive }) {
		return (
			<span
				className={classnames("select-option", { active: isActive })}
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

function SelectDrillable(props) {
	return React.createElement(
		Select,
		{ ...props, className: classnames("select-drillable", props.className) },
		<div className="select-option current" title={props.value.name}>
			<span className="value">{props.value.name}</span>
			<Icon iconName="double-caret-vertical"/>
		</div>
	);
}

export default SelectDrillable;
