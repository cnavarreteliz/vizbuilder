/** @type {ChartsState} */
const initialState = {
    table: {
        attributes: [],
        groupBy: [],
        sorted: []
    }
};

export default function(state = initialState, action) {
	switch (action.type) {
        case "CHART_TABLE_SET_SORTED": {
			return { ...state, table: { ...state.table, sorted: action.payload } };
		}
    }
}