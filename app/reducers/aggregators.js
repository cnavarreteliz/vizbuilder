/** @type {AggregatorsState} */
const initialState = {
	measures: [],
	drilldowns: [],
	groupBy: [],
	colorBy: [],
	cuts: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "CUBES_SET": {
			/** @type {Cube} */
			let cube = action.payload;

			return {
				...initialState,
				drilldowns: cube.stdLevels.slice(0, 1),
				measures: cube.measures.slice(0, 1)
			};
		}

		case "DRILLDOWN_SET": {
			// payload can be the dimension object or its name
			let dd =
				"string" === typeof action.payload
					? state.drilldowns.find(item => item.name == action.payload)
					: action.payload;

			return dd ? { ...state, drilldowns: [dd] } : state;
		}

		case "GROUPBY_SET": {
			return { ...state, groupBy: [].concat(action.payload) };
		}

		case "COLORBY_SET": {
			let newColor = [];
			if (action.payload) newColor = [].concat(action.payload);
			return { ...state, colorBy: newColor };
		}

		case "MEASURE_ADD": {
			let ms = [].concat(state.measures, action.payload);
			return { ...state, measures: ms };
		}

		case "MEASURE_REMOVE": {
			return {
				...state,
				measures: state.measures.filter(ms => ms !== action.payload)
			};
		}

		case "MEASURE_SET": {
			// payload can be the measure object or its name
			let ms =
				"string" === typeof action.payload
					? state.measures.find(item => item.name === action.payload)
					: action.payload;
			return ms ? { ...state, measures: [action.payload] } : state;
		}

		case "CUT_SET": {
			/** @type {Level} */
			let level = action.payload.level;

			return {
				...state,
				cuts: {
					...state.cuts,
					// using fullName you make sure there's no repeated property
					[level.fullName]: {
						level: level,
						cutMembers: action.payload.members
					}
				}
			};
		}

		default:
			return state;
	}
}
