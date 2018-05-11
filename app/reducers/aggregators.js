/** @type {AggregatorsState} */
const initialState = {
	measures: [],
	drilldowns: [],
	groupBy: [],
	colorBy: [],
	growthBy: [],
	cuts: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "CUBES_SET": {
			/** @type {Cube} */
			const cube = action.payload;

			return {
				...initialState,
				drilldowns: action.level ? [action.level] : cube.stdLevels.slice(0, 1),
				measures: action.measure ? [action.measure] : cube.measures.slice(0, 1)
			};
		}

		case "DRILLDOWN_SET": {
			// payload can be the dimension object or its name
			const dd =
				"string" === typeof action.payload
					? state.drilldowns.find((item) => item.name == action.payload)
					: action.payload;

			return dd ? { ...state, drilldowns: [dd] } : state;
		}

		case "DRILLDOWN_ADD": {
			const dd = state.drilldowns.some((item) => item === action.payload)
				? state.drilldowns
				: [].concat(state.drilldowns, action.payload);

			return { ...state, drilldowns: dd };
		}

		case "GROUPBY_SET": {
			return { ...state, groupBy: [].concat(action.payload) };
		}

		case "COLORBY_SET": {
			let newColor = [];
			if (action.payload) newColor = [].concat(action.payload);
			return { ...state, colorBy: newColor, growthBy: [] };
		}

		case "GROWTHBY_SET": {
			let newGrowth = [];
			if (action.payload) newGrowth = [].concat(action.payload);
			return { ...state, growthBy: newGrowth, colorBy: [] };
		}

		case "COLORBY_DELETE": {
			return { ...state, growthBy: [], colorBy: [] };
		}

		case "MEASURE_ADD": {
			let ms = state.measures.some((item) => item === action.payload)
				? state.measures
				: [].concat(state.measures, action.payload);

			return { ...state, measures: ms };
		}

		case "MEASURE_DELETE": {
			return {
				...state,
				measures: state.measures.filter((ms) => ms !== action.payload)
			};
		}

		case "DRILLDOWN_DELETE": {
			return {
				...state,
				drilldowns: state.drilldowns.filter((dd) => dd !== action.payload)
			};
		}

		case "MEASURE_SET": {
			// payload can be the measure object or its name
			let ms =
				"string" === typeof action.payload
					? state.measures.find((item) => item.name === action.payload)
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
