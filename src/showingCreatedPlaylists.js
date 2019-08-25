import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useTrail, animated as a } from "react-spring";

const config = { mass: 5, tension: 2000, friction: 200, duration: 500 };

export default function ShowingCreatedPlaylists() {
    const [myList, setPlaylists] = useState([]);
    const [toggleList, setToggleList] = useState(0);
    const [showButton, setButton] = useState(true);

    useEffect(
        () => {
            if (toggleList == 0) {
                axios
                    .get(`/app/getPlaylists`)
                    .then(playlistList => {
                        console.log("My playlistList: ", playlistList);
                        console.log(
                            "Typeof playlistList: ",
                            typeof playlistList
                        );
                        console.log("Playlistlistdata: ", playlistList.data);
                        setPlaylists(playlistList.data);
                    })
                    .catch(err => {
                        console.log("Log My Error for PlaylistList: ", err);
                    });
            } else {
                console.log("clickedButton");
                console.log(
                    "My List Length of Picture: ",
                    myList[myList.length - 1].id
                );

                let lastId = myList[myList.length - 1].id;

                axios
                    .get(`/app/getMorePlaylists/${lastId}.json`)
                    .then(result => {
                        console.log(
                            "My Result for getting More: ",
                            result.data
                        );
                        let morePlaylists = result.data;
                        if (morePlaylists.length < 12) {
                            setButton(false);
                            setPlaylists(myList.concat(morePlaylists));
                        }
                        setPlaylists(myList.concat(morePlaylists));
                    });
            }
        },
        [toggleList]
    );

    const trail = useTrail(myList.length, {
        config,
        opacity: 1,
        transform: "translate3d(0px,0,0)",
        from: { opacity: 0.5, transform: "translate3d(0,-10px,0)" }
    });

    return (
        <div className="playlistsWrapper">
            <h3 className="playlistTitle">
                Users created Playlists for Artists like...
            </h3>
            <div className="playlistsInline">
                {trail.map((props, index) => {
                    return (
                        <a.div
                            key={myList[index]}
                            style={props}
                            className="playlistCard"
                        >
                            <a
                                href={myList[index].playlisturl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={myList[index].artistpic}
                                    height="100px"
                                    width="100px"
                                />
                            </a>

                            <h4 className="evenbolder">
                                {myList[index].mainartist}
                            </h4>
                            <h6 className="evenSmaller">
                                Created by: {myList[index].spotify_id}
                            </h6>
                        </a.div>
                    );
                })}
            </div>
            {showButton && (
                <div>
                    <h1
                        onClick={() => setToggleList(toggleList + 1)}
                        className="getMorePlaylists-btn"
                    >
                        V
                    </h1>
                </div>
            )}
        </div>
    );
}
//
// <br />

// <br />
