import has from "lodash/has";

/** @type {DataState} */
const initialState = {
	fetching: false,
	success: null,
	error: null,

	values: [],
	axis: {
		x: {},
		y: {},
		time: {}
	},
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
			let values = action.payload.values,
				dimensions = action.payload.dimensions,
				measure = dimensions.find(dim => dim.type == "measures");

			return {
				...state,
				fetching: false,
				success: true,
				error: null,
				values: action.payload.values,
				axis: {
					time: dimensions.find(dim => dim.type == "time"),
					x: dimensions.find(dim => dim.type == "standard"),
					y: measure.members[0]
				}
			};
		}

		case "DATA_CLEAN_VALUES": {
			let data = state.values;
			if (has(data[0], 'value'))
				delete data[0].value

			return {
				...state,
				values: data
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
