export const GetDataFromServer = () => {
	const getExpensesIncome = async () => {
		try {
			const response = await fetch('http://localhost:3000/incomesExpenses');
			if (!response.ok) throw new Error('Ошибка при получении доходов/расходов');
			return await response.json();
		} catch (error) {
			console.error('Ошибка в getExpensesIncome:', error);
			return null;
		}
	};
	return { getExpensesIncome };
};
