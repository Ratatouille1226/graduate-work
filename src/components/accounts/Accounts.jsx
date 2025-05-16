import { useEffect, useState } from 'react';
import { GetDataFromServer } from '../../api/getDataFromServer';
import { Loader } from '../loader/Loader';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import styles from './accounts.module.css';
import { Link } from 'react-router-dom';

const validationSchema = yup.object().shape({
	accountName: yup
		.string()
		.required('Введите название счёта')
		.matches(/^[а-яё-]+$/i, 'В названии счёта допускаются только буквы а-я и дефис'),
	balance: yup
		.string()
		.required('Заполните сумму на счёте')
		.matches(/^[0-9]+$/, 'Допускаются только цифры'),
	cashback: yup
		.string()
		.required('Заполните сумму на счёте')
		.matches(/^[0-9]+$/, 'Допускаются только цифры'),
});

export const Accounts = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			accountName: '',
			balance: '',
			cashback: '',
		},
		resolver: yupResolver(validationSchema),
	});

	const [accounts, setAccounts] = useState([]); // Тут счета лежат :)
	const [loading, setLoading] = useState(true); // Загрузка всех счетов
	const [isNewAddAccounts, setIsNewAddAccounts] = useState(true); // Условный рендеринг для формы добавления
	const [addLoading, setAddLoading] = useState(false); // Локальный лоадер для формы
	const [refreshAccounts, setRefreshAccounts] = useState(false); // Триггер для обновления счетов после добавления
	const data = GetDataFromServer('accounts');
	// Получение счетов
	useEffect(() => {
		const fetchData = async () => {
			const dataAccounts = await data.getExpensesIncome();
			setAccounts(dataAccounts);
			setLoading(false);
		};
		fetchData();
	}, [refreshAccounts]);

	// Добавление нового счёта
	const onAddAccounts = async (formData) => {
		setAddLoading(true); // Показываем лоадер

		await data.addNewAccounts({
			account: formData.accountName, // 💡 берём имя из формы
			balance: formData.balance,
			cashback: formData.cashback,
		}); // Ждём завершения добавления

		setRefreshAccounts((prev) => !prev); // Обновляем список счетов
		setIsNewAddAccounts(true); // Возвращаем блок "Добавить"
		setAddLoading(false); // Скрываем лоадер
		reset();
	};
	//Удаление счёта
	const onDeleteAccount = async (id) => {
		try {
			await GetDataFromServer().deleteAccounts(id);
			setRefreshAccounts((prev) => !prev);
		} catch (error) {
			console.error('Ошибка удаления задачи:', error);
		}
	};

	//Изменение суммы на счёте
	const onEditSum = (accountsId) => {
		console.log(accountsId);
	};

	//Ошибки валидации
	const formErrorAccount = errors?.accountName?.message;
	const formErrorBalance = errors?.balance?.message;
	const formErrorCashback = errors?.cashback?.message;

	return (
		<div className={styles['container']}>
			<h2>Ваши счета</h2>
			<div className={styles['wrapper']}>
				{loading ? (
					<Loader />
				) : (
					<div className={styles['block']}>
						{accounts.map((item) => (
							<div key={item.id} className={styles['block__accounts']}>
								<div className={styles['accounts']}>
									<h2>{item.account}</h2>
									<span>
										{`На счету: ${item.balance}р`}{' '}
										<Link to={`/accountPage/${item.id}`}>
											<i
												onClick={() => onEditSum(item.id)}
												className={`fa-solid fa-pen-to-square ${styles['edit']}`}
											></i>
										</Link>
									</span>
									<span>{`Кэшбэк: ${item.cashback}р`}</span>
									<span>
										<i className={`fa-solid fa-piggy-bank ${styles['pig']}`}></i>
									</span>
									<button onClick={() => onDeleteAccount(item.id)} className={styles['delete']}>
										Удалить
									</button>
								</div>
							</div>
						))}

						<div
							onClick={() => {
								if (isNewAddAccounts) setIsNewAddAccounts(false);
							}}
							className={styles['add__new-block']}
						>
							{isNewAddAccounts ? (
								<>
									<span>Добавить новый счёт</span>
									<span>
										<i className="fa-regular fa-square-plus"></i>
									</span>
								</>
							) : addLoading ? (
								<Loader /> // Показать лоадер только вместо формы
							) : (
								<form
									onClick={(e) => e.stopPropagation()}
									onSubmit={handleSubmit(onAddAccounts)} // будет вызван ТОЛЬКО если валидация прошла
								>
									<input placeholder="Название счёта" {...register('accountName')} />
									{formErrorAccount && <p className={styles['account__error']}>{formErrorAccount}</p>}
									<input placeholder="Сумма на счету" {...register('balance')} />
									{formErrorBalance && <p className={styles['account__error']}>{formErrorBalance}</p>}
									<input placeholder="Кэшбека на счету" {...register('cashback')} />
									{formErrorCashback && (
										<p className={styles['account__error']}>{formErrorCashback}</p>
									)}
									<button type="submit">Добавить</button>
								</form>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
