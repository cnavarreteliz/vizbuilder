import React from "react";
import { Tooltip2, Popover2 } from "@blueprintjs/labs";
import { Button, Position, PopoverInteractionKind } from "@blueprintjs/core";

class Tooltip extends React.Component {
	render() {
		const props = this.props;

		let popoverContent = (
			<div>
				<h4>Hello world</h4>
				<div className="pt-button-group pt-minimal">
					<Button
						className="pt-button pt-icon-eye-off"
						tabIndex="0"
						role="button"
					>
						Hide
					</Button>
					<Button className="pt-button pt-icon-pin" tabIndex="1" role="button">
						Isolate
					</Button>
				</div>
			</div>
		);

		return (
			<div className="legend">
				<Popover2
					content={popoverContent}
					position={Position.TOP}
					popoverClassName={"customtooltip"}
					interactionKind={PopoverInteractionKind.HOVER}
				>
					<div className="legend" />
				</Popover2>
			</div>
		);
	}
}

export default Tooltip;
