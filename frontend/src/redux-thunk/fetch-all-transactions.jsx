import { GetDataFromServer } from '../api/getDataFromServer';

export const fetchAllTransactions = () => async (dispatch) => {
	try {
		const data = GetDataFromServer('incomesExpenses');
		const incomesExpenses = await data.getAllTransactions();
		dispatch({ type: 'SET_INCOMES_EXPENSES', payload: incomesExpenses });
	} catch (error) {
		console.error(error);
	}
};
