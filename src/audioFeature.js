import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function AudioFeature(props) {
    const [tracksFeatures, setTopArtists] = useState();

    console.log("My List Info: ", tracksFeatures);

    console.log(props);

    let trackId = props.trackId;

    useEffect(() => {
        axios
            .get(`/audioFeature/${trackId}.json`)
            .then(result => {
                console.log("My AudioFeature Result: ", result);
                setTopArtists(result.data.data);
            })
            .catch(err => {
                console.log("Error in getting Features: ", err);
            });
    }, []);
    return (
        <div className="playlistsWrapper">
            <h3>Audio Feature</h3>
            {tracksFeatures &&
                tracksFeatures.map(list => (
                    <div key={list.id}>
                        <p>{list.acousticness}</p>
                        <p>Popularity - {list.danceability}</p>
                        <p>Followers - {list.energy}</p>
                    </div>
                ))}
        </div>
    );
}
