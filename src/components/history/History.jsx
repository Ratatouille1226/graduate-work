import { GetDataFromServer } from '../../api/getDataFromServer';
import { useState, useEffect } from 'react';
import styles from './history.module.css';

export const History = () => {
	const [expensesIncome, setExpensesIncome] = useState([]);
	//Получение расходов и доходов
	useEffect(() => {
		const fetchData = async () => {
			const data = GetDataFromServer();

			const incomeData = await data.getExpensesIncome();
			setExpensesIncome(incomeData);
		};
		fetchData();
	}, []);

	console.log(expensesIncome);

	return (
		<div className={styles['container']}>
			<div className={styles['block__history']}>
				<div className={styles['header']}>
					<span>Тип</span>
					<span>Категория</span>
					<span>Сумма</span>
				</div>
				<div className={styles['block']}>
					{expensesIncome.map((item, index) => (
						<div
							key={index}
							className={`${styles['block__incomesExpenses']} ${item.sum < 0 ? styles['negative'] : ''}`}
						>
							<span>{item.sum < 0 ? 'Расход' : 'Доход'}</span>
							<span>{item.categories}</span>
							<span>{item.sum}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
