import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function AudioFeature(props) {
    const [myList, setTopArtists] = useState();

    console.log("My List Info: ", myList);

    console.log(props);

    let trackId = props.trackId;

    useEffect(() => {
        axios.get(`/audioFeature/${trackId}.json`).then(result => {
            console.log("My AudioFeature Result: ", result);
            setTopArtists(result.data.data);
        });
    }, []);

    return (
        <div className="playlistsWrapper">
            <div>
                <h3>Audio Feature</h3>
                {myList &&
                    myList.map(bubble => (
                        <div key={bubble.id}>
                            <p>{bubble.acousticness}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
