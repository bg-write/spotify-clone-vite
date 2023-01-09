import { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ accessToken, trackUri }) {
	const [play, setPlay] = useState(false);

	// deciding what to currently play
	useEffect(() => setPlay(true), [trackUri]);

	if (!accessToken) return null;

	// see full list of Player options
	// https://www.npmjs.com/package/react-spotify-web-playback
	return (
		<SpotifyPlayer
			token={accessToken}
			showSaveIcon
			callback={(state) => {
				if (!state.isPlaying) setPlay(false);
			}}
			play={play}
			uris={trackUri ? [trackUri] : []}
			magnifySliderOnHover
			name={'BG Spotify Zen Player'}
		/>
	);
}
