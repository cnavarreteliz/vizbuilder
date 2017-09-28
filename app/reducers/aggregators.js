const initialState = {
	measures: [],
	drilldowns: [],
	groupBy: [],
	colorBy: [],
	cuts: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "CUBES_SET": {
			return initialState;
		}

		case "DRILLDOWN_ADD": {
			let dd = state.drilldowns.find(item => item === action.payload)
				? state.drilldowns
				: [].concat(state.drilldowns, action.payload);
			//dd.sort((a, b) => a.fullName.localeCompare(b.fullName));
			return { ...state, drilldowns: dd };
		}

		case "DRILLDOWN_SET": {
			// payload can be the dimension object or its name
			let dd =
				"string" === typeof action.payload
					? state.drilldowns.find(item => item.name == action.payload)
					: action.payload;

			return dd ? { ...state, drilldowns: [dd] } : state;
		}

		case "DRILLDOWN_DELETE": {
			let dd = state.drilldowns.filter(item => item !== action.payload);
			return { ...state, drilldowns: dd };
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
			ms.sort((a, b) => a.name.localeCompare(b.name));
			return { ...state, measures: ms };
		}

		case "MEASURE_SET": {
			// payload can be the measure object or its name
			let ms =
				"string" === typeof action.payload
					? state.measures.find(item => item.name === action.payload)
					: action.payload;
			return ms ? { ...state, measures: [action.payload] } : state;
		}

		case "MEASURE_DELETE": {
			let ms = state.measures.filter(item => item !== action.payload);
			return { ...state, measures: ms };
		}

		case "CUT_ADD": {
			let ct = { ...state.cuts };
			let name = action.payload.fullName;

			ct[name] = {
				items: [],
				dim: action.payload
			};

			return { ...state, cuts: ct };
		}

		case "CUT_EDIT": {
			let ct = { ...state.cuts },
				cut = { ...ct[action.cut] };

			cut.items = action.payload;
			ct[action.cut] = cut;

			return { ...state, cuts: ct };
		}

		case "CUT_DELETE": {
			let ct = { ...state.cuts };
			delete ct[action.payload];
			return { ...state, cuts: ct };
		}

		default:
			return state;
	}
}
