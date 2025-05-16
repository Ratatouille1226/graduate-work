import { Routes, Route } from 'react-router-dom';
import { History, Analytics, Accounts, Home, Header, Transactions, AccountPage } from './components/index';
import { Authorization } from './pages/index';

export const App = () => {
	return (
		<div>
			<Header />
			<Routes>
				<Route path="/authorization" element={<Authorization />} />
				<Route path="/" element={<Home />} />
				<Route path="/history" element={<History />} />
				<Route path="/incomes" element={<Transactions type="incomes" />} />
				<Route path="/expenses" element={<Transactions type="expenses" />} />
				<Route path="/accounts" element={<Accounts />} />
				<Route path="/analytics" element={<Analytics />} />
				<Route path="/accountPage/:id" element={<AccountPage />} />
				<Route path="*" element={<div>Ошибка</div>} />
			</Routes>
		</div>
	);
};
