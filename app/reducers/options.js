const initialState = {
	cubes: [],
	dimensions: [],
	measures: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "OPTIONS_UPDATE": {
			let newState = { ...state };
			if (action.cubes) newState.cubes = action.cubes;
			if (action.dimensions) newState.dimensions = action.dimensions;
			if (action.measures) newState.measures = action.measures;
			return newState;
		}

		default:
			return state;
	}
}
