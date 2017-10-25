/** @type {DataState} */
const initialState = {
	fetching: false,
	success: null,
	error: null,

	values: [],
	axes: [],
	dimensions: [],

	filters: {
		type: "",
		options: []
	}
};

/**
 * Reducer for the data source.
 * @param {DataState} state Current state
 * @param {ReduxMessage} action Redux message.
 * @returns {DataState}
 */
export default function(state = initialState, action) {
	switch (action.type) {
		case "DATA_FETCH": {
			return {
				...state,
				fetching: true,
				success: null,
				error: null
			};
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

		case "FILTER_ISOLATE_DIMENSION": {
			return {
				...state,
				filters: {
					...state.filters,
					type: "isolate",
					options: [].concat(action.payload)
				}
			};
		}

		case "FILTER_HIDE_DIMENSION": {
			return {
				...state,
				filters: {
					...state.filters,
					type: "hide",
					options: [].concat(state.filters.options, action.payload)
				}
			};
		}

		default:
			return state;
	}
}
