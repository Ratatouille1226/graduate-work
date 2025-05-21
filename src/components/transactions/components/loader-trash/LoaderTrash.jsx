import spinner from '../../../../assets/spinnerTrash.svg';

export const LoaderTrash = () => {
	return (
		<div>
			<img
				style={{ width: '30px', height: '30px', position: 'absolute', margin: '-6px 0px 0px 34px' }}
				src={spinner}
				alt=""
			/>
		</div>
	);
};
