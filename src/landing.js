import React from "react";
import { Link } from "react-router-dom";
import ShowTopArtists from "./showTopArtists";

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
                        <h1>Create a playlist from related Artists</h1>
                        <Link href="/app/compCreatePlaylist">
                            Create Playlist
                        </Link>
                    </div>
                </div>
                <ShowTopArtists />
            </div>
        );
    }
}
