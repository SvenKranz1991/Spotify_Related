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
                <h3 className="relatedArtistsTitle">
                    Related Artists to {props.searchArtistName}!
                </h3>
            </div>
            <div className="relatedArtistsInline">
                {artists &&
                    artists.map(list => (
                        <div key={list.id} className="relatedArtistsCard">
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
                            <h4 className="evenbolder">{list.name}</h4>
                            <h6 className="evenSmaller">
                                Popularity - {list.popularity}
                            </h6>
                            <h6 className="evenSmaller">
                                Followers - {list.followers_value}
                            </h6>
                            <br />
                            <GenreBubbles
                                genres={list.genres}
                                idOfRelArtist={list.id}
                            />
                        </div>
                    ))}
            </div>

            <CreatePlaylist
                searchArtistName={props.searchArtistName}
                searchArtistId={props.artistId}
            />
        </div>
    );
}
