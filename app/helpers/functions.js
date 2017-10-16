import escapeRegExp from "lodash/escapeRegExp";

export function stopPropagation(evt) {
	evt.stopPropagation();
}

/**
 * Checks if an object is a valid number.
 * @param {*} n Value to test.
 * @returns {boolean}
 */
export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Tests if a Small string is inside a Big string, case insensitive.
 * @param {string|number} string Big string.
 * @param {string|number} substring Small string to test if inside of big string.
 * @returns {boolean}
 */
export function regexIncludes(string, substring) {
	substring = escapeRegExp(substring || "");
	return RegExp(substring, 'i').test(string || "");
}
