import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccounts } from '../../selectors';
import { fetchAccounts, addNewAccounts } from '../../redux-thunk';
import { deleteAccounts } from '../../redux-thunk/delete-accounts';

import { Loader } from '../loader/Loader';
import { SliceSentence } from '../../utils';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import styles from './accounts.module.css';

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

	const dispatch = useDispatch();
	const { accounts, loading, addLoadingNewAccounts } = useSelector(selectAccounts);
	const [isNewAddAccounts, setIsNewAddAccounts] = useState(true); // Условный рендеринг для формы добавления
	const [refreshAccounts, setRefreshAccounts] = useState(false); // Триггер для обновления счетов после удаления
	// Получение счетов
	useEffect(() => {
		dispatch(fetchAccounts());
	}, [refreshAccounts, dispatch]);

	// Добавление нового счёта
	const onAddAccounts = async (formData) => {
		dispatch(
			addNewAccounts({
				account: formData.accountName, // 💡 берём данные из формы
				balance: formData.balance,
				cashback: formData.cashback,
			}),
		).then(() => {
			setIsNewAddAccounts(true); // Возвращаем блок "Добавить"
			reset();
		}); // Ждём завершения добавления
	};
	//Удаление счёта
	const onDeleteAccount = async (id) => {
		dispatch(deleteAccounts(id));
		setRefreshAccounts((prev) => !prev);
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
									<h2>
										<SliceSentence text={item.account} maxLength={10} />
									</h2>
									<span>
										<SliceSentence
											text={item.balance}
											maxLength={9}
											prefix={'Счет:'}
											suffix={'р'}
										/>
										<Link to={`/accountPage/${item.id}`}>
											<i className={`fa-solid fa-pen-to-square ${styles['edit']}`}></i>
										</Link>
									</span>
									<span>
										<SliceSentence
											text={item.cashback}
											maxLength={9}
											prefix={'Кэшбек:'}
											suffix={'р'}
										/>
									</span>
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
							) : addLoadingNewAccounts ? (
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
