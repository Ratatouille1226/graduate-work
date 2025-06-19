import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GetDataFromServer } from '../../api/getDataFromServer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { selectAccounts } from '../../selectors';
import * as yup from 'yup';
import styles from './accountPage.module.css';
import { useDispatch, useSelector } from 'react-redux';

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
	const dispatch = useDispatch();
	const { accounts } = useSelector(selectAccounts);
	const { id } = useParams();
	const navigate = useNavigate();
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

			dispatch({ type: 'SET_ACCOUNTS', payload: data });
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
			{accounts && (
				<>
					<h1>Страница счёта: {accounts.map((item) => item.account)}</h1>
					<h2>На вашем счёте: {accounts.map((item) => item.balance)}</h2>
					<h2>Кэшбека на счету: {accounts.map((item) => item.cashback)}</h2>
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
