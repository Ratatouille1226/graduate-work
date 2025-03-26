import { getUsers } from './get-users';

export const findUser = async (loginToFind) => {
	const users = await getUsers();

	return users.find(({ login }) => login === loginToFind); //Ищем совпадение логина пользователя
};
