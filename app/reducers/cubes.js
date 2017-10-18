const initialState = {
	fetching: false,
	success: null,
	error: null,

	all: [],
	current: {
		measures: [],
		dimensions: [],
		stdDimensions: [],
		timeDimensions: [],
		drilldowns: [],
		stdDrilldowns: [],
		timeDrilldowns: [],
	}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "CUBES_FETCH": {
			return { ...initialState, fetching: true };
		}

		case "CUBES_FETCH_ERROR": {
			return {
				...state,
				fetching: false,
				success: false,
				error: action.payload
			};
		}

		case "CUBES_FETCH_SUCCESS": {
			return {
				...state,
				fetching: false,
				success: true,
				error: null,
				all: action.payload
			};
		}

		case "CUBES_SET": {
			// action.payload should be a Cube or a cube name
			let cubeName = action.payload;
			if ("string" !== typeof cubeName)
				cubeName = cubeName.name;
			// Make sure the cube exists searching for it in the array
			let newCube = state.all.find(cube => cube.name === cubeName);
			return newCube ? { ...state, current: newCube } : state;
		}

		default:
			return state;
	}
}
