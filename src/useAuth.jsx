import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth(code) {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();

	// make sure our axios post matches "server.js"
	useEffect(() => {
		console.log('mounting ...');

		axios
			.post('http://localhost:3001/login', {
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
