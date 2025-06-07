import styles from './loader.module.css';

export const Loader = () => {
	return (
		<div className={styles['loader']}>
			<div className={styles['spinner']}></div>
			<h2>Загрузка...</h2>
		</div>
	);
};
