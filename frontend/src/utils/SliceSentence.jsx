//слайс компонент для отображения данных (в каких то местах должно быть ограничение по символам), в конце ставится ..
export const SliceSentence = ({ text, maxLength, prefix = '', suffix = '' }) => {
	const value = String(text);
	const sliced = value.length > maxLength ? value.slice(0, maxLength) + '..' : value;

	return <>{`${prefix} ${sliced}${suffix}`}</>;
};
