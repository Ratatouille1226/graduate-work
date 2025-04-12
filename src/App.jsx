import { Routes, Route } from 'react-router-dom';
import { Incomes, History, Analytics, Expenses, Accounts, Home, Header } from './components/index';
import { Authorization } from './pages/index';

export const App = () => {
	return (
		<div>
			<Header />
			<Routes>
				<Route path="/authorization" element={<Authorization />} />
				<Route path="/" element={<Home />} />
				<Route path="/history" element={<History />} />
				<Route path="/incomes" element={<Incomes />} />
				<Route path="/expenses" element={<Expenses />} />
				<Route path="/accounts" element={<Accounts />} />
				<Route path="/analytics" element={<Analytics />} />
				<Route path="*" element={<div>Ошибка</div>} />
			</Routes>
		</div>
	);
};
