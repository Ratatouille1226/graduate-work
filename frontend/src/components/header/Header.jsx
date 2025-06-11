import styles from './header.module.css';
import logo from '../../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
	const location = useLocation(); //для того чтобы отображать класс активности только когда мы находимся на этой странице

	return (
		<header className={styles['header']}>
			<div className={styles['logo__buttons']}>
				<img src={logo} alt="logo" />
				<Link
					to="/home"
					className={
						location.pathname === '/home'
							? `${styles['button__navigate']} ${styles['active']}`
							: `${styles['button__navigate']}`
					}
				>
					Главная
				</Link>
				<Link
					to="/history"
					className={
						location.pathname === '/history'
							? `${styles['button__navigate']} ${styles['active']}`
							: `${styles['button__navigate']}`
					}
				>
					Вся история
				</Link>
			</div>
			<div className={styles['user']}>
				<h2>Andrey</h2>
				<span>
					<i class="fa-solid fa-arrow-right-from-bracket"></i>
				</span>
			</div>
		</header>
	);
};
