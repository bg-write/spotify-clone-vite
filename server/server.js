require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
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
			console.log('SERVER refreshAccessToken ERROR', error);
			res.sendStatus(400);
		});
});

// set up auth
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
			console.log('SERVER authorizationCodeGrant ERROR', error);
			res.sendStatus(400);
		});
});

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
}); // make sure 3001 matches axios in "useAuth"
