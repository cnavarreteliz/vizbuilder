export function applyHideIsolateFilters(data, filters, type, property) {
	return data.reduce((all, item) => {
		if (type === "hide" && !filters.includes(item[property])) all.push(item);
		else if (type === "isolate" && filters.includes(item[property]))
			all.push(item);

		return all;
	}, []);
}

export function applyYearFilter(data, year) {
	return data.reduce((all, item) => {
		if(item.Year == year) all.push(item)
		return all;
	}, []);
}

export function groupLowestCategories(data, alpha = 0.05, min = 15) {
	if (data !== null) {
		// Reduce
		let allData = data;
		let total = 0;
		data = data.reduce((all, item) => {
			if (item.id in all) {
				all[item.id].value += item.value;
			} else {
				all[item.id] = item;
			}
			total += item.value;
			return all;
		}, {});

		// Convert Object to Array
		data = Object.keys(data).map(key => {
			return data[key];
		});

		if (data.length > min) {
			const sortdata = data.sort((a, b) => {
				return a.value - b.value;
			});

			let LOWESTCATEGORIES = [];
			// Pass all categories with minus alpha percent to "Other categories"
			sortdata.reduce((a, b) => {
				if (a + b.value > total * alpha) {
					b.id = b.id;
				} else {
					LOWESTCATEGORIES.push(b.id);
				}
				return a + b.value;
			}, 0);

			var output = [];
			allData = allData.map(item => {
				if (LOWESTCATEGORIES.includes(item.id)) {
					item.id = "Other";
				}
				return item;
			});
		}

		return allData;
	} else {
		return null;
	}
}