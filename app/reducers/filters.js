/**
 * Reducer for filters.
 * @param {Array<Filter>} state Current Filter list.
 * @param {ReduxMessage<Filter>} action Redux message.
 * @returns {Array<Filter>}
 */
export default function(state = [], action) {
	switch (action.type) {
		case "CUBES_SET": {
			return [];
		}

		case "FILTER_ADD": {
			return [].concat(state, action.payload);
		}

		case "FILTER_UPDATE": {
			let key = action.payload.key,
				newState = [].concat(state);

			let index = state.findIndex(item => item.key == key);
			if (index > -1) {
				let newFilter = { ...state[index], ...action.payload };
				newState.splice(index, 1, newFilter);
			}

			return newState;
		}

		case "FILTER_DELETE": {
			return state.filter(filter => filter.key !== action.payload.key);
		}

		default:
			return state;
	}
}
