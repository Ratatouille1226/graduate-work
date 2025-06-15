export const formatDate = (isoString) => {
	const date = new Date(isoString);
	if (isNaN(date)) return 'Неверная дата';

	const pad = (num) => num.toString().padStart(2, '0');

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1); // месяцы с 0
	const day = pad(date.getDate());

	return `${year}-${month}-${day}`;
};
