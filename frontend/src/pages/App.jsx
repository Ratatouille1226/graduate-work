import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { History, Analytics, Accounts, Home, Header, Transactions, AccountPage, ProtectedRoute } from '../components';
import { Registration } from './registration/Registration';
import { NotFound } from './notFound/NotFound';
import { Login } from './login/Login';

export const App = () => {
	const location = useLocation();
	const hideHeader =
		location.pathname === '/login' || location.pathname === '/' || location.pathname === '/registration';

	return (
		<div>
			{!hideHeader && <Header />}
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<Login />} />
				<Route path="/registration" element={<Registration />} />
				<Route
					path="/home"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/history"
					element={
						<ProtectedRoute>
							<History />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/incomes"
					element={
						<ProtectedRoute>
							<Transactions type="incomes" />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/expenses"
					element={
						<ProtectedRoute>
							<Transactions type="expenses" />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/accounts"
					element={
						<ProtectedRoute>
							<Accounts />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/analytics"
					element={
						<ProtectedRoute>
							<Analytics />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/accountPage/:id"
					element={
						<ProtectedRoute>
							<AccountPage />
						</ProtectedRoute>
					}
				/>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};
