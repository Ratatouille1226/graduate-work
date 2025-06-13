import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Введите логин.')
		.matches(/^\w+$/, 'Неверно заполнен логин, допускаются буквы и цифры.')
		.min(3, 'Неверно заполнен логин, минимум 3 символа.')
		.max(20, 'Неверно заполнен логин, максимум 20 символов.'),
	password: yup
		.string()
		.required('Введите пароль.')
		.matches(/[\w_-]+$/, 'Неверно заполнен пароль, допускаются буквы, цифры и знаки: _ -')
		.min(6, 'Пароль должен содержать минимум 6 символов.')
		.max(20, 'Пароль должен содержать максимум 20 символов.'),
});

export const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});
	const navigate = useNavigate();

	//Сообщение ошибки
	const formError = errors?.login?.message || errors?.password?.message; //Разделил ошибки чтобы не блокировать кнопку в случае ошибки на сервере а не в форме
	const [isTrueUserPassword, setIsTrueUserPassword] = useState('');

	const onSubmit = async (data) => {
		try {
			const response = await fetch('http://localhost:5000/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (!response.ok) throw new Error(result.message || 'Ошибка входа');

			localStorage.setItem('token', result.token);
			setIsTrueUserPassword('');
			navigate('/home');
		} catch (e) {
			setIsTrueUserPassword(`${e.message}`);
		}
	};

	return (
		<div className={styles['wrapper']}>
			<div className={styles['registration__block']}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles['form__block']}>
						<h2>Войдите в аккаунт</h2>{' '}
						<input type="text" placeholder="Введите логин" {...register('login')} />
						<input type="password" placeholder="Введите пароль" {...register('password')} />
						<span className="span">Нет аккаунта?</span>
						<Link to="/registration">Зарегистрироваться</Link>
						<button type="submit" disabled={!!formError}>
							Войти
						</button>
						{formError && <div className={styles['error']}>{formError}</div>}
						{isTrueUserPassword && <div className={styles['error']}>{isTrueUserPassword}</div>}
					</div>
				</form>
			</div>
		</div>
	);
};
