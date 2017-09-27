export function stopPropagation(evt) {
	evt.stopPropagation();
}

export function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
