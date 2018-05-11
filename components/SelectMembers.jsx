import React from "react";
import classnames from "classnames";

import { MultiSelect } from "@blueprintjs/labs";

import "styles/SelectMembers.css";

SelectMembers.defaultProps = {
	itemRenderer({ handleClick, item, isActive }) {
		return (
			<span
				className={classnames("target-option", { active: isActive })}
				onClick={handleClick}
			>
				{item.caption}
			</span>
		);
	},
	tagRenderer: item => item.caption,
	popoverProps: {
		popoverClassName: "select-members pt-minimal"
	},
	tagInputProps: {},
};

function SelectMembers(props) {
	props.className = classnames("select-members", props.className);
	props.tagInputProps.onRemove = props.onItemRemove;
	return React.createElement(MultiSelect, props);
}

export default SelectMembers;
