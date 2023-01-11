/*
see "request user authorization" section of Spotify docs:
https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
*/

import { Container } from 'react-bootstrap';
import spotifyIconBlack from '../assets/Spotify_Icon_RGB_Black.png';

const GET = 'https://accounts.spotify.com/authorize';
const CLIENT_ID = '825aa066f2c24b53ba324f21a373e94a';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = 'http://localhost:5173/';
const SCOPE =
	'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state';

const AUTH_URL = `${GET}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

export default function Login() {
	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ minHeight: '100vh' }}>
			<a className="btn btn-success btn-lg" href={AUTH_URL}>
				login with spotify
			</a>
			<div>&ensp;zen spotify built by brady gerber</div>
		</Container>
	);
}
