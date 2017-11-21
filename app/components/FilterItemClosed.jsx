import React from "react";

import { LABELS as OPERATOR_LABELS } from "helpers/operators";

import { Button } from "@blueprintjs/core";

function FilterItemClosed(props) {
	let { property, value } = props.filter;

	let operator = "";
	if (property.kind == "measure") {
		operator = OPERATOR_LABELS[props.filter.operator];
	}

	if (Array.isArray(value)) {
		value = value.map(item => <span>{item.name}</span>);
	}

	return (
		<div className="filter-item closed">
			<ul className="filter-content">
				<li className="filter-prop">{property.name}</li>
				<li className="filter-oper">{operator}</li>
				<li className="filter-value">{value}</li>
			</ul>
			<Button
				className="filter-action remove pt-small pt-intent-danger pt-minimal"
				iconName="trash"
				title="Remove filter"
				onClick={props.onRemove}
			/>
			<Button
				className="filter-action update pt-small pt-intent-primary pt-minimal"
				iconName="settings"
				title="Edit filter"
				onClick={props.onEdit}
			/>
		</div>
	);
}

export default FilterItemClosed;
