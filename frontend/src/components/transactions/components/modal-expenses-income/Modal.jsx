import { useDispatch, useSelector } from 'react-redux';
import styles from './modal.module.css';
import { selectAccounts } from '../../../../selectors';
import { useEffect, useState } from 'react';
import { fetchAccounts } from '../../../../redux-thunk';

export const Modal = ({ onConfirm }) => {
	const dispatch = useDispatch();
	const { accounts } = useSelector(selectAccounts);
	const [selectedAccountId, setSelectedAccountId] = useState('');

	//Загружаем счета если они не загружены, они могут быть не загружены в случае если пользователь не заходил на страницу счетов а открыл модальное окно
	//Подгружаем им здесь тоже чтобы такого не было, если он откроет сначала модалку то они все равно будут загружены
	useEffect(() => {
		if (!accounts || accounts.length === 0) {
			dispatch(fetchAccounts());
		}
	}, [dispatch, accounts]);

	const onHandleConfirm = () => {
		if (selectedAccountId) {
			onConfirm(selectedAccountId);
		}
	};

	return (
		<div className={styles['modal']}>
			<div className={styles['choose']}>
				<h3>На каком счету будет операция?</h3>
				<select value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)}>
					<option value="">Выберите счёт</option>
					{accounts.map(({ account, id }) => (
						<option key={id} value={id}>
							{account}
						</option>
					))}
				</select>
				<button onClick={onHandleConfirm}>Подтвердить</button>
			</div>
		</div>
	);
};
