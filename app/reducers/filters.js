export default function(state = [], action) {
	switch (action.type) {
		case "CUBES_SET": {
			return [];
		}

		case "FILTER_ADD": {
			/* 
			 * @param action.payload (Object) An object to add to the filter list.
			 */
			let newFilter = {
				...action.payload,
				_id: Math.random().toString(36).substr(2, 5)
			};
			if (newFilter.property && !isNaN(newFilter.operator) && !isNaN(newFilter.value))
				return [].concat(state, newFilter);
			else
				return state;
		}

		case "FILTER_UPDATE": {
			/* 
			* @param action.payload (Object) An object with the new properties to update.
			*/
			let index = state.findIndex(item => item._id == action.payload._id),
				newFilter = { ...state[index], ...action.payload },
				newState = [].concat(state);
			newState.splice(index, 1, newFilter);
			return newState;
		}

		case "FILTER_DELETE": {
			/* 
			 * @param action.payload (string) The _id of the filter to delete.
			 */
			return state.filter(filter => filter._id != action.payload);
		}

		default:
			return state;
	}
}
