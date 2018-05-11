export function createBuckets(data, num) {
	if (data !== undefined && num !== 0) {
		const buckets = prepareInterval(num)
		return data.map(item => {
			let obj = {
				...item,
				Age: searchInterval(buckets, item.Age)
			};
			return obj;
		});
	} else {
		return data
	}
}

function searchInterval(obj, value) {
	let label
	value = parseInt(value)
	obj.forEach(item => {
		if (item.first <= value && item.last >= value) {
			label = item.label
			return true
		}
	})
	return label
}

function prepareInterval(num, min=0, max=100) {
	num = parseInt(num)
	let output = []
	for(let i = min; i < max; i = i + num) {
		output.push({
			label: i.toString() + " to " + (i + num).toString(),
			first: i,
			last: i + num - 1,
		})
	}
	
	// Prepare labels in extremes
	output[0].label = "< " + num
	output[output.length - 1].label = ">= " + output[output.length - 1].first
	output[output.length - 1].last = 9999

	return output
}