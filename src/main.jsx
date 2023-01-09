import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// not using StrictMode during React 18 changes to useEffect
ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
		<App />
	// </React.StrictMode>
);
