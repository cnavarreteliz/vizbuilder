const initialState = {
	fetching: false,
	success: null,
	error: null,

	values: [],
	axes: [],
	dimensions: []
}; 

export default function(state = initialState, action) {
	switch (action.type) {
		case 'DATA_FETCH': {
			return { ...initialState, fetching: true };
		}
		
		case "DATA_FETCH_ERROR": {
			return {
				...state,
				fetching: false,
				success: false,
				error: action.payload
			};
		}

		case "DATA_FETCH_SUCCESS": {
			return {
				...state,
				fetching: false,
				success: true,
				error: null,
				values: action.payload
			};
		}

		default:
			return state;
	}
}
