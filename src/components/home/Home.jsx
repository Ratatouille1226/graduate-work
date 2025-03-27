import { Outlet } from 'react-router-dom';

export const Home = () => {
	return (
		<div>
			<h2>Главная</h2>
			<Outlet />
		</div>
	);
};
