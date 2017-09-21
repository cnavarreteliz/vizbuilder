import React from "react";
import PropTypes from "prop-types";
import { Position } from "@blueprintjs/core/dist/common/position";
import { Popover } from "@blueprintjs/core/dist/components/popover/popover";
import { Menu } from "@blueprintjs/core/dist/components/menu/menu";
import { MenuItem } from "@blueprintjs/core/dist/components/menu/menuItem";

function InputPopover(props) {
	console.log(props.options);
	
	let options = props.options.map(function createMenuItem(item) {
		let children = null,
			attr = { key: item.key, text: item.name };
		// let children = null,
		// 	attr = { key: item._label, text: item._label };

		// if (item._children.length == 0) {
		// 	attr.onClick = () => props.onClick(item);
		// } else {
		// 	children = item._children.map(createMenuItem);
		// }


		attr.onClick = () => props.onClick(item);

		return React.createElement(MenuItem, attr, children);
	});

	let menu = React.createElement(Menu, null, options);

	let position =
		"string" === typeof props.position
			? Position[props.position]
			: props.position;

	return (
		<Popover content={menu} position={position}>
			{props.value}
		</Popover>
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

export default InputPopover;
