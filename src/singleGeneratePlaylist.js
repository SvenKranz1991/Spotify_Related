import React from "react";
import axios from "./axios";
import SpotifyPlayerComponent from "./spotifyPlayerComponent";
import TrackList from "./trackList";

export default class SingleGeneratePlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRelated: false,
            giveList: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showList = this.showList.bind(this);
    }
    componentDidMount() {
        console.log("Mounted single!");
    }
    handleSubmit() {
        let artistName = this.state.bigbadbutton;
        console.log("CLicked in BigBad", artistName);
        axios
            .get(`/createPlaylistOutOfName/${artistName}.json`)
            .then(data => {
                console.log("Data from Searching Artist: ", data);

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
                    playListUri
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
            })
            .catch(err => {
                console.log("Error in finding Artist: ", err);
            });
    }
    handleChange(e) {
        console.log("e: ", e.target.name, e.target.value);
        this.setState({
            [e.target.name]: e.target.value
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
                <hr className="horiLine" />
                <br />
                <h2>Creating Playlist out of Artist! Single Click</h2>
                <br />
                <input
                    type="text"
                    placeholder="Artist Name"
                    name="bigbadbutton"
                    className="textInput"
                    onChange={this.handleChange}
                />
                <br />
                <button className="button" onClick={this.handleSubmit}>
                    Search Artist
                </button>
                <br />
                {this.state.playListCreated && (
                    <div>
                        <SpotifyPlayerComponent
                            playListName={this.state.playListName}
                            playListId={this.state.playListId}
                            uri={this.state.playListUri}
                            href={this.state.linkToPlayList}
                        />
                    </div>
                )}
                {this.state.playListCreated && (
                    <div>
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
