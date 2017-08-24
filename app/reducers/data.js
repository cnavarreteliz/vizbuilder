const initialState = {
	values: [],
	axes: [],
	dimensions: [],

	cube: "Employee Records",
	dimension: "Occupation",
	measure: "Salary Sum",
	year: 2017,
}; 

export default function(state = initialState, action) {
	switch (action.type) {
		case "DATA_YEAR_UPDATE": {
			return { ...state, year: action.payload };
		}

		case "DATA_UPDATE": {
			return { ...state, values: action.payload };
		}

		case "AXIS_UPDATE": {
			let newState = { ...state };
			if (action.cube) newState.cube = action.cube;
			if (action.dimension) newState.dimension = action.dimension;
			if (action.measure) newState.measure = action.measure;
			return newState;
		}

		default:
			return state;
	}
}
