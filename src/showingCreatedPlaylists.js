import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function ShowingCreatedPlaylists() {
    const [myList, setPlaylists] = useState();

    useEffect(() => {
        axios
            .get(`/app/getPlaylists`)
            .then(playlistList => {
                console.log("My playlistList: ", playlistList);
                console.log("Typeof playlistList: ", typeof playlistList);
                console.log("Playlistlistdata: ", playlistList.data);
                setPlaylists(playlistList.data);
            })
            .catch(err => {
                console.log("Log My Error for PlaylistList: ", err);
            });
    }, []);

    return (
        <div className="playlistsWrapper">
            <h3 className="playlistTitle">
                Users created Playlists for Artists like...
            </h3>
            <div className="playlistsInline">
                {myList &&
                    myList.map(list => (
                        <div key={list.id} className="playlistCard">
                            <a
                                href={list.playlisturl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={list.artistpic}
                                    height="100px"
                                    width="100px"
                                />
                            </a>

                            <p className="evenbolder">{list.mainartist}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
//
// <br />
// <p>Created by: {list.spotify_id}</p>
// <br />
