export function generateColorSelector(measures) {
	return [].concat(
		{ name: "None", growthType: 0, measure: null },
		measures.reduce((all, ms) => {
			all.push({ name: ms.name, growthType: 0, measure: ms });
			if (!(/growth/i).test(ms.name) && ms.type !== "UNKNOWN") {
				all.push({ name: ms.name + " Growth", growthType: 1, measure: ms });
			}
			return all;
		}, [])
	)
}
