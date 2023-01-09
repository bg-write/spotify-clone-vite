require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const REDIRECT_URI = 'http://localhost:5173/';

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

app.listen(3001); // make sure 3001 matches our axios call in "useAuth.jsx"
