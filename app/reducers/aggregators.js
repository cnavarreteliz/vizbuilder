const initialState = {
	measures: [],
	drilldowns: [],
	cuts: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "CUBES_SET": {
			return {
				measures: [],
				drilldowns: [],
				cuts: []
			};
		}

		case "DRILLDOWN_ADD": {
			let dd = [].concat(state.drilldowns, action.payload);
			dd.sort((a, b) => a.fullName.localeCompare(b.fullName));
			return { ...state, drilldowns: dd };
		}

		case "DRILLDOWN_DELETE": {
			let dd = state.drilldowns.filter(item => item != action.payload);
			return { ...state, drilldowns: dd };
		}

		case "MEASURE_ADD": {
			let ms = [].concat(state.measures, action.payload);
			ms.sort((a, b) => a.name.localeCompare(b.name));
			return { ...state, measures: ms };
		}

		case "MEASURE_DELETE": {
			let ms = state.measures.filter(item => item != action.payload);
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
