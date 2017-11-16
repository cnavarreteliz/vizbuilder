/** @type {VisualsState} */
const initialState = {
	panel: {
		show: false
	},
	chart: {
		type: "treemap",
		time: []
	},
	axis: {
		x: "",
		y: "",
		year: ""
	},
	bubbleAxis: {
		x: "",
		y: "",
		size: ""
	},
	dialogPanel: {
		show: false
	},
	buckets: 10,
	timeDimension: false
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
		// case "VIZ_GROWTH_UPDATE": {
		// 	return { ...state, chart: { ...state.chart, growth: action.payload } };
		// }

		case "VIZ_TYPE_UPDATE": {
			return {
				...state,
				chart: { ...state.chart, type: action.payload }
			};
		}

		// case "VIZ_TIMEDIMENSION_UPDATE": {
		// 	return { ...state, timeDimension: action.payload };
		// }

		// case "VIZ_RANGE_UPDATE": {
		// 	return { ...state, range: action.payload };
		// }

		case "VIZ_BUCKET_UPDATE": {
			return { ...state, buckets: action.payload };
		}

		// case "VIZ_COLORBY_SET": {
		// 	return { ...state, chart: { ...state.chart, colorBy: action.payload } };
		// }

		// case "VIZ_PANEL_TOGGLE": {
		// 	return { ...state, panel: { ...state.panel, show: action.payload } };
		// }

		case "VIZ_AXIS_UPDATE": {
			return {
				...state,
				axis: { ...state.axis, [action.axis]: action.payload }
			};
		}

		case "VIZ_CHART_TIME_SET": {
		 	return { ...state, chart: { ...state.chart, time: action.payload } };
		}

		// case "VIZ_FULL_UPDATE": {
		// 	return {
		// 		...state,
		// 		axis: { ...state.axis, x: action.dimension, y: action.measure }
		// 	};
		// }

		// case "VIZ_DIALOG_TOGGLE": {
		// 	return {
		// 		...state,
		// 		dialogPanel: { ...state.chart, show: action.payload }
		// 	};
		// }

		case "CUBES_SET": {
			/** @type {Cube} */
			let cube = action.payload;

			let level = cube.stdLevels[0],
				measure = cube.measures[0];

			let newState = setAxisX(state, level);
			newState.axis.y = measure.name;

			return newState;
		}

		case "DRILLDOWN_SET": {
			return setAxisX(state, action.payload);
		}

		case "MEASURE_SET": {
			return { ...state, axis: { ...state.axis, y: action.payload.name } };
		}

		case "BUBBLE_SET": {
			// payload can be the measure object or its name
			return { ...state, bubbleAxis: { ...state.bubbleAxis, [action.axis]: action.payload.name } };
		}

/*		case "COLORBY_SET": {
			if ("growth" in action)
				return { ...state, chart: { ...state.chart, growth: action.growth } };

			return state;
		} */

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
	let newState = { ...state, axis: { ...state.axis, x: payload.levelName } };

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
