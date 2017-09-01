"use strict";

import { createElement } from "react";
import {
	Button,
	Menu,
	MenuItem,
	Popover,
	Position,
	Tag
} from "@blueprintjs/core";

function InputSelectPopover(props) {
	function createMenuItem(item) {
		let children = null,
			attr = { key: item._label, text: item._label };

		if (item._children.length == 0) {
			attr.onClick = () => props.onClick(item);
		} else {
			children = item._children.map(createMenuItem);
		}

		return createElement(MenuItem, attr, children);
	}

	return (
		<div className="pt-form-group">
			<label className="pt-label">{`${props.label}s`}</label>
			<Popover
				content={createElement(Menu, {}, props.menu.map(createMenuItem))}
				position={Position.RIGHT_TOP}
			>
				<Button
					className="pt-fill"
					iconName="add"
					text={`Add ${props.label}...`}
				/>
			</Popover>
			<div className="labels">
				{props.active}
			</div>
		</div>
	);
}

export default InputSelectPopover;
