import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GetDataFromServer } from '../../api/getDataFromServer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './accountPage.module.css';

const validationSchema = yup.object().shape({
	sum: yup
		.string()
		.required('Заполните поле')
		.matches(/^[0-9]+$/, 'Допускаются только цифры'),
	cashback: yup
		.string()
		.required('Заполните поле')
		.matches(/^[0-9]+$/, 'Допускаются только цифры'),
});

export const AccountPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [account, setAccount] = useState([]);
	const response = GetDataFromServer();

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			sum: '',
		},
		resolver: yupResolver(validationSchema),
	});

	useEffect(() => {
		const fetchData = async () => {
			const data = await response.getDataAccount(id);
			setAccount(data);
		};
		fetchData();
	}, []);

	const onEditSum = (dataInput) => {
		response.editSumAccounts(id, dataInput.sum, dataInput.cashback);
		navigate('/accounts');
		reset();
	};

	const errorInputSum = errors?.sum?.message;
	const errorInputCashback = errors?.cashback?.message;

	return (
		<div className={styles['wrapper']}>
			{account && (
				<>
					<h1>Страница счёта {account.account}</h1>
					<h2>На вашем счёте: {account.balance}</h2>
					<h2>Кэшбека на счету: {account.cashback}</h2>
					<form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(onEditSum)}>
						<input type="text" {...register('sum')} placeholder="Изменить баланс" />
						{errorInputSum && <span>{errorInputSum}</span>}
						<input {...register('cashback')} type="text" placeholder="Изменить кэшбек" />
						{errorInputCashback && <span>{errorInputCashback}</span>}
						<button type="submit">Сохранить</button>
						<Link to={'/accounts'}>Назад</Link>
					</form>
				</>
			)}
		</div>
	);
};
