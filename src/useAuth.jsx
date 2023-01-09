import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth(code) {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();

	// set up our auth
	useEffect(() => {
		// console.log('mounting ...');

		axios
			.post('http://localhost:3001/login', {
				// make sure our axios post matches "server.js"
				code,
			})
			.then((res) => {
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
				window.history.pushState({}, null, '/');
			})
			.catch(() => {
				window.location = '/';
			});

		return () => {
			// console.log('unmounting ...');
		};
	}, [code]);

	// keep users logged in
	useEffect(() => {
		// console.log('mounting ...');
		if (!refreshToken || !expiresIn) return;

		const interval = setInterval(() => {
			axios
				.post('http://localhost:3001/refresh', {
					// make sure our axios post matches "server.js"
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
			// console.log('unmounting ...');
			clearInterval(interval);
		};
	}, [refreshToken, expiresIn]);

	return accessToken;
}
