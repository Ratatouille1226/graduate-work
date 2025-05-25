import { GetDataFromServer } from '../api/getDataFromServer';

const data = GetDataFromServer('incomesExpenses');

export const addEditComment = (id, newComment) => async (dispatch) => {
	try {
		const comment = newComment[id];
		if (!comment.trim()) return;

		const newCommentChange = await data.editAddComments(id, comment);
		dispatch({ type: 'ADD_EDIT_COMMENT', payload: newCommentChange });
	} catch (error) {
		dispatch({ type: 'SET_ERROR', payload: error.message });
	}
};
