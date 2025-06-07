const initialAccountsState = {
	accounts: [],
	loading: false,
	addLoadingNewAccounts: false, //Лоадер для добавления спиннера после того как нажали добавить счёт
	error: null,
};

export const accountsReducer = (state = initialAccountsState, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'SET_LOADING':
			return {
				...state,
				loading: true,
			};
		case 'LOADING_ENDED':
			return {
				...state,
				loading: false,
			};
		case 'SET_LOADING_NEW_ACCOUNTS':
			return {
				...state,
				addLoadingNewAccounts: true,
			};
		case 'LOADING_NEW_ACCOUNTS_ENDED':
			return {
				...state,
				addLoadingNewAccounts: false,
			};
		case 'SET_ACCOUNTS':
			return {
				...state,
				accounts: payload,
			};
		case 'SET_ERROR':
			return {
				...state,
				error: payload,
			};
		default:
			return state;
	}
};
