import { HTTP_LINK } from '../constants';

// Универсальный fetch с обработкой ошибок
const fetchData = async (url, options = {}, errorMsg = 'Ошибка запроса') => {
	try {
		const response = await fetch(url, options);
		if (!response.ok) throw new Error(errorMsg);
		return await response.json();
	} catch (error) {
		console.error(errorMsg, error);
		return null;
	}
};

export const GetDataFromServer = (dataName) => {
	return {
		// Получить все данные (доходы/расходы)
		getExpensesIncome: () => fetchData(`${HTTP_LINK}${dataName}`, {}, 'Ошибка при получении доходов/расходов'),

		// Пагинация
		getDataForAccountPagination: async ({ page = 1, limit = 11, filter = {} } = {}) => {
			try {
				// Сформировать query строку вручную
				const queryParams = new URLSearchParams({
					_page: page,
					_limit: limit,
					...(filter.sum_gte !== undefined ? { sum_gte: filter.sum_gte } : {}),
					...(filter.sum_lt !== undefined ? { sum_lt: filter.sum_lt } : {}),
				});

				const response = await fetch(`${HTTP_LINK}${dataName}?${queryParams}`);
				if (!response.ok) throw new Error('Ошибка при получении доходов/расходов');

				const totalCount = +response.headers.get('X-Total-Count'); // Сервер Mongo возвращает
				const data = await response.json();
				return { data, totalCount };
			} catch (error) {
				console.error('Ошибка в getDataForAccountPagination:', error);
				return null;
			}
		},

		// Добавить новый счёт / расход / доход
		addNewAccounts: (newData) =>
			fetchData(
				`${HTTP_LINK}${dataName}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newData),
				},
				'Ошибка при добавлении',
			),

		// Удалить счёт
		deleteAccounts: (id, type) =>
			fetchData(
				`${HTTP_LINK}${type}/${id}`,
				{
					method: 'DELETE',
				},
				'Ошибка при удалении',
			),

		// Изменить комментарий
		editAddComments: (id, newComment) =>
			fetchData(
				`${HTTP_LINK}incomesExpenses/${id}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ comment: newComment }),
				},
				'Ошибка обновления комментария',
			),

		// Изменить баланс счёта
		editSumAccounts: (id, newSum, newCashback = '') =>
			fetchData(
				`${HTTP_LINK}accounts/${id}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ balance: newSum, cashback: newCashback }),
				},
				'Ошибка в изменении счёта',
			),

		// Получить данные по счёту
		getDataAccount: (id) => fetchData(`${HTTP_LINK}accounts/${id}`, {}, 'Ошибка при получении счёта'),

		//Получение расходов и доходов без фильтрации для компонента аналитики
		getAllTransactions: () => fetchData(`${HTTP_LINK}${dataName}`, {}, 'Ошибка при получении транзакций'),
	};
};
