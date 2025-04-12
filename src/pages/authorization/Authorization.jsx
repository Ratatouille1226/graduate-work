import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { server } from '../../bff';

import styles from './auth.module.css';

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

export const Authorization = () => {
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
	const [serverError, setServerError] = useState();

	//Сообщение ошибки
	const formError = errors?.login?.message || errors?.password?.message; //Разделил ошибки чтобы не блокировать кнопку в случае ошибки на сервере а не в форме
	const errorMessage = formError || serverError;

	//Обращаемся к bff, наш локальный сервер)
	const onSubmit = ({ login, password }) => {
		server.authorize(login, password).then(({ error, res }) => {
			if (error) {
				setServerError(`Ошибка сервера: ${error}`);
			}
		});
	};

	return (
		<div className={styles['wrapper']}>
			<div className={styles['registration__block']}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles['form__block']}>
						{' '}
						<input type="text" placeholder="Введите логин" {...register('login')} />
						<input type="password" placeholder="Введите пароль" {...register('password')} />
						<span>Нет аккаунта?</span>
						<span>Зарегистрироваться</span>
						<button type="submit" disabled={!!formError}>
							Войти
						</button>
						{errorMessage && <div>{errorMessage}</div>}
					</div>
				</form>
			</div>
		</div>
	);
};
