import React from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import ShowingCreatedPlaylists from "./showingCreatedPlaylists";
import SingleGeneratePlaylist from "./singleGeneratePlaylist";
import CompGeneratePlaylist from "./compGeneratePlaylist";
import LoggedUser from "./loggedUser";
import SearchingSingleTrackFeature from "./searchingSingleTrackFeature";

import Landing from "./landing";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("Main Page Mounted");
    }
    render() {
        return (
            <div>
                <BrowserRouter>
                    <header className="navigation">
                        <p className="logoinnav">spotify related</p>
                        <div className="navigation-links">
                            <Link to="/app">Home</Link>
                            <Link to="/app/playlists">Playlists</Link>
                            <Link to="/app/justCreatePlaylist">
                                Create Playlist - Single
                            </Link>
                            <Link to="/app/compCreatePlaylist">
                                CreatePlaylist - Comp
                            </Link>
                            <Link to="/app/searchingSingleTrackFeature">
                                Searching for Single Track
                            </Link>
                        </div>
                        <LoggedUser />
                    </header>

                    <div className="mainbody">
                        <Route
                            exact
                            path="/app"
                            render={() => {
                                return <Landing />;
                            }}
                        />
                        <Route
                            path="/app/compCreatePlaylist"
                            component={CompGeneratePlaylist}
                        />

                        <Route
                            exact
                            path="/app/playlists"
                            component={ShowingCreatedPlaylists}
                        />
                        <Route
                            path="/app/justCreatePlaylist"
                            component={SingleGeneratePlaylist}
                        />
                        <Route
                            path="/app/searchingSingleTrackFeature"
                            component={SearchingSingleTrackFeature}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

// {this.state.showRelated && (
//     <RelatedArtists artistId={this.state.IdOfArtist} />
// )}
