import React from "react";
import { Link } from "react-router-dom";
import ShowTopArtists from "./showTopArtists";
import ShowingCreatedPlaylists from "./showingCreatedPlaylists";
import { Spring } from "react-spring/renderprops";

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
                    <Spring
                        from={{
                            opacity: 0,
                            transform: "translate3d(0,-200px,0)"
                        }}
                        to={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                        config={{ duration: 1100 }}
                    >
                        {props => (
                            <div style={props}>
                                <div className="callToAction">
                                    <h1>
                                        Create a playlist out of similar Artists
                                    </h1>
                                    <Link to="/app/compCreatePlaylist">
                                        Create Playlist
                                    </Link>
                                </div>
                            </div>
                        )}
                    </Spring>
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
