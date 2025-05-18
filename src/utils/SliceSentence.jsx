export const SliceSentence = ({ text, maxLength, prefix = '', suffix = '' }) => {
	const value = String(text);
	const sliced = value.length > maxLength ? value.slice(0, maxLength) + '..' : value;

	return <>{`${prefix} ${sliced}${suffix}`}</>;
};
