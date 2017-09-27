import { Array1D, Scalar, NDArrayMathGPU } from "deeplearn";

export function calculateGrowth(data, key = 'value') {

	const result = data.reduce((r, a) => {
		r[a.id] = r[a.id] || [];
		// Create custom item
		let item = {
			value: a[key],
			year: a.year
		};
		r[a.id].push(item);
		return r;
	}, Object.create(null));

    // Get growth by dimension
    const obj = {}
    Object.keys(result).map(e => {
        obj[e] = calculateCategoryGrowth(result[e])   
    })
    return obj
}

function calculateCategoryGrowth(obj) {
    // Verify if data is sorted by year
    obj = obj.sort((a, b) => { return a.year - b.year });

	const math = new NDArrayMathGPU();
    const tensor = obj.map(e => e.value);

    // Create Arrays1D
	const period = Array1D.new(tensor.slice(1)); 
    const lastperiod = Array1D.new(tensor.slice(0, -1)); 
    const ONE = Scalar.new(1)
    let value

	math.scope(() => {
		value = math.sum(math.arrayMinusScalar(math.divide(period, lastperiod), ONE))
			.getValues() / period.shape
    });
    
    return value
}

// Group alpha percent of lowest categories
export function groupLowestCategories(data, alpha = 0.05) {
	if (data !== null) {
		const sortdata = data.sort((a, b) => {
			return a.value - b.value;
		});
		let total = sortdata.reduce((a, b) => {
			return a + b.value;
		}, 0);

		var output = [];
		sortdata.reduce((a, b) => {
			if (a + b.value > total * alpha) {
				b.id = b.id;
			} else {
				b.id = "Other categories";
			}
			output.push(b);
			return a + b.value;
		}, 0);

		return output;
	} else {
		return null;
	}
}
