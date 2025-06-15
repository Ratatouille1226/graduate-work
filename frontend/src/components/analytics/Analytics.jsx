import { useDispatch, useSelector } from 'react-redux';
import { selectTransactions } from '../../selectors';
import { useEffect } from 'react';
import { fetchAllTransactions } from '../../redux-thunk';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import styles from './analytics.module.css';

const COLORS = ['#00C49F', '#FF8042']; //Цвета диаграммы

export const Analytics = () => {
	const dispatch = useDispatch();
	const { incomesExpenses } = useSelector(selectTransactions);

	const incomes = incomesExpenses.filter((item) => item.sum > 0).reduce((acc, item) => acc + item.sum, 0);
	const expenses = incomesExpenses.filter((item) => item.sum < 0).reduce((acc, item) => acc + Math.abs(item.sum), 0);

	const data = [
		{ name: 'Доходы', value: incomes },
		{ name: 'Расходы', value: expenses },
	];

	useEffect(() => {
		dispatch(fetchAllTransactions());
	}, []);

	return (
		<>
			<h2 className={styles['title']}>Доходы и расходы за всё время</h2>
			{incomesExpenses.length === 0 ? (
				<h2 className={styles['empty_data']}>Данных нет...</h2>
			) : (
				<PieChart className={styles['chart']} width={1500} height={400}>
					<Pie data={data} dataKey="value" nameKey="name" outerRadius={150} fill="#8884d8" label>
						{data.map((item, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index]} />
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</PieChart>
			)}
		</>
	);
};
