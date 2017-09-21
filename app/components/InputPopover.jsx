import React from "react";
import PropTypes from "prop-types";
import { Position } from "@blueprintjs/core/dist/common/position";
import { Popover } from "@blueprintjs/core/dist/components/popover/popover";
import { Menu } from "@blueprintjs/core/dist/components/menu/menu";
import { MenuItem } from "@blueprintjs/core/dist/components/menu/menuItem";

function InputPopover(props) {
	function createMenuItem(item) {
		let children = null,
			attr = { key: item.key, text: item.label };

		if (Array.isArray(item.value)) {
			children = item.value.map(createMenuItem);
		} else {
			attr.onClick = () => props.onClick(item.value);
		}

		return React.createElement(MenuItem, attr, children);
	}

	let position =
		"string" === typeof props.position
			? Position[props.position]
			: props.position;

	return (
		<Popover
			target={props.value}
			content={
				<Menu>{props.options.sort(sortParentsFirst).map(createMenuItem)}</Menu>
			}
			position={position}
		/>
	);
}

InputPopover.propTypes = {
	options: PropTypes.array.isRequired,
	value: PropTypes.string,
	onClick: PropTypes.func,
	position: PropTypes.oneOf([PropTypes.number, PropTypes.string])
};

InputPopover.defaultProps = {
	options: [],
	value: "",
	position: Position.BOTTOM
};

function sortParentsFirst(a,b) {
	return (a.value.length || 0) < (b.value.length || 0)
}

export default InputPopover;
