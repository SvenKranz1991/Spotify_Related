import React from "react";
import axios from "./axios";

export default class CreatePlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeForCreatingPlaylist = this.handleChange.bind(this);
    }
    handleChange(e) {
        console.log("e: ", e.target.name, e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit() {
        console.log(
            "NameState for Creating Playlist: ",
            this.state.playlistName
        );

        let playListName = this.state.playlistName;

        axios.get(`/createPlaylist/${playListName}.json`).then(data => {
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
                <hr className="horiLine" />
                <h1>CREATE PLAYLIST SECTION</h1>
                <input
                    type="text"
                    placeholder="Playlist Name"
                    name="playlistName"
                    className="textInput"
                    onChange={this.handleChange}
                />
                <br />
                <button className="button" onClick={this.handleSubmit}>
                    Create Playlist
                </button>
            </div>
        );
    }
}
