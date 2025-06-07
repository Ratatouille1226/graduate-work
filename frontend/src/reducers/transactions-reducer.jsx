const initialTransactionsState = {
	incomesExpenses: [],
	newComment: {},
	loading: true,
	totalPages: 1, //Сколько всего страниц пагинации
	pendingTransaction: null, //Транзакция на счету, отнимаем сумму если записан расход или добавляем если доход
};

export const transactionsReducer = (state = initialTransactionsState, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'SET_INCOMES_EXPENSES':
			return {
				...state,
				incomesExpenses: payload,
			};
		case 'SET_TOTAL_PAGES':
			return {
				...state,
				totalPages: payload,
			};
		case 'SET_PENDING_TRANSACTION':
			return {
				...state,
				pendingTransaction: payload,
			};
		case 'ADD_EDIT_COMMENT':
			return {
				...state,
				newComment: payload,
			};
		case 'REMOVE_COMMENT': {
			const updateComment = { ...state.newComment };
			delete updateComment[payload];

			return {
				...state,
				newComment: updateComment,
			};
		}
		case 'SET_NEW_COMMENT':
			return {
				...state,
				newComment: {
					...state.newComment,
					[action.payload.id]: action.payload.text,
				},
			};
		case 'LOADING_ENDED':
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
};
