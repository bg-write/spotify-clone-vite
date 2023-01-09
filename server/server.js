require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-searcher');
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// keep users logged in
app.post('/refresh', (req, res) => {
	const refreshToken = req.body.refreshToken;

	const spotifyApi = new SpotifyWebAPI({
		redirectUri: process.env.REDIRECT_URI,
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

// set up our auth
app.post('/login', (req, res) => {
	const code = req.body.code;

	const spotifyApi = new SpotifyWebAPI({
		redirectUri: process.env.REDIRECT_URI,
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

// loading in lyrics
app.get('/lyrics', async (req, res) => {
	const lyrics =
		(await lyricsFinder(req.query.artist, req.query.track)) || 'No Lyrics Found';
	res.json({ lyrics });
});

app.listen(3001); // make sure 3001 matches our axios calls in "useAuth" and "Dashboard"
