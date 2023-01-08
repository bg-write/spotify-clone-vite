import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Dashboard from './Dashboard';

// the URL we're pulling from a user's login
const code = new URLSearchParams(window.location.search).get('code');

function App() {
	return code ? <Dashboard code={code} /> : <Login />;
}

export default App;
