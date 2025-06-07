import { GetDataFromServer } from '../api/getDataFromServer';
import { LIMIT_INCOME_EXPENSES } from '../constants/limitPaginationExpensesIncome';

const data = GetDataFromServer('incomesExpenses');

export const fetchTransactions = (type, page) => async (dispatch) => {
	//Тут фильтрум данные для пагинации, чтобы показывать по 5 элементов, без фильтра на стороне сервера данные отрисовываются неправильно
	//Показывает например: 3 дохода и 2 расхода
	const query =
		type === 'expenses'
			? `?sum_lt=0&_page=${page}&_limit=${LIMIT_INCOME_EXPENSES}`
			: `?sum_gte=0&_page=${page}&_limit=${LIMIT_INCOME_EXPENSES}`;

	const { data: dataIncomesExpenses, totalCount } = await data.getDataForAccountPagination(query);
	dispatch({ type: 'SET_TOTAL_PAGES', payload: Math.ceil(totalCount / LIMIT_INCOME_EXPENSES) }); //Проверяем сколько будет страниц (округление вверх)

	const filteredData =
		type === 'expenses'
			? dataIncomesExpenses.filter((item) => item.sum < 0)
			: dataIncomesExpenses.filter((item) => item.sum >= 0);
	dispatch({ type: 'SET_INCOMES_EXPENSES', payload: filteredData });
	dispatch({ type: 'LOADING_ENDED' });
};
