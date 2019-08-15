import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(
        () => {
            savedCallback.current = callback;
        },
        [callback]
    );

    // Set up the interval.
    useEffect(
        () => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        },
        [delay]
    );
}

export default function ShowTopArtists() {
    const [myList, setTopArtists] = useState();
    const [update, setUpdate] = useState(1);

    useInterval(() => {
        // Your custom logic here
        console.log("Count");
        setUpdate(update + 1);
    }, 7000);

    useEffect(
        () => {
            axios
                .get(`/app/userTopArtists`)
                .then(topArtists => {
                    console.log("My playlistList: ", topArtists);
                    console.log("Typeof playlistList: ", typeof topArtists);
                    console.log("Playlistlistdata: ", topArtists.data);
                    setTopArtists(topArtists.data);
                })
                .catch(err => {
                    console.log("Log My Error for PlaylistList: ", err);
                });
        },
        [update]
    );

    return (
        <div className="topArtistWrapper">
            <h3 className="topArtistTitle">Your Top Artists</h3>
            <div className="topArtistInline">
                {myList &&
                    myList.map(list => (
                        <div key={list.id} className="topArtistCard">
                            <a
                                href={list.linkToSpotify}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={list.artistImageLink}
                                    height="100px"
                                    width="100px"
                                />
                            </a>

                            <p className="bolder">{list.name}</p>
                            <br />
                            <p>Popularity: {list.popularity}</p>
                            <p>Followers: {list.followers_value}</p>
                            <br />
                        </div>
                    ))}
            </div>
        </div>
    );
}
