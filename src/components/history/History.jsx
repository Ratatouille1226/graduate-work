import { GetDataFromServer } from '../../api/getDataFromServer';
import { useState, useEffect } from 'react';
import { Loader } from '../loader/Loader';
import styles from './history.module.css';
import { Pagination } from '../pagination/Pagination';
import { LIMIT_ACCOUNTS } from '../../constants';

export const History = () => {
	const [expensesIncome, setExpensesIncome] = useState([]);
	const [page, setPage] = useState(1); //Страница пагинации
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1); //Сколько всего страниц пагинации
	//Получение расходов и доходов
	useEffect(() => {
		const fetchData = async () => {
			const data = GetDataFromServer('incomesExpenses'); //Передаю аргумент чтобы использовать запрос для любых компонентов

			const { data: incomeExpensesData, totalCount } = await data.getDataForAccountPagination(
				`?_page=${page}&_limit=${LIMIT_ACCOUNTS}`,
			);
			setTotalPages(Math.ceil(totalCount / LIMIT_ACCOUNTS)); //Проверяем сколько будет страниц (округление вверх)
			setExpensesIncome(incomeExpensesData);
			setLoading(false);
		};
		fetchData();
	}, [page]);

	return (
		<div className={styles['container']}>
			<div className={styles['block__history']}>
				<div className={styles['header']}>
					<span>Тип</span>
					<span>Категория</span>
					<span>Сумма</span>
				</div>
				<div className={styles['block']}>
					{loading ? (
						<div className={styles['loader']}>
							<Loader />
						</div>
					) : (
						expensesIncome.map((item) => (
							<div
								key={item.id}
								className={`${styles['block__incomesExpenses']} ${item.sum < 0 ? styles['negative'] : ''}`}
							>
								<span>{item.sum < 0 ? 'Расход' : 'Доход'}</span>
								<span>{item.categories}</span>
								<span>{item.sum}</span>
							</div>
						))
					)}
				</div>
				<Pagination setPage={setPage} page={page} totalPages={totalPages} />
			</div>
		</div>
	);
};
