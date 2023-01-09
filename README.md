# Spotify Clone Vite: A minimalist full-stack rebuild of Spotify with a lyric generator - built with React and Spotify's API by Brady Gerber

[![GitHub issues](https://img.shields.io/github/issues/bg-write/spotify-clone-vite?style=flat-square)](https://github.com/bg-write/spotify-clone-vite/issues)

![Spotify clone login page](https://doodleipsum.com/700?bg=D96363&i=2950d197771be2105d7d9a91975907bc)

## The Problem

TBD

## The Solution

TBD

## The Goal

TBD

---

## Getting Started (On Your Local Machine)

Frontend

- In your IDE of choice, in an open terminal window, enter and run `npm run dev` and open the server URL provided in the terminal output.

Backend

- In another open terminal, CD into `server` and run `npm run devStart`.

## Running Tests

TBD

---

## Steps To Building This Clone

### Step 1: Auth

Build and return a GET request for a Spotify user's authentication via the `Login` component.

```javascript
// Login.jsx

const AUTH_URL = `${GET}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
```

### Step 2: The server

Initiate `server` with all our needed middleware and server information, including where we start using Spotify Web API Node). We also add our new server script to its own `package.json`).

```javascript
// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const REDIRECT_URI = 'XXX';

app.post('/login', (req, res) => {
	const code = req.body.code;

	const spotifyApi = new SpotifyWebAPI({
		redirectUri: REDIRECT_URI,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	});

	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expires_in,
			});
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(400);
		});
});

app.listen(3001);
```

### Step 3: "useAuth" Hook

Create a `Dashboard` component rendering our `Login` component depending on if a user has gone through auth or not.

```javascript
// App.jsx

const code = new URLSearchParams(window.location.search).get('code');

function App() {
	return code ? <Dashboard code={code} /> : <Login />;
}
```

Then create a custom hook (`useAuth`) to move the auth process away from the browser into our state and `Dashboard` while also incorporating our new server.

(WINTER 2023 NOTE: The React 18 update now runs useEffect twice instead of once; while we wait for a future React update, I've updated `main.jsx`) to disable "StrictMode.")

```javascript
// useAuth.jsx

export default function useAuth(code) {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();

	useEffect(() => {
		console.log('mounting ...');

		axios
			.post('XXX/login', {
				code,
			})
			.then((res) => {
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
				console.log(res.data);
				window.history.pushState({}, null, '/');
			})
			.catch(() => {
				window.location = '/';
			});

		return () => {
			console.log('unmounting ...');
		};
	}, [code]);

	return accessToken;
}
```

```javascript
// Dashboard.jsx

export default function Dashboard({ code }) {
	const accessToken = useAuth(code);
	return <div>{code}</div>;
}
```

### Step 4: Refresh Token Automatically

Update our auth so that users don't have to keep logging in after each hour. We do this by adding XXX to `useAuth` and XXX to our `server`.

```javascript
// useAuth.jsx

useEffect(() => {
		console.log('mounting ...');
		if (!refreshToken || !expiresIn) return;

		const interval = setInterval(() => {
			axios
				.post('XXX/refresh', {
					refreshToken,
				})
				.then((res) => {
					setAccessToken(res.data.accessToken);
					setExpiresIn(res.data.expiresIn);
				})
				.catch(() => {
					window.location = '/';
				});
		}, (expiresIn - 60) * 1000);

		return () => {
			console.log('unmounting ...');
			clearInterval(interval);
		};
	}, [refreshToken, expiresIn]);
```

```javascript
// server.js

app.post('/refresh', (req, res) => {
	const refreshToken = req.body.refreshToken;

	const spotifyApi = new SpotifyWebAPI({
		redirectUri: REDIRECT_URI,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken,
	});

	spotifyApi
		.refreshAccessToken()
		.then((data) => {
			res.json({
				accessToken: data.body.accessToken,
				expiresIn: data.body.expiresIn,
			});
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(400);
		});
});
```

### Step 5: Adding Search Functionality

TBD

```javascript
//


```

---

## Public Architecture

- `public`
- `server`
  - `server.js`: All info regarding our backend and middleware
- `src`
  - `assets`
  - `App.jsx`: Pass through our components
  - `Dashboard.jsx`: What users see after logging in
  - `Login.jsx`: Where we build and send our auth GET request
  - `main.jsx`: We disable "StrictMode" until a future React update addresses useEffect running twice
  - `useAuth.jsx`: Stores all our custom hooks
- `index.html`: Our HTML include basic meta information

---

## Style Guide

### CSS

Using Bootstrap, imported in `App.jsx`, and Rect Bootstrap.

### The Code Itself

Style Guide notes TBD

### Accessibility

Lighthouse Reports TBD

---

## Tech Stack, Tools & Resources

Frontend

- React via [Vite](https://vitejs.dev/)
- [Spotify for Developers](https://developer.spotify.com/)
- [Axios](https://www.npmjs.com/package/axios#installing)
- [Bootstrap](https://www.npmjs.com/package/bootstrap)
- [React Bootstrap](https://www.npmjs.com/package/react-bootstrap)

Backend

- [Express](https://www.npmjs.com/package/express)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Cors](https://www.npmjs.com/package/cors)
- [Body parser](https://www.npmjs.com/package/body-parser)

---

## Next Steps (my "Icebox")

- Follow WDS repo for new server fixes
- Fully adopt Airbnb's JS coding style guide while also cleaning up and enforcing code spacing in GitHub
- Incorporate automated testing
- Reutilize React's StrictMode and update `useAuth.jsx` to account for useEffect() firing twice

---

## Closing Credits

A special shout-out to Web Dev Simplified's [Spotify clone tutorial](https://flask.palletsprojects.com/en/2.2.x/quickstart/) for introducing the basics of Spotify's API and initial setup of this clone.

---

© 2023 Brady Gerber. All Rights Reserved.
