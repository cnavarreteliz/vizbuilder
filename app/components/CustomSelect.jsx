import React from "react";
import classnames from "classnames";
import escape from "regex-escape";

import { stopPropagation } from "helpers/functions";

import "styles/CustomSelect.css";

class CustomSelect extends React.Component {
	state = {
		open: false,
		filter: RegExp(".")
	};

	static propTypes = {
		options: PropTypes.array.isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		onChange: PropTypes.func,
		disabled: PropTypes.bool
	};

	static defaultProps = {
		options: [],
		value: "",
		disabled: false
	};

	componentWillUnmount() {
		document.removeEventListener("click", this.handleCloseOutside, true);
	}

	render() {
		let value = this.props.value,
			current = this.props.options.find(item => value == item.value);

		if (!current) current = { label: "Undefined", value: null };

		return (
			<div
				ref={this.handleRef}
				className={classnames("select-box", this.props.className, {
					disabled: this.props.disabled
				})}
			>
				{this.state.open ? (
					<label
						className="select-current select-filter"
						onClick={this.handleToggle}
					>
						<input
							type="text"
							className="select-filter-input"
							onClick={stopPropagation}
							onInput={this.handleFilter}
							autoFocus
						/>
						<span className="select-current-icon icon-search">🔍</span>
					</label>
				) : (
					<div className="select-current" onClick={this.handleToggle}>
						<span className="select-current-label">
							{current.label || current.value}
						</span>
						<span className="select-current-icon icon-caret">▼</span>
					</div>
				)}
				{this.state.open && (
					<ul className="select-options">
						{this.props.options
							.filter(this.filterOption)
							.map(this.renderOption)}
					</ul>
				)}
			</div>
		);
	}

	filterOption = item => {
		return this.state.filter.test(item.label || item.value || '');
	};

	renderOption = (item, index) => {
		return (
			<li className="select-option" onClick={this.handleSelect}>
				{item.label || item.value}
			</li>
		);
	};

	handleRef = box => {
		this._el = box;
	};

	handleToggle = () => {
		if (this.state.open) {
			this.setState({ open: false });
			document.removeEventListener("click", this.handleCloseOutside, true);
		} else {
			this.setState({ open: true, filter: RegExp('.') });
			document.addEventListener("click", this.handleCloseOutside, true);
		}
	};

	handleCloseOutside = evt => {
		if (!this._el.contains(evt.target) && !this._el.isSameNode(evt.target)) {
			this.setState({ open: false });
			document.removeEventListener("click", this.handleCloseOutside, true);
		}
	};

	handleSelect = evt => {
		let item = this.props.options;
		this.props.onChange(item);
	};

	handleFilter = evt => {
		let value = ("" + evt.target.value).trim();
		value = escape(value) || ".";
		this.setState({ filter: RegExp(value, "i") });
	};
}

export default CustomSelect;
