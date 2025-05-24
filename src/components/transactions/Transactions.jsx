import { useEffect, useState } from 'react';
import { GetDataFromServer } from '../../api/getDataFromServer';
import * as yup from 'yup';
import styles from './transactions.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SliceSentence } from '../../utils';
import { LIMIT_INCOME_EXPENSES } from '../../constants/limitPaginationExpensesIncome';
import { Pagination } from '../pagination/Pagination';
import { Loader } from '../loader/Loader';
import { LoaderTrash, Modal } from './components';

const validateSchema = yup.object().shape({
	categories: yup
		.string()
		.required('Заполните поле категории')
		.matches(/^[а-яё]+$/i, 'Только русские буквы а-я')
		.max(20, 'Максимум 20 символов'),
	sum: yup
		.string()
		.required('Заполните поле суммы')
		.matches(/^[0-9]+$/, 'Допускаются только цифры'),
	comment: yup.string(),
});

export const Transactions = ({ type }) => {
	const [page, setPage] = useState(1);
	//Проверяем что у нас на странице, расход или доход, получается что можно использовать этот компонент 2 раза
	const isType = type === 'expenses';
	//А тут фильтрум данные для пагинации, чтобы показывать по 5 элементов, без фильтра на стороне сервера данные отрисовываются неправильно
	//Показывает например: 3 дохода и 2 расхода
	const query = isType
		? `?sum_lt=0&_page=${page}&_limit=${LIMIT_INCOME_EXPENSES}`
		: `?sum_gte=0&_page=${page}&_limit=${LIMIT_INCOME_EXPENSES}`;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			categories: '',
		},
		resolver: yupResolver(validateSchema),
	});

	const [incomesExpenses, setIncomesExpenses] = useState([]);
	const [refreshExpenses, setRefreshExpenses] = useState(false);
	const [newComment, setNewComment] = useState({});
	const [editingCommentId, setEditingCommentId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadingTrash, setLoadingTrash] = useState(null);
	const [totalPages, setTotalPages] = useState(1); //Сколько всего страниц пагинации

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [pendingTransaction, setPendingTransaction] = useState(null);

	const data = GetDataFromServer('incomesExpenses');

	useEffect(() => {
		const fetchData = async () => {
			const { data: dataIncomesExpenses, totalCount } = await data.getDataForAccountPagination(query);
			setTotalPages(Math.ceil(totalCount / LIMIT_INCOME_EXPENSES)); //Проверяем сколько будет страниц (округление вверх)
			const filteredData = isType
				? dataIncomesExpenses.filter((item) => item.sum < 0)
				: dataIncomesExpenses.filter((item) => item.sum >= 0);
			setIncomesExpenses(filteredData);
			setLoading(false);
		};
		fetchData();
	}, [refreshExpenses, isType, page]);
	console.log(pendingTransaction);

	// Добавление дохода/расхода
	const onAddExpenses = (formData) => {
		setPendingTransaction({
			categories: formData.categories,
			sum: isType ? -Math.abs(Number(formData.sum)) : Math.abs(Number(formData.sum)),
			date: new Date().toLocaleDateString('ru-RU'),
			comment: formData.comment,
		});
		setIsModalOpen(true);
	};

	const handleModalConfirm = async (accountId) => {
		if (!pendingTransaction) return;

		// Добавляем новую транзакцию с выбранным счётом
		await data.addNewAccounts({
			...pendingTransaction,
			accountId: Number(accountId),
		});

		// Получаем текущий баланс счёта
		const accountResponse = await fetch(`http://localhost:3000/accounts/${accountId}`);
		const account = await accountResponse.json();
		const updatedBalance = Number(account.balance) + pendingTransaction.sum;

		// Обновляем баланс счёта
		await fetch(`http://localhost:3000/accounts/${accountId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ balance: updatedBalance }),
		});

		setIsModalOpen(false);
		setPendingTransaction(null);
		setRefreshExpenses((prev) => !prev);
		reset();
	};

	// Добавление или редактирование комментария
	const onNewComment = async (id) => {
		const comment = newComment[id];
		if (!comment.trim()) return;

		await data.editAddComments(id, comment);
		setEditingCommentId(null);
		setRefreshExpenses((prev) => !prev);
	};
	//Удаление расходов/доходов
	const onRemoveIncomeExpenses = async (id) => {
		setLoadingTrash(id);
		await data.deleteAccounts(id, 'incomesExpenses');
		setRefreshExpenses((prev) => !prev);
		setLoadingTrash(null);
	};
	//Удаление комментария
	const onRemoveComment = async (id) => {
		await data.editAddComments(id, '');
		setEditingCommentId(null);
		setNewComment((prev) => {
			const updated = { ...prev };
			delete updated[id];
			return updated;
		});
		setRefreshExpenses((prev) => !prev);
	};

	const errorCategories = errors?.categories?.message;
	const errorSum = errors?.sum?.message;

	return (
		<div className={styles['container']}>
			{isModalOpen && <Modal onConfirm={handleModalConfirm} />}
			<div className={styles['block']}>
				<div className={styles['header']}>
					<span>Категория</span>
					<span>Сумма</span>
					<span>Дата</span>
				</div>
				<div className={styles['content']}>
					<div className={styles['content__item']}>
						{loading ? (
							<div className={styles['loader']}>
								<Loader />
							</div>
						) : incomesExpenses.length === 0 ? (
							<span className={styles['empty__data']}>Данных нет...</span>
						) : (
							incomesExpenses.map((dataItem) => (
								<div key={dataItem.id} className={styles['expenses']}>
									<div
										className={
											isType ? styles['expenses__data-red'] : styles['expenses__data-green']
										}
									>
										<span>{dataItem.categories}</span>
										<span>{dataItem.sum}</span>
										<span>{dataItem.date}</span>
										{loadingTrash === dataItem.id ? (
											<LoaderTrash />
										) : (
											<span onClick={() => onRemoveIncomeExpenses(dataItem.id)}>
												<i className="fa-solid fa-trash"></i>
											</span>
										)}
									</div>
									<div className={styles['comment']}>
										{editingCommentId === dataItem.id ? (
											<>
												<input
													value={newComment[dataItem.id] || ''}
													onChange={(e) =>
														setNewComment((prev) => ({
															...prev,
															[dataItem.id]: e.target.value,
														}))
													}
												/>
												<button onClick={() => onNewComment(dataItem.id)}>Сохранить</button>
												<button onClick={() => onRemoveComment(dataItem.id)}>Удалить</button>
											</>
										) : dataItem.comment ? (
											<span
												className={styles['comment_name']}
												onClick={() => {
													setEditingCommentId(dataItem.id);
													setNewComment((prev) => ({
														...prev,
														[dataItem.id]: dataItem.comment,
													}));
												}}
											>
												<SliceSentence text={dataItem.comment} maxLength={84} suffix="." />
											</span>
										) : (
											<>
												<input
													value={newComment[dataItem.id] || ''}
													onChange={(e) =>
														setNewComment((prev) => ({
															...prev,
															[dataItem.id]: e.target.value,
														}))
													}
													placeholder="Добавить комментарий"
												/>
												<button onClick={() => onNewComment(dataItem.id)}>Добавить</button>
											</>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>
				<div className={styles['pagination']}>
					<Pagination setPage={setPage} page={page} totalPages={totalPages} />
				</div>
				<div className={styles['button__container']}>
					<form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(onAddExpenses)}>
						<input {...register('categories')} type="text" placeholder="Название категории" />
						{errorCategories && <span className={styles['errorCat']}>{errorCategories}</span>}
						<input {...register('sum')} type="text" placeholder="Сумма" />
						{errorSum && <span className={styles['errorSum']}>{errorSum}</span>}
						<input {...register('comment')} type="text" placeholder="Комментарий. Необязательно" />
						<button type="submit">Добавить</button>
					</form>
				</div>
			</div>
		</div>
	);
};
