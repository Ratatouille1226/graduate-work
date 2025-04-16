import { GetDataFromServer } from '../../api/getDataFromServer';
import { useState, useEffect } from 'react';
import { Loader } from '../loader/Loader';
import styles from './history.module.css';

export const History = () => {
	const [expensesIncome, setExpensesIncome] = useState([]);
	const [loading, setLoading] = useState(true);
	//Получение расходов и доходов
	useEffect(() => {
		const fetchData = async () => {
			const data = GetDataFromServer('incomesExpenses'); //Передаю аргумент чтобы использовать запрос для любых компонентов

			const incomeExpensesData = await data.getExpensesIncome();
			setExpensesIncome(incomeExpensesData);
			setLoading(false);
		};
		fetchData();
	}, []);

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
			</div>
		</div>
	);
};
