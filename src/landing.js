import React from "react";
import { Link } from "react-router-dom";
import ShowTopArtists from "./showTopArtists";
import ShowingCreatedPlaylists from "./showingCreatedPlaylists";

export default class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("Landing mounted!");
    }
    render() {
        return (
            <div>
                <div className="landingpage">
                    <div className="callToAction">
                        <h1>Create a playlist out of similar Artists</h1>
                        <Link to="/app/compCreatePlaylist">
                            Create Playlist
                        </Link>
                    </div>
                </div>
                <ShowTopArtists />
                <div className="searchTrack">
                    <div>
                        <h1>Get Data for a Track on Spotify</h1>
                        <Link to="/app/searchingSingleTrackFeature">
                            Search
                        </Link>
                    </div>
                </div>
                <ShowingCreatedPlaylists />
            </div>
        );
    }
}
