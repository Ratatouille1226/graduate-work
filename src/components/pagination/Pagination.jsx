import styles from './pagination.module.css';

export const Pagination = ({ setPage, page, totalPages }) => {
	return (
		<div className={styles['pagination']}>
			<button disabled={page === 1} onClick={() => setPage(1)}>
				1
			</button>
			<button disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
				<i className="fa-solid fa-arrow-left"></i>
			</button>
			<span>{page}</span>
			<button disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
				<i className="fa-solid fa-arrow-right"></i>
			</button>
			<button disabled={page === totalPages} onClick={() => setPage(totalPages)}>
				{totalPages}
			</button>
		</div>
	);
};
