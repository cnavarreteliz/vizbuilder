/** @type {MembersState} */
const initialState = {
	loading: false
};

/**
 * @param {MembersState} state
 * @param {ReduxMessage<{level: Level, members: Array<Member>, [x:string]: any}>} action
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

		default:
			return state;
	}
}
