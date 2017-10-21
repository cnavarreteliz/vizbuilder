import intersection from "lodash/intersection";

import OPERATOR from "helpers/operators";
import { regexIncludes } from "helpers/functions";

/**
 * Applies a list of `Filter`s to an array.
 * @template T
 * @param {Array<T>} items Array to filter
 * @param {Array<Filter>} filters Array of `Filter` elements.
 * @returns {Array<T>}
 */
export function applyFilters(items, filters) {
	let applied_items = filters.map(function(filter) {
		return items.filter(function(item) {
			let operator = filter.operator,
				property = item[filter.property],
				test = false;

			if (operator & OPERATOR.EQUAL)
				test = test || property == filter.value;

			if (operator & OPERATOR.HIGHER) 
				test = test || property > filter.value;
			else if (operator & OPERATOR.LOWER)
				test = test || property < filter.value;

			if (operator & OPERATOR.CONTAINS) {
				test = test || regexIncludes(property, filter.value);
			}

			return test;
		});
	});

	return intersection(...applied_items);
}