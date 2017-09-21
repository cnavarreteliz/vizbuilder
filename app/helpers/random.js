export function makeRandomId() {
	return (
		"id" +
		Math.random()
			.toString(36)
			.substr(2, 5)
	);
}