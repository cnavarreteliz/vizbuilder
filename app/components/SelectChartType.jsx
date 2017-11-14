import React from "react";
import classnames from "classnames";
import escapeRegExp from "lodash/escapeRegExp";

import { Icon } from "@blueprintjs/core";
import { Select } from "@blueprintjs/labs";

import CHARTS from "helpers/charts";

import "@blueprintjs/labs/dist/blueprint-labs.css";
import "styles/SelectChartType.css";

SelectChartType.defaultProps = {
	itemListPredicate(query, items) {
		query = query.trim();
		let tester = RegExp(escapeRegExp(query) || ".", "i");
		return items.filter(item => tester.test(item.nllabel));
	},
	itemRenderer({ handleClick, item, isActive }) {
		return (
			<span
				className={classnames("select-option", {
					active: isActive,
					disabled: item.disabled
				})}
				onClick={handleClick}
			>
				<Icon iconName={item.icon} title={`[${item.name} icon]`} />
				<span className="select-option-label">{item.nllabel}</span>
			</span>
		);
	},
	popoverProps: {
		popoverClassName: "select-charttype pt-minimal"
	}
};

function SelectChartType(props) {
	props.className = classnames("select-charttype", props.className);
	props.items = CHARTS;
	props.value = CHARTS.find(chart => chart.name == props.value) || {
		nllabel: "Select...",
		icon: "",
		name: ""
	};

	return React.createElement(
		Select,
		props,
		<div className="select-option current" title={props.value.nllabel}>
			<Icon iconName={props.value.icon} title={`[${props.value.name} icon]`} />
			<span className="value">{props.value.nllabel}</span>
			<Icon iconName="double-caret-vertical" />
		</div>
	);
}

export default SelectChartType;
