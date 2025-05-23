import styles from './modal.module.css';

export const Modal = () => {
	return (
		<div className={styles['modal']}>
			<div className={styles['choose']}>
				<h2>Выбрать счёт</h2>
				<select>
					<option>gfgf</option>
					<option>gfgf</option>
					<option>gfgf</option>
					<option>gfgf</option>
				</select>
			</div>
		</div>
	);
};
