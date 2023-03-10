import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
// import spotifyIconBlack from '../assets/Spotify_Icon_RGB_Black.png';

const spotifyApi = new SpotifyWebApi({
	clientId: '825aa066f2c24b53ba324f21a373e94a',
});

export default function Dashboard({ code }) {
	const accessToken = useAuth(code);
	const [search, setSearch] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [playingTrack, setPlayingTrack] = useState();

	function chooseTrack(track) {
		setPlayingTrack(track);
		setSearch('');
	}

	// update Spotify when our access token updates
	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	// our Spotify search query
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
				console.log('CLIENT Search ERROR', error);
			});

		return () => (cancel = true);
	}, [search, accessToken]);

	// return album artwork of current song
	let albumArtwork = playingTrack
		? playingTrack.albumUrl
		: 'https://picsum.photos/500';

	return (
		<Container id="dashboard-container" className="d-flex flex-column py-2">
			<Form.Control
				type="search"
				placeholder="Search for a song or artist ..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<div id="dashboard-display" className="flex-grow-1 my-2">
				{searchResults.map((track) => (
					<TrackSearchResult
						track={track}
						key={track.uri}
						chooseTrack={chooseTrack}
					/>
				))}
				{searchResults.length === 0 && (
					<div id="dashboard-results" className="text-center">
						<img
							src={albumArtwork}
							id="dashboard-image"
							className="justify-content-center align-items-center"
						/>
					</div>
				)}
			</div>

			<div id="dashboard-player-container">
				<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
			</div>

			<footer>
				zen spotify, built by brady gerber |{' '}
				<a
					href="https://bradygerber.com/"
					target="_blank"
					rel="noopener noreferrer">
					website
				</a>{' '}
				|{' '}
				<a
					href="https://twitter.com/BradyWGerber"
					target="_blank"
					rel="noopener noreferrer">
					twitter
				</a>{' '}
				|{' '}
				<a
					href="https://www.linkedin.com/in/brady-gerber/"
					target="_blank"
					rel="noopener noreferrer">
					linkedin
				</a>{' '}
				|{' '}
				<a
					href="https://github.com/bg-write/spotify-clone-vite"
					target="_blank"
					rel="noopener noreferrer">
					github
				</a>{' '}
				|{' '}
				<a
					href="https://myreps.datamade.us/"
					target="_blank"
					rel="noopener noreferrer">
					find your local reps
				</a>{' '}
				|{' '}
				<a
					href="https://www.paypal.com/paypalme/BGerber654?locale.x=en_US"
					target="_blank"
					rel="noopener noreferrer">
					donate to my coffee fund
				</a>
			</footer>
		</Container>
	);
}
