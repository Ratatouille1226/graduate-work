import { useState, useEffect } from 'react';
import { Loader } from '../loader/Loader';
import styles from './history.module.css';

export const History = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 11; // Кол-во записей на странице

	useEffect(() => {
		fetchTransactions(currentPage);
	}, [currentPage]);

	const fetchTransactions = async (page) => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:5000/api/incomesExpenses/paginated?page=${page}&limit=${limit}`,
			);
			const result = await response.json();
			setTransactions(result.data);
			setCurrentPage(result.currentPage);
			setTotalPages(result.totalPages);
		} catch (error) {
			console.error('Ошибка при загрузке транзакций', error);
		}
		setLoading(false);
	};

	const handlePrev = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	return (
		<div className={styles['container']}>
			<div className={styles['block__history']}>
				<div className={styles['header']}>
					<span>Тип</span>
					<span>Категория</span>
					<span>Сумма</span>
				</div>
				{transactions.length === 0 ? (
					<h2 className={styles['empty_data']}>Данных нет...</h2>
				) : (
					<>
						<div className={styles['block']}>
							{loading ? (
								<div className={styles['loader']}>
									<Loader />
								</div>
							) : (
								transactions.map((item) => (
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
						<div className={styles['pagination']}>
							<button onClick={handlePrev} disabled={currentPage === 1}>
								Назад
							</button>
							<span>
								{' '}
								Страница {currentPage || 1} из {totalPages === 0 ? '1' : totalPages}{' '}
							</span>
							<button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
								Вперёд
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
