import React from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import SingleGeneratePlaylist from "./singleGeneratePlaylist";
import CompGeneratePlaylist from "./compGeneratePlaylist";
import LoggedUser from "./loggedUser";
import SearchingSingleTrackFeature from "./searchingSingleTrackFeature";
import Landing from "./landing";

import { Spring } from "react-spring/renderprops";

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
            <div className="mainwrapperforpage">
                <div>
                    <BrowserRouter>
                        <header className="makeNavigationBlack">
                            <Spring
                                from={{ opacity: 0 }}
                                to={{ opacity: 1 }}
                                config={{ duration: 600 }}
                            >
                                {props => (
                                    <div style={props} className="navigation">
                                        <p className="logoinnav">
                                            spotify related
                                        </p>
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
                                    </div>
                                )}
                            </Spring>
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
            </div>
        );
    }
}
