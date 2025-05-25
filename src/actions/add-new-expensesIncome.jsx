export const addExpensesIncome = (formData, type) => (dispatch) => {
	dispatch({
		type: 'SET_PENDING_TRANSACTION',
		payload: {
			categories: formData.categories,
			sum: type === 'expenses' ? -Math.abs(Number(formData.sum)) : Math.abs(Number(formData.sum)),
			date: new Date().toLocaleDateString('ru-RU'),
			comment: formData.comment,
		},
	});
};
