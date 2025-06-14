export const fetchTransactions = (type, page, limit) => async (dispatch) => {
	try {
		const response = await fetch(`http://localhost:5000/incomesExpenses/paginated?page=${page}&limit=${limit}`);
		const result = await response.json();
		const data = result.data;
		const totalPages = result.totalPages;

		dispatch({ type: 'SET_TOTAL_PAGES', payload: totalPages }); //Проверяем сколько будет страниц (округление вверх)

		const filteredData =
			type === 'expenses' ? data.filter((item) => item.sum < 0) : data.filter((item) => item.sum >= 0);
		dispatch({ type: 'SET_INCOMES_EXPENSES', payload: filteredData });
		dispatch({ type: 'LOADING_ENDED' });
	} catch (error) {
		console.error('Ошибка при загрузке транзакций', error);
	}
};
