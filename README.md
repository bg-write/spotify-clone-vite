# Zen Spotify: A minimalist full-stack rebuild of Spotify with a focus on album art - built with React and Spotify's API by Brady Gerber

[![GitHub issues](https://img.shields.io/github/issues/bg-write/spotify-clone-vite?style=flat-square)](https://github.com/bg-write/spotify-clone-vite/issues)

![Spotify clone login page](https://doodleipsum.com/700?bg=63C8D9&i=4dd5fd75c6118b7161fca2ffd991842a)

## The Problem

I love Spotify and wanted to become more familiar with its API. I also use the Spotify desktop app, which includes a lot of extra features that are nice to have but I don't always need while listening to music.

## The Solution

Build my own Spotify!

## The Goal

To deploy Zen Spotify and further flesh out its styling to make it my new go-to music player. I also want to learn more about Spotify's API by adding and testing out new features available to me.

---

## Getting Started (On Your Local Machine)

Frontend

- In your IDE, in an open terminal window, enter and run `npm run dev` and open the server URL provided in the terminal output.

Backend

- In another open terminal, CD into `server` and run `npm run devStart`.

---

## Steps To Building This Spotify Clone

### Step 1: Auth

Build and return a GET request for a Spotify user's authentication via the `Login` component.

```javascript
// Login.jsx

const AUTH_URL = `${GET}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
```

### Step 2: Server

Initiate `server` with all our needed middleware and server info, including where we start using Spotify Web API Node. We also add our new server script to its own `package.json`.

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

Create a `Dashboard` component that renders our `Login` depending on if a user has gone through auth or not.

```javascript
// App.jsx

const code = new URLSearchParams(window.location.search).get('code');

function App() {
	return code ? <Dashboard code={code} /> : <Login />;
}
```

Then create a custom hook (`useAuth`) to move the auth process away from the browser into our state and `Dashboard` while also incorporating our new server.

(WINTER 2023 NOTE: The React 18 update now runs useEffect twice instead of once; while we wait for a future React update, I've updated `main.jsx` to disable "StrictMode.")

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

### Step 4: Refresh Tokens Automatically

Update `useAuth` and `server` so that users don't have to keep logging in after each hour.

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

### Step 5: Search Functionality

Update `Dashboard` with more useEffects, including our Spotify search query that we'll then map and pass along to our new `TrackSearchResult` component.

```javascript
// Dashboard.jsx

// update Spotify when our access token updates
useEffect(() => {
	if (!accessToken) return;
	spotifyApi.setAccessToken(accessToken);
}, [accessToken]);

// spotify search query
useEffect(() => {
	if (!search) return setSearchResults([]);
	if (!accessToken) return;
	let cancel = false;

	spotifyApi
		.searchTracks(search)
		.then((res) => {
			if (cancel) return;
			setSearchResults(
				res.body.tracks.items.map((track) => {
					const smallestAlbumImage = track.album.images.reduce(
						(smallest, image) => {
							if (image.height < smallest.height) return image;
							return smallest;
						},
						track.album.images[0]
					);
					return {
						artist: track.artists[0].name,
						title: track.name,
						uri: track.uri,
						albumUrl: smallestAlbumImage.url,
					};
				})
			);
		})

		.catch((error) => {
			console.log('Search ERROR', error);
		});

	return () => (cancel = true);
}, [search, accessToken]);

```

```javascript
// TrackSearchResult.jsx

export default function TrackSearchResult({ track }) {
	function handlePlay() {
		// chooseTrack(track);
		console.log('clicked!');
	}

	return (
		<div
			className="d-flex m-2 align-items-center"
			style={{ cursor: 'pointer' }}
			onClick={handlePlay}>
			<img src={track.albumUrl} style={{ height: '64px', width: '64px' }} />
			<div className="ml-3">
				<div>{track.title}</div>
				<div className="text-muted">{track.artist}</div>
			</div>
		</div>
	);
}
```

### Step 6: Actually Play Music

Create the `Player` component and add in the React Spotify Web Playback package to give us functionality to actually play specific songs. Update `Dashboard` and `TrackSearchResult` accordingly.

```javascript
// Player.jsx

export default function Player({ accessToken, trackUri }) {
	const [play, setPlay] = useState(false);

	useEffect(() => setPlay(true), [trackUri]);

	if (!accessToken) return null;
	return (
		<SpotifyPlayer
			token={accessToken}
			showSaveIcon
			callback={(state) => {
				if (!state.isPlaying) setPlay(false);
			}}
			play={play}
			uris={trackUri ? [trackUri] : []}
		/>
	);
}
```

```javascript
// Dashboard.jsx

const [playingTrack, setPlayingTrack] = useState();

function chooseTrack(track) {
	setPlayingTrack(track);
	setSearch('');
}

...

<div>
	<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
</div>
```

```javascript
// TrackSearchResult.jsx

export default function TrackSearchResult({ track, chooseTrack }) {
	function handlePlay() {
		chooseTrack(track);
	}

	return (
		<div
			className="d-flex m-2 align-items-center"
			style={{ cursor: 'pointer' }}
			onClick={handlePlay}>
			<img src={track.albumUrl} style={{ height: '64px', width: '64px' }} />
			<div className="ml-3">
				<div>{track.title}</div>
				<div className="text-muted">{track.artist}</div>
			</div>
		</div>
	);
}
```

### Step 7: Display The Album Artwork Of Current Song

Take advantage of our "playingTrack" state and store it into a simple ternary variable we'll display in `Dashboard`.

```javascript
// Dashboard.jsx

let albumArtwork = playingTrack
	? playingTrack.albumUrl
	: 'https://picsum.photos/500';
```

---

## Code Architecture

- `server`
  - `server.js`: All info for backend and middleware
- `src`
  - `assets`: Home to the Spotify logo images
  - `components`
    - `Dashboard.jsx`: What we see after logging in
    - `Login.jsx`: Build/send auth GET request
    - `Player.jsx`: Spotify player functionality
    - `TrackSearchResult`: Results seen in Dashboard
    - `useAuth.jsx`: Our custom hooks
  - `App.jsx`: Pass through our Dashboard and Login
  - `main.jsx`: "StrictMode" disabled (i.e. React18 useEffect)
- `index.html`: Our HTML with basic meta information

---

## Style Guide

### CSS

Using Bootstrap (imported in `App.jsx`) and Rect Bootstrap.

### The Code Itself

Zen Spotify will soon be updated to match [Airbnb's JS style guide](https://airbnb.io/javascript/) as closely as possible. This involves following [Nethmi Wijesinghe's excellent set-up guide](https://enlear.academy/how-to-set-up-airbnb-style-guide-82413ea6c5f2) for updating ESLint and Prettier to follow Airbnb's guide. Nethmi's guide also works if you wish to use another popular style guide (i.e. Google).

---

## Tech Stack, Tools & Resources

Overall

- [Spotify for Developers](https://developer.spotify.com/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/reference/#/)
- [Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)

Frontend

- React via [Vite](https://vitejs.dev/)
- [Axios](https://www.npmjs.com/package/axios#installing)
- [Bootstrap](https://www.npmjs.com/package/bootstrap)
- [React Bootstrap](https://www.npmjs.com/package/react-bootstrap)
- [React Spotify Web Playback](https://www.npmjs.com/package/react-spotify-web-playback)

Backend

- [Express](https://www.npmjs.com/package/express)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Cors](https://www.npmjs.com/package/cors)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [Dotenv](https://www.npmjs.com/package/dotenv)

---

## Next Steps (my "Icebox")

- Follow WDS and previous repo for new fixes (especially `Dashboard` and `Login` and `Player`) and add an actual style sheet
- Need to make images look better when enlarged on `Dashboard` and update and use `assets` images and `public` favicon
- Incorporate automated testing
- Flesh out the footer in `Dashboard` and `Login`
- Fully adopt Airbnb's JS coding style guide while also cleaning up and enforcing code spacing in GitHub
- Run lighthouse reports to get a snapshot of current accessibility
- Simplify `Dashboard` - there's a lot of code that can likely break down into smaller components
- Create a 404 page
- Anything I can include from my own "I Love That Song" project?
- Reutilize React's StrictMode and update `useAuth` to account for useEffect() firing twice due to React18 update

---

## Closing Credits

A special shout-out to Web Dev Simplified's [Spotify clone tutorial](https://flask.palletsprojects.com/en/2.2.x/quickstart/) for introducing the basics of Spotify's API and the initial setup of this clone. Image by [Doodle Ipsum](https://doodleipsum.com/)

© 2023 Brady Gerber. All Rights Reserved.
