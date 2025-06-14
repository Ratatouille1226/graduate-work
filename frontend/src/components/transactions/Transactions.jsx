import { useEffect, useState } from 'react';
import { GetDataFromServer } from '../../api/getDataFromServer';
import * as yup from 'yup';
import styles from './transactions.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SliceSentence } from '../../utils';
// import { Pagination } from '../pagination/Pagination';
import { Loader } from '../loader/Loader';
import { LoaderTrash, Modal } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { selectTransactions } from '../../selectors';
import { addEditComment, deleteComment, fetchTransactions } from '../../redux-thunk';
import { addExpensesIncome, setNewComment } from '../../actions';
// import { modalConfirm } from '../../redux-thunk/modal-confirm';

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

//Универсальный компонент, использую его в доходах и расходах, благодаря пропсу type в который передаётся income и expenses
export const Transactions = ({ type }) => {
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const { loading, incomesExpenses, totalPages, newComment } = useSelector(selectTransactions);

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

	const [editingCommentId, setEditingCommentId] = useState(null);
	const [loadingTrash, setLoadingTrash] = useState(null);
	// const [isModalOpen, setIsModalOpen] = useState(false);

	const data = GetDataFromServer('incomesExpenses');

	useEffect(() => {
		dispatch(fetchTransactions(type, page, 4));
	}, [page, dispatch, type]);

	// Добавление дохода/расхода
	const onAddExpensesIncome = (formData) => {
		dispatch(addExpensesIncome(formData, type, page));
		// setIsModalOpen(true);
		reset();
	};
	//Выбор на каком счету будет операция
	// const handleModalConfirm = async (accountId) => {
	// 	dispatch(modalConfirm(accountId));
	// 	setIsModalOpen(false);
	// 	reset();
	// 	dispatch(fetchTransactions(type, page)); // Перезагружаем данные и в других методах также
	// };

	// Добавление или редактирование комментария
	const onNewComment = async (_id) => {
		dispatch(addEditComment(_id, newComment));
		setEditingCommentId(null);
		dispatch(fetchTransactions(type, page));
	};
	//Удаление расходов/доходов
	const onRemoveIncomeExpenses = async (_id) => {
		setLoadingTrash(_id);
		await data.deleteAccounts(_id, 'incomesExpenses');
		setLoadingTrash(null);
		dispatch(fetchTransactions(type, page));
	};
	//Удаление комментария
	const onRemoveComment = async (_id) => {
		setEditingCommentId(null);
		dispatch(deleteComment(_id));
		dispatch(fetchTransactions(type, page));
	};

	const handlePrev = () => {
		if (page > 1) setPage((prev) => prev - 1);
	};

	const handleNext = () => {
		if (page < totalPages) setPage((prev) => prev + 1);
	};

	const errorCategories = errors?.categories?.message;
	const errorSum = errors?.sum?.message;

	return (
		<div className={styles['container']}>
			{/* {isModalOpen && <Modal onConfirm={handleModalConfirm} />} */}
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
								<div key={dataItem._id} className={styles['expenses']}>
									<div
										className={
											type === 'expenses'
												? styles['expenses__data-red']
												: styles['expenses__data-green']
										}
									>
										<span>{dataItem.categories}</span>
										<span>{dataItem.sum}</span>
										<span>{dataItem.date}</span>
										{loadingTrash === dataItem._id ? (
											<LoaderTrash />
										) : (
											<span onClick={() => onRemoveIncomeExpenses(dataItem._id)}>
												<i className="fa-solid fa-trash"></i>
											</span>
										)}
									</div>
									<div className={styles['comment']}>
										{editingCommentId === dataItem._id ? (
											<>
												<input
													value={newComment[dataItem._id] || ''}
													onChange={(e) =>
														dispatch(setNewComment(dataItem._id, e.target.value))
													}
												/>
												<button onClick={() => onNewComment(dataItem._id)}>Сохранить</button>
												<button onClick={() => onRemoveComment(dataItem._id)}>Удалить</button>
											</>
										) : dataItem.comment ? (
											<span
												className={styles['comment_name']}
												onClick={() => {
													setEditingCommentId(dataItem._id);
													dispatch(setNewComment(dataItem._id, dataItem.comment || ''));
												}}
											>
												<SliceSentence text={dataItem.comment} maxLength={84} suffix="." />
											</span>
										) : (
											<>
												<input
													value={newComment[dataItem._id] || ''}
													onChange={(e) =>
														dispatch(setNewComment(dataItem._id, e.target.value))
													}
													placeholder="Добавить комментарий"
												/>
												<button onClick={() => onNewComment(dataItem._id)}>Добавить</button>
											</>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>
				<div className={styles['pagination']}>
					<button onClick={handlePrev} disabled={page === 1}>
						Назад
					</button>
					<span>
						{' '}
						Страница {page} из {totalPages}{' '}
					</span>
					<button onClick={handleNext} disabled={page === totalPages}>
						Вперёд
					</button>
				</div>
				<div className={styles['button__container']}>
					<form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(onAddExpensesIncome)}>
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
