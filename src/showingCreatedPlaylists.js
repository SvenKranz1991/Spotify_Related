import React, { useState, useEffect } from "react";
import axios from "./axios";
// import Profilepic from "./profilepic";
import { Link } from "react-router-dom";

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
            <h3>Playlists created with this Webpage</h3>

            {myList &&
                myList.map(list => (
                    <div key={list.id}>
                        <Link to={list.playlisturl}>
                            <img
                                src={list.artistpic}
                                height="100px"
                                width="100px"
                            />
                        </Link>
                        <p>{list.mainartist}</p>
                        <p>Created by: {list.spotify_id}</p>
                        <br />
                    </div>
                ))}
        </div>
    );
}

// <div key={list.id}>
//     <hr className="horiLine" />
//     <p>Hallo</p>
//     <Link
//         to={list.playlisturl}
//         target="_blank"
//         rel="noopener noreferrer"
//     >
//         <img
//             src={list.artistpic}
//             height="100px"
//             width="100px"
//         />
//     </Link>
//     <p>{list.mainartist}</p>
//     <p>Created by: {list.spotify_id}</p>
// </div>;
