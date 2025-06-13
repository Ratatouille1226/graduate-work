import styles from './header.module.css';
import logo from '../../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

export const Header = () => {
	const location = useLocation(); //для того чтобы отображать класс активности только когда мы находимся на этой странице
	const navigate = useNavigate();
	const [username, setUsername] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const payload = token.split('.')[1];
				const decoded = JSON.parse(atob(payload));
				setUsername(decoded.login); // поле login в JWT
			} catch (e) {
				console.error('Ошибка при расшифровке токена:', e);
			}
		}
	}, []);

	const logout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

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
				<h2>{username}</h2>
				<span>
					<i onClick={logout} className="fa-solid fa-arrow-right-from-bracket"></i>
				</span>
			</div>
		</header>
	);
};
