import { HTTP_LINK } from '../constants';

//Пока что все запросы похожи друг на друга и в одном файле, рефакторинг буду делать позже

export const GetDataFromServer = (dataName) => {
	//Получение всех данных
	const getExpensesIncome = async () => {
		try {
			const response = await fetch(`${HTTP_LINK}${dataName}`);

			if (!response.ok) throw new Error('Ошибка при получении доходов/расходов');

			return await response.json();
		} catch (error) {
			console.error('Ошибка в getExpensesIncome:', error);
			return null;
		}
	};
	//Получение данных расходов доходов для пагинации
	const getDataForAccountPagination = async (pagination = '') => {
		try {
			const response = await fetch(`${HTTP_LINK}${dataName}${pagination}`);

			if (!response.ok) throw new Error('Ошибка при получении доходов/расходов');

			const totalCount = +response.headers.get('X-Total-Count'); // Получаем общее количество возможных страниц пагинации
			const data = await response.json();

			return { data, totalCount };
		} catch (error) {
			console.error('Ошибка в getExpensesIncome:', error);
			return null;
		}
	};
	//Создание нового счёта/расхода/дохода
	const addNewAccounts = async (newData) => {
		try {
			const response = await fetch(`${HTTP_LINK}${dataName}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newData),
			});

			if (!response.ok) throw new Error('Ошибка при добавлении счёта');
			return await response.json();
		} catch (error) {
			console.error('Ошибка в addNewAccounts:', error);
			return null;
		}
	};
	//Удаление доходов/расходов/счетов
	const deleteAccounts = async (id, type) => {
		try {
			const response = await fetch(`${HTTP_LINK}${type}/${id}`, {
				method: 'DELETE',
			});

			return await response.json();
		} catch (error) {
			console.error('Ошибка при удалении счёта', error);
		}
	};
	//Изменение комментариев
	const editAddComments = async (id, newComment) => {
		try {
			const response = await fetch(`${HTTP_LINK}incomesExpenses/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ comment: newComment }),
			});

			if (!response.ok) throw new Error('Ошибка обновления комментария');

			return await response.json();
		} catch (error) {
			console.error('Ошибка комментария', error);
		}
	};
	//Изменение баланса на счетах
	const editSumAccounts = async (id, newSum, newCashback) => {
		try {
			const response = await fetch(`${HTTP_LINK}accounts/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({ balance: newSum, cashback: newCashback }),
			});

			return response.json();
		} catch (error) {
			console.error('Ошибка в изменении счёта', error);
		}
	};
	//Получение данных счёта для страницы счёта
	const getDataAccount = async (id) => {
		try {
			const response = await fetch(`${HTTP_LINK}accounts/${id}`);
			if (!response.ok) throw new Error('Ошибка при получении доходов/расходов');
			return await response.json();
		} catch (error) {
			console.error('Ошибка в getExpensesIncome:', error);
			return null;
		}
	};

	return {
		getExpensesIncome,
		addNewAccounts,
		deleteAccounts,
		editAddComments,
		editSumAccounts,
		getDataAccount,
		getDataForAccountPagination,
	};
};
