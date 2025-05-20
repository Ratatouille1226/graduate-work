import styles from './pagination.module.css';

export const Pagination = ({ setPage }) => {
	return (
		<div className={styles['pagination']}>
			<button onClick={() => setPage((prev) => prev - 1)}>Предыдущая</button>
			<button onClick={() => setPage(1)}>Начальная</button>
			<button onClick={() => setPage((prev) => prev + 1)}>Следующая</button>
		</div>
	);
};
