export default function TrackSearchResult({ track, chooseTrack }) {
	function handlePlay() {
		chooseTrack(track);
	}

	return (
		<div
			id="track-search-result"
			className="d-flex m-2 align-items-center"
			onClick={handlePlay}>
			<img id="track-search-result-image" src={track.albumUrl} />

			<div className="ml-3">
				<div>{track.title}</div>
				<div className="text-muted">{track.artist}</div>
			</div>
		</div>
	);
}
