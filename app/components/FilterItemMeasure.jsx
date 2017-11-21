import React from "react";

import OPERATORS, {
	KIND_NUMBER as NUMBER_OPERATORS,
	LABELS as OPERATOR_LABELS
} from "helpers/operators";

import { Button, NumericInput } from "@blueprintjs/core";
import CustomSelect from "components/CustomSelect";

function FilterItemMeasure(props) {
	let { filter, properties, onSetProperty, onSetOperator, onSetValue } = props;

	return (
		<div className="filter-item measure">
			<div className="group filter-property">
				<CustomSelect
					value={filter.property}
					items={properties}
					onItemSelect={onSetProperty}
				/>
			</div>
			<div className="group filter-values pt-control-group">
				<div className="pt-select">
					<select value={filter.operator} onChange={onSetOperator}>
						{NUMBER_OPERATORS.map(ms => (
							<option value={OPERATORS[ms]}>{OPERATOR_LABELS[ms]}</option>
						))}
					</select>
				</div>
				<NumericInput
					className="pt-fill"
					value={filter.value}
					onValueChange={onSetValue}
				/>
			</div>
			<div className="group filter-actions">
				<Button className="pt-small" onClick={props.onReset} text="Reset" />
				<Button className="pt-small pt-intent-primary" onClick={props.onSave} text="Save" />
			</div>
		</div>
	);
}

export default FilterItemMeasure;
