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

- TBD

## Running Tests

TBD

---

## Steps To Creating This Clone, Then Expanding

### Step 1: Auth

Build and return a GET request for a Spotify user's authentication

```javascript
// Login.jsx

const AUTH_URL = `${GET}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
```

### Step 2: The server

Initiate `server` and add in our info regarding Express, Nodemon, and Spotify Web API Node.

```javascript
// server.js

const express = require('express');
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();

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
		.catch(() => {
			res.sendStatus(400);
		});
});
```

---

## Architecture

- `public`
- `server`
  - `server.js`: All info regarding our backend
- `src`
  - `assets`
  - `App.jsx`: Pass through our Login component
  - `Dashboard.jsx`: XXX
  - `Login.jsx`: Where we build and send auth GET requests
  - `main.jsx`
- `index.html`
- `vite.config.js`

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
- [Bootstrap](https://www.npmjs.com/package/bootstrap)
- [React Bootstrap](https://www.npmjs.com/package/react-bootstrap)

Backend

- [Express](https://www.npmjs.com/package/express)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)

---

## Next Steps (my "Icebox")

- Fully adopt Airbnb's JS coding style guide
- Incorporate automated testing

---

## Closing Credits

A special shout-out to Web Dev Simplified's [Spotify clone tutorial](https://flask.palletsprojects.com/en/2.2.x/quickstart/) for introducing the basics of Spotify's API and initial setup of this clone.

---

© 2023 Brady Gerber. All Rights Reserved.
