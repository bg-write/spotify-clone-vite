import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';

const CLIENT_ID = '825aa066f2c24b53ba324f21a373e94a';

const spotifyApi = new SpotifyWebApi({
	clientId: CLIENT_ID,
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

	// spotify search query
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
				console.log('Search ERROR', error);
			});

		return () => (cancel = true);
	}, [search, accessToken]);

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
			</div>
			
			<div>
				<Player accessToken={accessToken} trackUri={playingTrack?.uri} />
			</div>

			<footer>Footer To Come</footer>
		</Container>
	);
}
