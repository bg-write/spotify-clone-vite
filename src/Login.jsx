/*
building our GET request for auth
see "request user authorization" section of Spotify docs:
https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
Note that CLIENT_ID is already public
*/

const GET = 'https://accounts.spotify.com/authorize';
const CLIENT_ID = '825aa066f2c24b53ba324f21a373e94a';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI = 'http://localhost:5173';
const SCOPE =
	'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state';

const AUTH_URL = `${GET}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

export default function Login() {
	return <div>Login</div>;
}
