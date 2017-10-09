const initialState = {
	panel: {
		show: false
	},
	chart: {
		type: "treemap",
		growth: false,
	},
	axis: {
		x: '',
		y: '',
		year: ''
	},
	dialogPanel : {
		show: false
	},
	buckets: 10,
	timeDimension: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "VIZ_GROWTH_UPDATE": {
			return { ...state, chart: { ...state.chart, growth: action.payload } };
		}

		case "VIZ_TYPE_UPDATE": {
			return { ...state, chart: {...state.chart, type: action.payload, panel: action.panel} };
		}

		case "VIZ_TIMEDIMENSION_UPDATE": {
			return { ...state, timeDimension: action.payload };
		}

		case "VIZ_RANGE_UPDATE": {
			return { ...state, range: action.payload };
		}

		case "VIZ_BUCKET_UPDATE": {
			return { ...state, buckets: action.payload };
		}

		case "VIZ_COLORBY_SET": {
			return { ...state, chart: { ...state.chart, colorBy: action.payload } };
		}

		case "VIZ_PANEL_TOGGLE": {
			return { ...state, panel: {...state.panel, show: action.payload} };
		}

		case "VIZ_AXIS_UPDATE": {
			return {...state, axis: {...state.axis, [action.axis]: action.payload}};
		}

		case "VIZ_FULL_UPDATE": {
			return {...state, axis: {...state.axis, x: action.dimension, y: action.measure } };
		}

		case "VIZ_DIALOG_TOGGLE": {
			return { ...state, dialogPanel: { ...state.chart, show: action.payload } };
		}

		case "CUBES_SET": {
			let cube = action.payload;

			let dim = cube.dimensions[0],
				drilldown = dim.drilldowns[0],
				measure = cube.measures[0];

			let newState = setAxisX(state, drilldown);
			newState.axis.y = measure.name;
			
			return newState;
		}

		case "DRILLDOWN_SET": {
			return setAxisX(state, action.payload);
		}

		case "MEASURE_SET": {
			return { ...state, axis: { ...state.axis, y: action.payload.name } };
		}

		case "COLORBY_SET": {
			if ("growth" in action)
				return { ...state, chart: { ...state.chart, growth: action.growth } };

			return state;
		}

		default:
			return state;
	}
}

function setAxisX(state, payload) {
	let newState = { ...state, axis: { ...state.axis, x: payload.level } };

	switch (payload.level) {
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
