/** @type {MembersState} */
const initialState = {
	loading: false
};

/**
 * @param {MembersState} state 
 * @param {ReduxMessage<{level: Level, members: Array<MondrianMember>, [x:string]: any}>} action 
 * @returns {MembersState}
 */
export default function(state = initialState, action) {
	switch (action.type) {
		case "MEMBERS_FETCH": {
			return {
				...state,
				loading: true
			};
		}

		case "MEMBERS_SET": {
			let level = action.payload.level;

			return {
				...state,
				[level.fullName]: action.payload.members
			};
		}

		case "FILTER_UPDATE": {
			/** @type {Level} */
			let property = action.payload.property;

			if (property && property.kind == 'level') {
				return {
					...state,
					[property.fullName]: []
				}
			}

			return state;
		}

		default:
			return state;
	}
}
