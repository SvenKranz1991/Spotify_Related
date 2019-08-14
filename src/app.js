import React from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import ShowingCreatedPlaylists from "./showingCreatedPlaylists";
import SingleGeneratePlaylist from "./singleGeneratePlaylist";
import CompGeneratePlaylist from "./compGeneratePlaylist";
import LoggedUser from "./loggedUser";

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
                    <header>
                        <Link to="/app">Home</Link>
                        <Link to="/app/playlists">Playlists</Link>
                        <Link to="/app/justCreatePlaylist">
                            Create Playlist - Single
                        </Link>
                        <Link to="/app/compCreatePlaylist">
                            CreatePlaylist - Comp
                        </Link>
                    </header>

                    <div className="mainbody">
                        <Route
                            exact
                            path="/app"
                            render={() => {
                                return <LoggedUser />;
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
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

// {this.state.showRelated && (
//     <RelatedArtists artistId={this.state.IdOfArtist} />
// )}
