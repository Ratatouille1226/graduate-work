import { Routes, Route } from 'react-router-dom';
import {
	Incomes,
	History,
	Analytics,
	Expenses,
	Accounts,
	Home,
	Login,
	Register,
	Header,
} from './components/index';

export const App = () => {
	return (
		<div>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/history" element={<History />} />
				<Route path="/incomes" element={<Incomes />} />
				<Route path="/expenses" element={<Expenses />} />
				<Route path="/accounts" element={<Accounts />} />
				<Route path="/analytics" element={<Analytics />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="*" element={<div>Страница не найдена</div>} />
			</Routes>
		</div>
	);
};
