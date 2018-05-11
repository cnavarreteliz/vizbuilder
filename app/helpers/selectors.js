export function colorSelector(measures) {
	return [].concat(
		{ name: "None", type: "none", measure: null },
		measures.reduce((all, ms) => {
			all.push({ name: ms.name, type: "standard", measure: ms });
			if (!/growth/i.test(ms.name) && ms.type !== "UNKNOWN") {
				all.push({ name: ms.name + " Growth", type: "growth", measure: ms });
			}
			return all;
		}, [])
	);
}
