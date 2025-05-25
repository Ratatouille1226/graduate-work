import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { App } from './pages/App.jsx';
import { Provider } from 'react-redux';
import { store } from './store.jsx';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Provider store={store}>
			<StrictMode>
				<App />
			</StrictMode>
		</Provider>
	</BrowserRouter>,
);
