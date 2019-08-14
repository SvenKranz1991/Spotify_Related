import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function TrackRows(props) {
    const [myList, setTopArtists] = useState(props.trackList);
    const [audioFeatures, setAudioFeatures] = useState();

    console.log("Log my Props in Track Rows: ", props);
    let tracks = props.trackList;
    let artistIds = props.artistIds;

    useEffect(() => {
        axios
            .get(`/tracklist`, {
                params: {
                    tracks: tracks,
                    artistIds: artistIds
                }
            })
            .then(result => {
                console.log("My Result in TrackList: ", result);
                // this.setState({
                //     trackInfoRows: result.data.formatTrackInfoList
                // });
                setTopArtists(result.data.formatTrackInfoList);
            });
    }, []);

    useEffect(
        () => {
            console.log("My event: ", audioFeatures);
            // axios.get(`/audioFeatures/:track`);
        },
        [setAudioFeatures]
    );

    return (
        <div className="playlistsWrapper">
            <h3>Your Tracks</h3>

            {myList &&
                myList.map(list => (
                    <div key={list.id}>
                        <a
                            href={list.linkToSpotify}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={list.trackImageLink}
                                height="100px"
                                width="100px"
                            />
                        </a>
                        <p>Interpret -{list.interpret}</p>
                        <p>TrackName - {list.name}</p>
                        <p>Popularity - {list.popularity}</p>

                        <button
                            onClick={e => setAudioFeatures(e.target.list.id)}
                        >
                            Show Audio Features from Spotify
                        </button>

                        <br />
                    </div>
                ))}
        </div>
    );
}
