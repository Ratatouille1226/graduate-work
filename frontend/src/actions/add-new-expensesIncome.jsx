import { GetDataFromServer } from '../api/getDataFromServer';
import { fetchTransactions } from '../redux-thunk';

export const addExpensesIncome =
	(formData, type, page = 1) =>
	async (dispatch) => {
		const data = GetDataFromServer('incomesExpenses');
		const transaction = {
			categories: formData.categories,
			sum: type === 'expenses' ? -Math.abs(Number(formData.sum)) : Math.abs(Number(formData.sum)),
			date: new Date().toISOString(), // ISO для Mongo
			comment: formData.comment || '',
			type: type === 'expenses' ? 'expenses' : 'incomes',
		};

		dispatch({ type: 'SET_PENDING_TRANSACTION', payload: transaction });

		const response = await data.addNewAccounts(transaction);

		if (response) {
			dispatch(fetchTransactions(type, page));
		}
	};
