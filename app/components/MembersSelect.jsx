import React from "react";
import classnames from "classnames";

import { MultiSelect } from "@blueprintjs/labs";

MembersSelect.defaultProps = {
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
		popoverClassName: "members-select pt-minimal"
	}
};

function MembersSelect(props) {
	props.className = classnames("members-select", props.className);
	props.tagInputProps = {
		onRemove: props.onItemRemove
	};
	console.log(props)
	return React.createElement(MultiSelect, props);
}

export default MembersSelect;
