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
		obj[e] = calculateYearlyGrowth(result[e]);
	});
	console.log(obj);
	return obj;
}
/**
 * Calculate Yearly Growth
 * @param {Array} data
 * @param {Boolean} peryear 
 * @param {Boolean} debugMode
 */

function calculateYearlyGrowth(data, peryear = false, debugMode = false) {
	// Sort data by year
	data = data.sort((a, b) => {
		return a.year - b.year;
	});
	const tensor = data.map(e => e.value);

	if(debugMode) {
		debug(data.map(e => e.year))
	}

	const period = tensor.slice(1);
	const lastperiod = tensor.slice(0, -1);

	// Calculate Growth per Year
	const growth_perYear = period.map((item, key) => {
		return lastperiod[key] !== 0 ? item / lastperiod[key] - 1 : 1;
	});

	if (peryear) return growth_perYear;

	return (
		growth_perYear.reduce((a, b) => {
			return a + b;
		}, 0) / growth_perYear.length
	);
}
/**
 * Verify if data is 
 */
function debug(tensor) {
	const period = tensor.slice(1);
	const lastperiod = tensor.slice(0, -1);

	const interval = period.map((item, key) => {
		return item - lastperiod[key]
	});

	alert(Array.from(new Set(interval)).length)
}

function calculateCategoryGrowth(obj) {
	// Verify if data is sorted by year
	obj = obj.sort((a, b) => {
		return a.year - b.year;
	});

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
