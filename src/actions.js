import axios from "./axios";

export async function getRelatedArtists(artistId) {
    const relatedArtistsList = await axios.get(
        `/getRelatedArtists/${artistId}.json`
    );

    return {
        type: "GET_RELATED_ARTISTS",
        artists: relatedArtistsList.data.rows
    };
}
