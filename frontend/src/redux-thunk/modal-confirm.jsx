// import { GetDataFromServer } from '../api/getDataFromServer';

// const data = GetDataFromServer('incomesExpenses');

// export const modalConfirm = (accountId) => async (dispatch, getState) => {
// 	try {
// 		const state = getState();
// 		const { pendingTransaction } = state.incomesExpenses;

// 		if (!pendingTransaction) return;

// 		// Добавляем новую транзакцию с выбранным счётом
// 		await data.addNewAccounts({
// 			...pendingTransaction,
// 			accountId: Number(accountId),
// 		});

// 		// Получаем текущий баланс счёта
// 		const accountResponse = await data.getDataAccount(accountId);
// 		const updatedBalance = Number(accountResponse.balance) + pendingTransaction.sum;

// 		// Обновляем баланс счёта
// 		await data.editSumAccounts(accountId, updatedBalance);

// 		dispatch({ type: 'SET_PENDING_TRANSACTION', payload: null }); //очищаем
// 	} catch (error) {
// 		console.error(error, 'Ошибка в изменени баланса на счету');
// 	}
// };
