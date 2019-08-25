import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
import { useTrail, animated as a } from "react-spring";

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

const config = { mass: 5, tension: 2000, friction: 200 };

export default function ShowTopArtists() {
    const [myList, setTopArtists] = useState([]);
    const [update, setUpdate] = useState(1);
    const [toggle, set] = useState(true);

    useInterval(() => {
        // Your custom logic here
        console.log("Count");
        set(false);
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
                    set(true);
                })
                .catch(err => {
                    console.log("Log My Error for PlaylistList: ", err);
                });
        },
        [update]
    );

    const trail = useTrail(myList.length, {
        config,
        opacity: toggle ? 1 : 0,
        transform: toggle ? "translate3d(0px,0,0)" : "translate3d(-10px,0,0)",
        from: { opacity: 0, transform: "translate3d(-10px,0,0)" }
    });

    return (
        <div className="topArtistWrapper">
            <h3 className="topArtistTitle">Your Top Artists</h3>
            <div className="topArtistInline">
                {trail.map((props, index) => {
                    return (
                        <a.div
                            key={myList[index]}
                            style={props}
                            className="topArtistCard"
                        >
                            <a
                                href={myList[index].linkToSpotify}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={myList[index].artistImageLink}
                                    height="100px"
                                    width="100px"
                                />
                            </a>

                            <h4 className="evenbolder">{myList[index].name}</h4>
                            <h6 className="evenSmaller">
                                Popularity: {myList[index].popularity}
                            </h6>
                            <h6 className="evenSmaller">
                                Followers: {myList[index].followers_value}
                            </h6>
                            <br />
                        </a.div>
                    );
                })}
            </div>
        </div>
    );
}
