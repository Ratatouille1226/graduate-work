import { Routes, Route } from 'react-router-dom';
import { History, Analytics, Accounts, Home, Header, Transactions, AccountPage } from '../components';
import { Registration } from './registration/Registration';
import { NotFound } from './notFound/NotFound';
import { Login } from './login/Login';

export const App = () => {
	return (
		<div>
			<Header />
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/registration" element={<Registration />} />
				<Route path="/" element={<Home />} />
				<Route path="/history" element={<History />} />
				<Route path="/incomes" element={<Transactions type="incomes" />} />
				<Route path="/expenses" element={<Transactions type="expenses" />} />
				<Route path="/accounts" element={<Accounts />} />
				<Route path="/analytics" element={<Analytics />} />
				<Route path="/accountPage/:id" element={<AccountPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};
