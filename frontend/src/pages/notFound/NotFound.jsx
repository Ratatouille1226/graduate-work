import notFoundImg from '../../assets/notFound.png';
import styles from './notFound.module.css';

export const NotFound = () => {
	return (
		<div className={styles['not__found-bg']}>
			<h1>Такой страницы не существует...</h1>
			<img src={notFoundImg} alt="" />
		</div>
	);
};
