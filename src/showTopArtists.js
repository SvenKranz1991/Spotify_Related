import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function ShowTopArtists() {
    const [myList, setTopArtists] = useState();

    useEffect(() => {
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
    }, []);

    return (
        <div className="playlistsWrapper">
            <h3>Your Top Artists</h3>

            {myList &&
                myList.map(list => (
                    <div key={list.id}>
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
                        <p>{list.name}</p>
                        <p>Popularity - {list.popularity}</p>
                        <p>Followers - {list.followers_value}</p>
                        <br />
                    </div>
                ))}
        </div>
    );
}
