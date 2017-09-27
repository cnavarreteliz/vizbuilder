import React from "react";
import classnames from "classnames";

import CHARTS from "helpers/charts";

import CustomSelect from "components/SelectCustom";

import "styles/SelectChartType.css";

class ChartTypeSelect extends CustomSelect {
	static defaultProps = {
		className: "select-charttype",
		options: CHARTS.map(item => ({
			key: item.key,
			label: item.nllabel,
			value: item.name,
			icon: item.icon
		})),
		value: "",
		disabled: false,
		placeholder: { label: 'Select...', value: null, icon: '', disabled: true }
	};

	renderOption(item, index) {
		return [
			<img src={item.icon} alt={`${item.value} icon]`} />,
			<span className="select-option-label">{item.label}</span>
		];
	}
}

export default ChartTypeSelect;
