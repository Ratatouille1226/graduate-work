import styles from './header.module.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
	const [isButtonActive, setIsButtonActive] = useState(1); //Если равен 1 то класс активности первой кнопке, если 2 то второй

	return (
		<header className={styles['header']}>
			<div className={styles['logo__buttons']}>
				<img src={logo} alt="logo" />
				<Link
					to="/"
					onClick={() => setIsButtonActive(1)}
					className={
						isButtonActive === 1
							? `${styles['button__navigate']} ${styles['active']}`
							: `${styles['button__navigate']}`
					}
				>
					Главная
				</Link>
				<Link
					to="/history"
					onClick={() => setIsButtonActive(2)}
					className={
						isButtonActive === 2
							? `${styles['button__navigate']} ${styles['active']}`
							: `${styles['button__navigate']}`
					}
				>
					Вся история
				</Link>
			</div>
			<div className={styles['user']}>
				<h2>Andrey</h2>
			</div>
		</header>
	);
};
