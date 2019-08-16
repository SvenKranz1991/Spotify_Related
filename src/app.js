import React from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
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
                            <Link to="/app/compCreatePlaylist">
                                Create Playlist
                            </Link>
                            <Link to="/app/searchingSingleTrackFeature">
                                Data for Single Track
                            </Link>
                            <Link to="/app/justCreatePlaylist">
                                Create Playlist - Demo
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
