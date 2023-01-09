import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// the auth part of URL we're pulling from a user's login
const code = new URLSearchParams(window.location.search).get('code');

function App() {
	return code ? <Dashboard code={code} /> : <Login />;
}

export default App;
