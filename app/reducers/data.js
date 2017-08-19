const initialState = {
	viz: {
		type: "treemap",
		panel: true,
		groupBy: ["group", "name"]
	},
	rawData: [],
	visualization: 'treemap',
	cube: "Employee Records",
	dimension: "occupation",
	measure: "Salary Sum"
};

export default function(state = initialState, action) {
	switch (action.type) {
		case "DATA_UPDATE": {
			return { ...state, rawData: action.payload };
		}

		case "VIZ_UPDATE": {
			return { ...state, viz: { ...state.viz, ...action.payload } };
		}

		default:
			return state;
	}
}
