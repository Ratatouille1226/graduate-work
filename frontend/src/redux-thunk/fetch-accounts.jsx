import { GetDataFromServer } from '../api/getDataFromServer';

const data = GetDataFromServer('accounts');

export const fetchAccounts = () => async (dispatch) => {
	dispatch({ type: 'SET_LOADING' });
	try {
		const dataAccounts = await data.getExpensesIncome();
		dispatch({ type: 'SET_ACCOUNTS', payload: dataAccounts });
		dispatch({ type: 'LOADING_ENDED' });
	} catch (error) {
		dispatch({ type: 'SET_ERROR', payload: error.message });
	}
};
