import React from "react";

import { Button } from "@blueprintjs/core";
import CustomSelect from "components/CustomSelect";
import SelectMembers from "components/SelectMembers";

function FilterItemLevel(props) {
	let { filter, members, properties } = props;

	return (
		<div className="filter-item level">
			<div className="group filter-property">
				<CustomSelect
					value={filter.property}
					items={properties}
					onItemSelect={props.onSetProperty}
				/>
			</div>
			<div className="group filter-values">
				<SelectMembers
					items={members}
					selectedItems={filter.value}
					onItemSelect={props.onAddValue}
					onItemRemove={props.onRemoveValue}
				/>
			</div>
			<div className="group filter-actions">
				<Button text="Cancel" className="pt-small" onClick={props.onReset} />
				<Button text="Apply" className="pt-small pt-intent-primary" onClick={props.onSave} />
			</div>
		</div>
	);
}

export default FilterItemLevel;
