export function createBuckets(data) {
	if (data !== undefined) {
		return data.map(item => {
			let obj = {
				...item,
				id:
					(parseInt(item.id) - parseInt(item.id) % 10).toString() +
					" to " +
					(9 + parseInt(item.id) - parseInt(item.id) % 10).toString()
			};
			return obj;
		});
	} else {
		return data
	}
}

function prepareInterval(num) {

}