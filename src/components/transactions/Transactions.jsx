import { useEffect, useState } from 'react';
import { GetDataFromServer } from '../../api/getDataFromServer';
import * as yup from 'yup';
import styles from './transactions.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
	//Проверяем что у нас на странице, расход или доход, получается что можно использовать этот компонент 2 раза
	const isType = type === 'expenses';

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
	const data = GetDataFromServer('incomesExpenses');

	useEffect(() => {
		const fetchData = async () => {
			const dataIncomesExpenses = await data.getExpensesIncome();
			setIncomesExpenses(dataIncomesExpenses.filter((item) => (isType ? item.sum < 0 : item.sum > 0)));
		};
		fetchData();
	}, [refreshExpenses, isType]);

	// Добавление дохода/расхода
	const onAddExpenses = (formData) => {
		data.addNewAccounts({
			categories: formData.categories,
			sum: isType ? -Math.abs(Number(formData.sum)) : Math.abs(Number(formData.sum)),
			date: new Date().toLocaleDateString('ru-RU'),
			comment: formData.comment,
		});
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

	const errorCategories = errors?.categories?.message;
	const errorSum = errors?.sum?.message;

	return (
		<div className={styles['container']}>
			<div className={styles['block']}>
				<div className={styles['header']}>
					<span>Категория</span>
					<span>Сумма</span>
					<span>Дата</span>
				</div>
				<div className={styles['content']}>
					<div className={styles['content__item']}>
						{incomesExpenses.map((dataItem) => (
							<div key={dataItem.id} className={styles['expenses']}>
								<div className={isType ? styles['expenses__data-red'] : styles['expenses__data-green']}>
									<span>{dataItem.categories}</span>
									<span>{dataItem.sum}</span>
									<span>{dataItem.date}</span>
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
											{dataItem.comment}
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
						))}
					</div>
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
