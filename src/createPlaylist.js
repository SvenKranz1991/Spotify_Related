import React from "react";
import axios from "./axios";
import SpotifyPlayerComponent from "./spotifyPlayerComponent";

export default class CreatePlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playListCreated: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let playListName = this.props.searchArtistName;
        let artistId = this.props.artistId;

        console.log("My props in create Playlist: ", this.props);

        axios
            .get(`/createPlaylist/${playListName}.json/${artistId}.json`)
            .then(data => {
                let {
                    linkToPlayList,
                    playListId,
                    playListName,
                    playListUri
                } = data.data;
                console.log(
                    "Everything needed: ",
                    linkToPlayList,
                    playListId,
                    playListName,
                    playListUri
                );
                if (data) {
                    this.setState({
                        linkToPlayList: linkToPlayList,
                        playListUri: playListUri,
                        playListName: playListName,
                        playListId: playListId,
                        playListCreated: true
                    });
                }
            });
    }
    render() {
        return (
            <div>
                {!this.state.playListCreated && (
                    <div>
                        <hr className="horiLine" />
                        <h2>Create A Playlist?</h2>

                        <br />
                        <button className="button" onClick={this.handleSubmit}>
                            Create Playlist
                        </button>
                    </div>
                )}

                {this.state.playListCreated && (
                    <div>
                        <h1>Your Playlist: </h1>
                        <SpotifyPlayerComponent
                            playListName={this.state.playListName}
                            playListId={this.state.playListId}
                            uri={this.state.playListUri}
                            href={this.state.linkToPlayList}
                        />
                    </div>
                )}
            </div>
        );
    }
}
