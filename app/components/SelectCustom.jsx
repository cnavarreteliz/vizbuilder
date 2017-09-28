import React from "react";
import classnames from "classnames";
import escape from "regex-escape";

import { stopPropagation } from "helpers/functions";

import "styles/SelectCustom.css";

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
		disabled: false,
		placeholder: { label: "Select...", value: null, disabled: true }
	};

	componentWillUnmount() {
		document.removeEventListener("click", this.handleCloseOutside, true);
	}

	render() {
		let value = this.props.value,
			current = this.props.options.find(item => value == item.value);

		if (!current) current = this.props.placeholder;

		let options = [];
		if (!this.props.placeholder.disabled) {
			options.push(this.props.placeholder);
		}
		options.push(...this.props.options);

		return (
			<span
				ref={this.handleRef}
				className={classnames("select-box", this.props.className, {
					open: this.state.open,
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
					<span className="select-current" onClick={this.handleToggle}>
						<span className="select-option select-current-option">
							{this.renderOption(current)}
						</span>
						<span className="select-current-icon icon-caret">▼</span>
					</span>
				)}
				{this.state.open && (
					<span className="select-options">
						{options.filter(this.filterOption).map((item, index) => (
							<span
								key={item.key || index}
								className={classnames("select-option", {
									disabled: item.disabled
								})}
								onClick={this.handleSelect}
							>
								{this.renderOption(item, index)}
							</span>
						))}
					</span>
				)}
			</span>
		);
	}

	renderOption(item, index) {
		return item.label || item.value;
	}

	filterOption = item => {
		return this.state.filter.test(item.label || item.value || "");
	};

	handleRef = box => {
		this._el = box;
	};

	handleToggle = () => {
		if (this.state.open) {
			this.setState({ open: false });
			document.removeEventListener("click", this.handleCloseOutside, true);
		} else {
			this.setState({ open: true, filter: RegExp(".") });
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
		let options = [];

		if (!this.props.placeholder.disabled) {
			options.push(this.props.placeholder);
		}

		let target = evt.target.textContent,
			item = options
				.concat(this.props.options)
				.find(item => (item.label || item.value) == target);

		if (item && !item.disabled) {
			this.props.onChange(item);
			this.setState({ open: false });
			document.removeEventListener("click", this.handleCloseOutside, true);
		}
	};

	handleFilter = evt => {
		let value = ("" + evt.target.value).trim();
		value = escape(value) || ".";
		this.setState({ filter: RegExp(value, "i") });
	};
}

export default CustomSelect;
