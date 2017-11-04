import React from "react";
import { Button, Dialog, Intent } from "@blueprintjs/core";
import { Position } from "@blueprintjs/core/dist/common/position";
import { Popover } from "@blueprintjs/core/dist/components/popover/popover";
import { Menu } from "@blueprintjs/core/dist/components/menu/menu";
import { MenuItem } from "@blueprintjs/core/dist/components/menu/menuItem";

class InputTable extends React.Component {
	render() {
		return (
			<div className="group filters-wrapper">
				<Popover
					target={
						<Button className="pt-fill" iconName="insert">
							Add measure
						</Button>
					}
					content={
						<Menu>
							{this.props.options
								.sort(this.sortParentsFirst)
								.map(option => this.createMenuItem(option, this.props.onClick))}
						</Menu>
					}
					position={Position.RIGHT}
				/>
			</div>
		);
	}

	createMenuItem(item, onClick) {
		let children = null,
			attr = { key: item.key, text: item.label };

		if (Array.isArray(item.value)) {
			children = item.value.map(createMenuItem);
		} else {
			attr.onClick = () => onClick(item.value);
		}

		return React.createElement(MenuItem, attr, children);
	}

	sortParentsFirst(a, b) {
		return (a.value.length || 0) < (b.value.length || 0);
	}
}

export default InputTable;
