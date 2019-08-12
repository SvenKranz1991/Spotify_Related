import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function RelatedArtists(props) {
    const [artists, setArtists] = useState();
    const [getRelated, setRelated] = useState(false);

    console.log("My getRelated: ", getRelated);
    console.log("Artists: ", artists);
    console.log("Artists: ", artists);
    useEffect(
        () => {
            // console.log("Has Some Effect");
            let artistId = props.artistId;
            console.log("Clicked");
            axios
                .get(`/getRelatedArtists/${artistId}.json`)
                .then(result => {
                    console.log("Artists Data: ", result);
                    console.log("TypeOfArtistData: ", typeof result.data);
                    setArtists(result.data);
                })
                .catch(err => {
                    console.log("Error in getting relatedArtists: ", err);
                });
        },
        [getRelated]
    );

    return (
        <div className="relatedArtistsWrapper">
            <button className="button" onClick={() => setRelated(true)}>
                Yes, thats perfect! Get me the related Artists!
            </button>

            {getRelated && (
                <div>
                    <h3>
                        Related Artists to SearchArtistName - make it dynamic!
                    </h3>
                    <br />
                    <hr className="horiLine" />
                    <br />
                </div>
            )}

            <hr className="horiLine" />

            {artists &&
                artists.map(artist => {
                    <div className="artistCard" key={artist.id}>
                        <a
                            href={artist.linkToSpotify}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={artist.singleArtistImage}
                                height="100px"
                                width="100px"
                            />
                        </a>
                        <p>{artist.name}</p>
                        <p>Popularity: {artist.popularity}</p>
                        <p>Followers: {artist.followers_value}</p>
                    </div>;
                })}
        </div>
    );
}
