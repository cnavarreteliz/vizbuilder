export function makeRandomId() {
	return (
		"id" +
		Math.random()
			.toString(36)
			.substr(2, 5)
	);
}

export function pickOne(list) {
	return list[Math.floor(Math.random() * list.length)];
}