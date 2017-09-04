const initialState = {
	fetching: false,
	success: null,
	error: null,

	all: [],
	current: null
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
				all: action.payload,
				current: action.payload[5]
				//current: action.payload[Math.floor(Math.random() * action.payload.length)]
			};
		}

		case "CUBES_SET": {
			return {
				...state,
				current: state.all.find(cube => cube.name == action.payload)
			};
		}

		default:
			return state;
	}
}
