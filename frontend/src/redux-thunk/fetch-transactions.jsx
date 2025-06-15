export const fetchTransactions = (type, page, limit) => async (dispatch) => {
	try {
		const response = await fetch(
			`http://localhost:5000/incomesExpenses/paginated?page=${page}&limit=${limit}&type=${type}`,
		);
		const result = await response.json();
		const data = result.data;
		const totalPages = result.totalPages;

		dispatch({ type: 'SET_TOTAL_PAGES', payload: totalPages }); //Проверяем сколько будет страниц (округление вверх)

		dispatch({ type: 'SET_INCOMES_EXPENSES', payload: data });
		dispatch({ type: 'LOADING_ENDED' });

		return result;
	} catch (error) {
		console.error('Ошибка при загрузке транзакций', error);
		return null;
	}
};
