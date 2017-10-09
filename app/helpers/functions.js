import escapeRegExp from "lodash/escapeRegExp";

export function stopPropagation(evt) {
	evt.stopPropagation();
}

export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

export function regexIncludes(string, substring) {
	substring = escapeRegExp(substring || "");
	return RegExp(substring, 'i').test(string || "");
}
