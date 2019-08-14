import React, { useState, useEffect } from "react";
import axios from "./axios";
import GenreBubbles from "./genreBubbles";
import CreatePlaylist from "./createPlaylist";

export default function RelatedArtists(props) {
    const [artists, setArtists] = useState();
    const [relArtList, setArtList] = useState();

    console.log("relArtList: ", relArtList);

    console.log("My props in related Artists: ", props);
    useEffect(() => {
        let artistId = props.artistId;

        axios
            .get(`/getRelatedArtists/${artistId}.json`)
            .then(result => {
                console.log("Artist Ids List: ", result.data.wholeArtistsId);
                console.log(
                    "MappedRelativeArtists: ",
                    result.data.mappedRelativeArtists
                );
                setArtists(result.data.mappedRelativeArtists);
                setArtList(result.data.wholeArtistsId);
            })
            .catch(err => {
                console.log("Error in getting relatedArtists: ", err);
            });
    }, []);

    return (
        <div className="relatedArtistsWrapper">
            <div>
                <h3>Related Artists of {props.searchArtistName}!</h3>
                <br />
                <hr className="horiLine" />
                <br />
            </div>

            <hr className="horiLine" />

            {artists &&
                artists.map(list => (
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
                        <GenreBubbles
                            genres={list.genres}
                            idOfRelArtist={list.id}
                        />
                        <p>{list.name}</p>
                        <p>Popularity - {list.popularity}</p>
                        <p>Followers - {list.followers_value}</p>
                        <br />
                    </div>
                ))}
            <CreatePlaylist
                searchArtistName={props.searchArtistName}
                searchArtistId={props.artistId}
            />
        </div>
    );
}
