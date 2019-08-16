import React from "react";
import axios from "./axios";
import SpotifyPlayerComponent from "./spotifyPlayerComponent";
import TrackList from "./trackList";

export default class CreatePlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playListCreated: false,
            giveList: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showList = this.showList.bind(this);
    }

    handleSubmit() {
        let playListName = this.props.searchArtistName;
        let artistId = this.props.artistId;

        // console.log("My props in create Playlist: ", this.props);

        axios
            .get(`/createPlaylist/${playListName}.json/${artistId}.json`)
            .then(data => {
                let {
                    linkToPlayList,
                    playListId,
                    playListName,
                    playListUri,
                    wholeIds,
                    mappedArtistsIdFormat
                } = data.data;
                console.log(
                    "Everything needed: ",
                    linkToPlayList,
                    playListId,
                    playListName,
                    playListUri,
                    wholeIds,
                    mappedArtistsIdFormat
                );
                if (data) {
                    this.setState({
                        linkToPlayList: linkToPlayList,
                        playListUri: playListUri,
                        playListName: playListName,
                        playListId: playListId,
                        playListCreated: true,
                        wholeIds: wholeIds,
                        mappedArtistsIdFormat: mappedArtistsIdFormat
                    });
                }
            });
    }
    showList(e) {
        this.setState({
            giveList: true
        });
    }
    render() {
        return (
            <div>
                {!this.state.playListCreated && (
                    <div className="createTitle">
                        <h2>Create A Playlist?</h2>

                        <p onClick={this.handleSubmit}>Create Playlist</p>
                    </div>
                )}

                {this.state.playListCreated && (
                    <div className="createTitle">
                        <SpotifyPlayerComponent
                            playListName={this.state.playListName}
                            playListId={this.state.playListId}
                            uri={this.state.playListUri}
                            href={this.state.linkToPlayList}
                        />
                        <button
                            onClick={this.showList}
                            className="buttonShowAudioFeature"
                        >
                            Show List and Features
                        </button>
                    </div>
                )}

                {this.state.giveList && (
                    <div>
                        <TrackList
                            trackList={this.state.wholeIds}
                            artistIdFormat={this.state.mappedArtistsIdFormat}
                        />
                    </div>
                )}
            </div>
        );
    }
}
