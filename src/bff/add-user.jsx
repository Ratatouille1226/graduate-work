export const addUser = (regLogin, regPassword) => {
	fetch('http://localhost:3000/users', {
		method: 'POST',
		headers: { 'Content-type': 'application/json;charset=utf-8' },
		body: JSON.stringify({
			login: regLogin,
			password: regPassword,
			registed_at: new Date().toISOString().substring(0, 16).replace('T', ' '),
		}),
	});
};
