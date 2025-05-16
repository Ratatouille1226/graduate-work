import { useEffect, useState } from 'react';
import { GetDataFromServer } from '../../api/getDataFromServer';
import { useParams } from 'react-router-dom';
import styles from './accountPage.module.css';

export const AccountPage = () => {
	const [account, setAccount] = useState([]);
	const { id } = useParams();
	const response = GetDataFromServer();

	useEffect(() => {
		const fetchData = async () => {
			const data = await response.getDataAccount(id);
			setAccount(data);
		};
		fetchData();
	}, []);

	return (
		<div className={styles['wrapper']}>
			{account && (
				<>
					<h1>Страница счёта {account.account}</h1>
					<h2>На вашем счёте: {account.balance}</h2>
					<h2>Кэшбека на счету: {account.cashback}</h2>
					<input type="text" placeholder="Изменить сумму" />
					<input type="text" placeholder="Изменить кэшбек" />
					<button>Сохранить</button>
				</>
			)}
		</div>
	);
};
