export const setNewComment = (id, text) => ({
	type: 'SET_NEW_COMMENT',
	payload: { id, text },
});
