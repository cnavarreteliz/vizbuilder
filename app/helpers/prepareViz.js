import { Array1D, Scalar, NDArrayMathGPU } from "deeplearn";
import { isNumeric } from "helpers/functions";

export function calculateGrowth(data, x, y, time) {
	const result = data.reduce((all, item) => {
		all[item[x]] = all[item[x]] || [];
		// Create custom item
		if (isNumeric(item[y]) && item[y])
			all[item[x]].push({
				value: item[y],
				year: item[time]
			});
		return all;
	}, Object.create(null));

	// Get growth by dimension
	return Object.keys(result).reduce((obj, res) => {
		obj[res] = calculateYearlyGrowth(result[res]);
		return obj;
	}, {});
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

	if (debugMode) {
		debug(data.map(e => e.year));
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
		return item - lastperiod[key];
	});

	alert(Array.from(new Set(interval)).length);
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
