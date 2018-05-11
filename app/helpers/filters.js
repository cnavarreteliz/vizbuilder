import intersection from "lodash/intersection";

import OPERATORS from "helpers/operators";
import { regexIncludes, isNumeric } from "helpers/functions";

/**
 * Applies a list of `Filter`s to an array.
 * @template T
 * @param {Array<T>} items Array to filter
 * @param {Array<Filter>} filters Array of `Filter` elements.
 * @returns {Array<T>}
 */
export function applyFilters(items, filters) {
	filters = filters.filter(
		(filter) =>
			isNumeric(filter.value) &&
			filter.property &&
			filter.property.kind == "measure" &&
			filter.operator > 0
	);

	if (!filters.length) return items;

	let applied_items = filters.map(function(filter) {
		let operator = filter.operator || 0,
			property = filter.property.name;

		return items.filter(function(item) {
			let test = false;
			let value = item[property];

			if (!value) return test;

			if (operator & OPERATORS.EQUAL) test = test || value == filter.value;

			if (operator & OPERATORS.HIGHER) test = test || value > filter.value;
			else if (operator & OPERATORS.LOWER) test = test || value < filter.value;

			return test;
		});
	});

	return intersection(...applied_items);
}

/**
 * Use with Array.prototype.reduce
 * Separates a filter array by the kind of property it uses.
 * @param {{ms: Array<Measure>, lv: Array<Filter>}} all
 * @param {Filter} filter
 */
export function filterKindReducer(all, filter) {
	if (!filter.property) return all;

	if (filter.property.kind == "level" && filter.value.length) {
		all.lv.push(filter);
	} else if (filter.property.kind == "measure" && isNumeric(filter.value) && filter.operator > 0) {
		all.ms.push(filter.property);
	}

	return all;
}
