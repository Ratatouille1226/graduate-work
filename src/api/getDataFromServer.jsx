export const GetDataFromServer = (dataName) => {
	//Получение всех задач
	const getExpensesIncome = async () => {
		try {
			const response = await fetch(`http://localhost:3000/${dataName}`);
			if (!response.ok) throw new Error('Ошибка при получении доходов/расходов');
			return await response.json();
		} catch (error) {
			console.error('Ошибка в getExpensesIncome:', error);
			return null;
		}
	};
	//Создание новой задачи
	const addNewAccounts = async (newData) => {
		try {
			const response = await fetch(`http://localhost:3000/${dataName}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newData),
			});

			if (!response.ok) throw new Error('Ошибка при добавлении счёта');
			return await response.json();
		} catch (error) {
			console.error('Ошибка в addNewAccounts:', error);
			return null;
		}
	};
	//Удаление задач
	const deleteAccounts = async (id) => {
		try {
			const response = await fetch(`http://localhost:3000/accounts/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Ошибка при добавлении счёта');
			return await response.json();
		} catch (error) {
			console.error('Ошибка при удалении счёта', error);
		}
	};

	return { getExpensesIncome, addNewAccounts, deleteAccounts };
};
