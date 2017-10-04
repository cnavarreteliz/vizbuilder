import { Array1D, Scalar, NDArrayMathGPU } from "deeplearn";
import { isNumeric } from "helpers/functions";

export function calculateGrowth(data, key = "value") {
	const result = data.reduce((all, item) => {
		all[item.id] = all[item.id] || [];
		// Create custom item
		if (isNumeric(item[key]) && item[key])
			all[item.id].push({
				value: item[key],
				year: item.year
			});
		return all;
	}, Object.create(null));

	// Get growth by dimension
	const obj = {};
	Object.keys(result).map(e => {
		obj[e] = calculateCategoryGrowth(result[e]);
	});
	return obj;
}

function calculateCategoryGrowth(obj) {
	// Verify if data is sorted by year
	obj = obj.sort((a, b) => {
		return a.year - b.year;
	});

	console.log(obj);

	const math = new NDArrayMathGPU();
	const tensor = obj.map(e => e.value);

	// Create Arrays1D
	const YEARS = Array1D.new(obj.map(e => e.year));
	// Generate Arrays
	const period = Array1D.new(tensor.slice(1));
	const lastperiod = Array1D.new(tensor.slice(0, -1));
	const ONE = Scalar.new(1);
	let value;

	math.scope(() => {
		let max = math.max(YEARS),
			min = math.min(YEARS);

		if (period.shape[0] !== 0) {
			value =
				math
					.sum(math.arrayMinusScalar(math.divide(period, lastperiod), ONE))
					.getValues() / period.shape;
		} else {
			value = 0;
		}
	});

	return value;
}

// Group alpha percent of lowest categories
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
					item.id = "Other categories";
				}
				return item;
			});
		}

		return allData;
	} else {
		return null;
	}
}
