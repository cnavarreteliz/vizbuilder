import React from "react";
import PropTypes from "prop-types";
import { Popover, Menu, MenuItem, Position } from "@blueprintjs/core";

import "styles/InlineSelect.css";

function OptionElement(props) {
	return React.createElement(
		"option",
		{ key: props.key || props.value, value: props.value },
		props.label || props.value
	);
}

class InlineSelect extends React.Component {
	static propTypes = {
		options: PropTypes.array.isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		onChange: PropTypes.func
	};

	constructor(props) {
		super(props);

		this._id =
			"select-" +
			Math.random()
				.toString(36)
				.slice(2, 5);
	}

	render() {
		let onChange = this.props.onChange,
			menu = (
				<Menu>
					{this.props.options.map(item => (
						<MenuItem
							onClick={() => onChange({target: item})}
							text={item.label || item.value}
						/>
					))}
				</Menu>
			);

		return (
			<span className="inline-select" onClick={evt => evt.stopPropagation()}>
				<select id={this._id} onChange={this.props.onChange}>
					{this.props.options.map(OptionElement)}
				</select>
				<label htmlFor={this._id} className="selected">
					{this.getCurrentLabel()}
				</label>
			</span>
		);
	}

	getCurrentLabel() {
		let option = this.props.options.find(
			item => item.value === this.props.value
		);
		return option ? option.label || option.value : this.props.value;
	}
}

export default InlineSelect;
