import React from "react";
import classnames from "classnames";

import { Icon } from "@blueprintjs/core";
import CustomSelect from "components/CustomSelect";

import CHARTS from "helpers/charts";

function SelectChartType(props) {
	props.className = classnames("select-charttype", props.className);
	props.items = CHARTS;
	props.value = CHARTS.find(chart => chart.key == props.value) || {
		key: "",
		name: "Select..."
	};

	return React.createElement(
		CustomSelect,
		props,
		<div className="select-option current" title={props.value.name}>
			<Icon iconName={props.value.icon} title={`[${props.value.key} icon]`} />
			<span className="value">{props.value.name}</span>
			<Icon iconName="double-caret-vertical" />
		</div>
	);
}

export default SelectChartType;
