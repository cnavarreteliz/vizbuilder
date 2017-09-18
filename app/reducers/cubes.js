const initialState = {
	fetching: false,
	success: null,
	error: null,

	all: [],
	current: {
		dimensions: [],
		measures: [],
		drilldowns: [],
		stdDimensions: [],
		timeDimensions: []
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
			return {
				...state,
				current:
					"string" === typeof action.payload
						? state.all.find(cube => cube.name === action.payload)
						: action.payload
			};
		}

		default:
			return state;
	}
}
