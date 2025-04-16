import { useEffect, useState } from 'react';
import { GetDataFromServer } from '../../api/getDataFromServer';
import { Loader } from '../loader/Loader';
import styles from './accounts.module.css';

export const Accounts = () => {
	const [accounts, setAccounts] = useState([]); // Тут счета лежат :)
	const [loading, setLoading] = useState(true); // Загрузка всех счетов
	const [isNewAddAccounts, setIsNewAddAccounts] = useState(true); // Условный рендеринг для формы добавления
	const [addLoading, setAddLoading] = useState(false); // Локальный лоадер для формы
	const [newBalanceCashback, setNewBalanceCashback] = useState({ account: '', balance: '', cashback: '' });
	const [refreshAccounts, setRefreshAccounts] = useState(false); // Триггер для обновления счетов после добавления
	const [idDelete, setIdDelete] = useState(null);

	// Получение счетов
	useEffect(() => {
		const fetchData = async () => {
			const data = GetDataFromServer('accounts');
			const dataAccounts = await data.getExpensesIncome();
			setAccounts(dataAccounts);
			setLoading(false);
		};
		fetchData();
	}, [refreshAccounts]);

	// Добавление нового счёта
	const onAddAccounts = async () => {
		setAddLoading(true); // Показываем лоадер

		const data = GetDataFromServer('accounts');
		await data.addNewAccounts(newBalanceCashback); // Ждём завершения добавления

		setRefreshAccounts((prev) => !prev); // Обновляем список счетов
		setIsNewAddAccounts(true); // Возвращаем блок "Добавить"
		setAddLoading(false); // Скрываем лоадер
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
										<i className={`fa-solid fa-pen-to-square ${styles['edit']}`}></i>
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
									onSubmit={(e) => {
										e.preventDefault();
										onAddAccounts();
									}}
								>
									<input
										placeholder="Название счёта"
										onChange={({ target }) =>
											setNewBalanceCashback((obj) => ({ ...obj, account: target.value }))
										}
									/>
									<input
										placeholder="Сумма на счету"
										onChange={({ target }) =>
											setNewBalanceCashback((obj) => ({ ...obj, balance: target.value }))
										}
									/>
									<input
										placeholder="Кэшбека на счету"
										onChange={({ target }) =>
											setNewBalanceCashback((obj) => ({ ...obj, cashback: target.value }))
										}
									/>
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
