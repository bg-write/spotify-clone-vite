import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import spotifyIconBlack from './assets/Spotify_Icon_RGB_Black.png';

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
		<Container className="d-flex flex-column py-2" style={{ height: '100vh' }}>
			<Form.Control
				type="search"
				placeholder="Search songs or artists ..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<div className="flex-grow-1 my-2" style={{ overflowY: 'auto' }}>
				{searchResults.map((track) => (
					<TrackSearchResult
						track={track}
						key={track.uri}
						chooseTrack={chooseTrack}
					/>
				))}
				{searchResults.length === 0 && (
					<div className="text-center" style={{ whiteSpace: 'pre' }}>
						<img
							src={albumArtwork}
							className="justify-content-center align-items-center"
							style={{ height: '75vh' }}
						/>
					</div>
				)}
			</div>

			<div>
				<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
			</div>

			<footer>Footer To Come</footer>
		</Container>
	);
}
