import { GetDataFromServer } from '../api/getDataFromServer';

const data = GetDataFromServer('accounts');

export const addNewAccounts = (newAccounts) => async (dispatch) => {
	dispatch({ type: 'SET_LOADING_NEW_ACCOUNTS' });

	try {
		await data.addNewAccounts(newAccounts);
		const updatedAccounts = await data.getExpensesIncome(); //Получаем обновленные данные с новым счётом
		dispatch({ type: 'SET_ACCOUNTS', payload: updatedAccounts });
		dispatch({ type: 'LOADING_NEW_ACCOUNTS_ENDED' });
	} catch (error) {
		dispatch({ type: 'SET_ERROR', payload: error.message });
	}
};
