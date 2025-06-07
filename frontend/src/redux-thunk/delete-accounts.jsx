import { GetDataFromServer } from '../api/getDataFromServer';

export const deleteAccounts = (id) => async (dispatch) => {
	try {
		await GetDataFromServer().deleteAccounts(id, 'accounts');
	} catch (error) {
		dispatch({ type: 'SET_ERROR', payload: error.message });
	}
};
