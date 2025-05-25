import { GetDataFromServer } from '../api/getDataFromServer';

const data = GetDataFromServer('incomesExpenses');

export const deleteComment = (id) => async (dispatch) => {
	await data.editAddComments(id, '');

	dispatch({ type: 'REMOVE_COMMENT', payload: id });
};
