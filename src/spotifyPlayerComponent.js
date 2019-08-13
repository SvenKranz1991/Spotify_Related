import React from "react";
import SpotifyPlayer from "react-spotify-player";

const size = {
    width: "100%",
    height: 300
};
const view = "coverart"; // or 'coverart'
const theme = "white"; // or 'white'

export default class SpotifyPlayerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("Mounted Player Component!");
        console.log("My Props: ", this.props);
    }
    render() {
        return (
            <div>
                <hr className="horiLine" />
                <h2>-------------Playlist Created-----------------</h2>
                <p>Name of Playlist: {this.props.playListName}</p>
                <p>Id of Playlist: {this.props.playListId}</p>
                <SpotifyPlayer
                    uri={this.props.uri}
                    size={size}
                    view={view}
                    theme={theme}
                />
                <a
                    href={this.props.href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Link to the PlayList
                </a>
                <a
                    href={this.props.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open in Spotify!
                </a>

                <hr className="horiLine" />
            </div>
        );
    }
}
