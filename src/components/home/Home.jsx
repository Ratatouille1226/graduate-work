import styles from './home.module.css';
import { Link } from 'react-router-dom';

export const Home = () => {
	return (
		<div className={styles['container']}>
			<div className={styles['blocks']}>
				<Link to="/incomes" className={styles['categories']}>
					<h2>Доходы</h2>
					<i className="fa-solid fa-money-bill-trend-up"></i>
				</Link>
				<Link to="/expenses" className={styles['categories']}>
					<h2>Расходы</h2>
					<i className="fa-solid fa-money-bill-transfer"></i>
				</Link>
				<Link to="/accounts" className={styles['categories']}>
					<h2>Счета</h2>
					<i className="fa-solid fa-credit-card"></i>
				</Link>
			</div>
			<button className={styles['show__analytics']}>Посмотреть аналитику</button>
		</div>
	);
};
