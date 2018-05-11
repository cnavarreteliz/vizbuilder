import concat from "lodash/concat";

/** @type {VisualsState} */
const initialState = {
	chart: {
		buckets: 10,
		time: [],
		type: "treemap"
	},
	axis: {
		standard: {
			x: "",
			y: "",
			time: ""
		},
		bubble: {
			x: "",
			y: "",
			size: "",
			discrete: ""
		}
	},
	dialogPanel: {
		show: false
	},
	history: []
};

/**
 * Reducer for aggregators.
 * These elements are set to build the query for the database.
 * They represent the content state before getting the actual content.
 * @param {VisualsState} state Current state
 * @param {ReduxMessage} action Redux message.
 * @returns {VisualsState}
 */
export default function(state = initialState, action) {
	switch (action.type) {
		case "VIZ_TYPE_UPDATE": {
			return {
				...state,
				chart: { ...state.chart, type: action.payload }
			};
		}

		case "VIZ_BUCKET_UPDATE": {
			return { ...state, chart: { ...state.chart, buckets: action.payload } };
		}

		case "VIZ_AXIS_UPDATE": {
			return {
				...state,
				axis: {
					...state.axis,
					[action.property]: {
						...state.axis[action.property],
						[action.axis]: action.payload.name
					}
				}
			};
		}

		case "VIZ_CHART_TIME_SET": {
			return { ...state, chart: { ...state.chart, time: action.payload } };
		}

		case "CUBES_SET": {
			/** @type {Cube} */
			let cube = action.payload;

			let level = cube.stdLevels[0],
				measure = cube.measures[0];

			let newState = setAxisX(state, level);
			newState.axis.standard.y = measure.name;

			return newState;
		}

		case "DRILLDOWN_SET": {
			return setAxisX(state, action.payload);
		}

		case "MEASURE_SET": {
			return {
				...state,
				axis: {
					...state.axis,
					standard: { ...state.axis.standard, y: action.payload.name }
				}
			};
		}

		case "HISTORY_SET": {
			return {
				...state,
				history: action.payload
			};
		}

		default:
			return state;
	}
}

/**
 * Generates a new state, and sets its X axis.
 * @param {VisualsState} state Old state.
 * @param {Level} payload Drilldown.
 * @returns {VisualsState}
 */
function setAxisX(state, payload) {
	let newState = {
		...state,
		axis: {
			...state.axis,
			standard: { ...state.axis.standard, x: payload.levelName }
		}
	};
	switch (payload.levelName) {
		case "Age":
		case "Age Bucket":
			newState.chart.type = "bar";
			break;

		default:
			newState.chart.type = "treemap";
			break;
	}

	return newState;
}
