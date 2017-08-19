import mondrianClient from "helpers/mondrian";


/*
function getDimensionLevel(cubeName, dimension) {
	// Get promise
	console.log(dimension);
    return mondrianClient.cube(cubeName).then(cube => 
    
    getData(cubeName, dimension).promise[0].dimensionsByName[
		dimension
	].hierarchies[0].levels[1].then(data => data);
} */

async function getCube(cubeName) {
    return mondrianClient.cube(cubeName).then(cube => cube)
}

function setDrilldownDim(cubeName, dimension) {
    return getCube(cubeName).dimensionsByName[dimension].then(
        cube => {
            return {
				output1: dimension,
				output2: dimension,
				output3: cube.hierarchies[0].levels[1].name                
			};
        }
    )
    /*
	switch (dimension) {
		case "Occupation":
			return {
				output1: "Occupation",
				output2: "Occupation",
				output3: "Occupation group"
			};
		case "Gender":
			return { output1: "Gender", output2: "Gender", output3: "Gender" };
		default:
			return {
				output1: dimension,
				output2: dimension,
				output3: "All"
			};
    }
    */
}

function setCutFromCube(dimension, filters = []) {
	let cut = filters.map(
		filter => "${dimension}][${dimension}][${dimension}].&[{filter}]"
	);
	return "[${dimension}][${dimension}][${dimension}].&[{filters[0]}]";
}

export function getData(cubeName, dimension, metric = "Salary Sum") {

	const prm = mondrianClient.cube(cubeName).then(cube => {
        //let drilldownOpt = setDrilldownDim(cubeName, dimension);
        //output1 = dimension
        //output2 = dimension
        //output3 = cube.dimensionsByName[dimension].hierarchies[0].levels[1].name
		console.log(cube.dimensionsByName[dimension].hierarchies[0].levels[1].name);
		let prmValues = mondrianClient
			.query(
				cube.query
					.drilldown("Year", "Year") // Second dimension
					.drilldown(
						dimension,
						dimension,
						cube.dimensionsByName[dimension].hierarchies[0].levels[1].name
					) // Third dimension
					.measure(metric) // First dimension
					.cut("[Year].[Year].[Year].&[2016]")
			)
			.then(res => res.data);
		return Promise.all([cube, prmValues]);
	});

	/*
    const prmAll = Promise.all([prm]).then(values => ({
        data: values
    }));
    */

	return {
		type: "GET_DATA",
		promise: prm
	};
}
