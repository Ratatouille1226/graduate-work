import { findUser } from './find-user';
import { addUser } from './add-user';

export const server = {
	async authorize(authLogin, authPassword) {
		//Получение пользователей по логину
		const user = await findUser(authLogin);
		//Возвращаем ошибки если логин и/или пароль не совпадают
		if (!user) {
			return {
				error: 'Такой пользователь не найден',
			};
		}

		if (authPassword !== user.password) {
			return {
				error: 'Пароль не совпадает',
			};
		}

		return {
			error: null,
		};
	},

	async register(regLogin, regPassword) {
		//Получение пользователей по логину
		const user = await findUser(regLogin);
		//Возвращаем ошибки если логин занят
		if (user) {
			return {
				error: 'Такой логин уже занят',
			};
		}
		//Создание пользователя (добавления в базу данных)
		await addUser(regLogin, regPassword);

		return {
			error: null,
		};
	},
};
