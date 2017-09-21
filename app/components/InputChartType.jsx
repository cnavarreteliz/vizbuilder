import React from "react";
import PropTypes from "prop-types";
import { Position } from "@blueprintjs/core/dist/common/position";
import { Popover } from "@blueprintjs/core/dist/components/popover/popover";
import { Menu } from "@blueprintjs/core/dist/components/menu/menu";
import { MenuItem } from "@blueprintjs/core/dist/components/menu/menuItem";

import CHARTS, { getChartByName } from "helpers/charts";

import "styles/InputChartType.css";

function InputChartType(props) {
	let current = getChartByName(props.value);

	let menu = (
		<div className="charttype-menu">
			{CHARTS.map(chart =>
				React.createElement("img", {
					key: chart.key,
					title: chart.name,
					className: props.type == chart.name ? "icon active" : "icon",
					src: chart.icon,
					onClick() {
						props.onChange && props.onChange(chart.name);
					}
				})
			)}
		</div>
	);

	let position =
		"string" === typeof props.position
			? Position[props.position]
			: props.position;

	return (
		<Popover content={menu} position={position}>
			<img className="charttype-current icon" title={current.name} src={current.icon} />
		</Popover>
	);
}

InputChartType.propTypes = {
	options: PropTypes.array.isRequired,
	value: PropTypes.string,
	onChange: PropTypes.func,
	position: PropTypes.oneOf([PropTypes.number, PropTypes.string])
};

InputChartType.defaultProps = {
	options: [],
	value: "",
	position: Position.BOTTOM_LEFT
};

function createMenuItem(item) {
	let children = null,
		attr = { key: item.fullName, text: item.name };
	attr.onClick = () => props.onClick(item);
	return React.createElement("img", attr, children);
}

export default InputChartType;
