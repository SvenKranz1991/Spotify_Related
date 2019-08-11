import React from "react";
import axios from "./axios";

console.log("Log axios for sanity: ", axios);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitForCreatingPlaylist = this.handleSubmitForCreatingPlaylist.bind(
            this
        );
        this.handleChangeForCreatingPlaylist = this.handleChangeForCreatingPlaylist.bind(
            this
        );
        this.clearSearch = this.clearSearch.bind(this);
        this.getRelatedArtists = this.getRelatedArtists.bind(this);
    }
    componentDidMount() {
        axios.get("/access").then(result => {
            console.log("LogmyAccesstoken: ", result.data.token);
            console.log("My Result: ", result);
            if (result.data.token == "") {
                location.replace("/");
            }
            this.setState({
                token: result.data.token,
                spotify_id: result.data.user.spotify_id,
                displayname: result.data.user.displayname,
                email: result.data.user.email,
                profileUrl: result.data.user.profileurl,
                photo: result.data.user.photo,
                playListCreated: false,
                showResultOfSearch: false,
                linkToPlayList: ""
            });
        });
    }
    handleSubmit() {
        let artistName = this.state.artistName;

        axios
            .get(`/artistName/${artistName}.json`)
            .then(data => {
                console.log("Data from Searching Artist: ", data);

                if (data.data.ooops) {
                    return this.setState({
                        nothingFound: true
                    });
                }

                let {
                    IdOfArtist,
                    SearchArtistName,
                    SearchArtistPicture
                } = data.data;

                this.setState({
                    IdOfArtist: IdOfArtist,
                    SearchArtistName: SearchArtistName,
                    SearchArtistPicture: SearchArtistPicture,
                    showResultOfSearch: true,
                    nothingFound: false
                });
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
    handleChangeForCreatingPlaylist(e) {
        console.log("e: ", e.target.name, e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmitForCreatingPlaylist() {
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
    clearSearch(e) {
        console.log("Clicked");
        this.setState({
            showResultOfSearch: false,
            IdOfArtist: "",
            SearchArtistName: "",
            SearchArtistPicture: ""
        });
    }
    getRelatedArtists(e) {
        console.log("Clicked");
        let artistId = this.state.IdOfArtist;
        axios.get(`/getRelatedArtists/${artistId}.json`);
    }

    render() {
        return (
            <div>
                <br />
                <br />
                <h1>Spotify Playlist Generator</h1>
                <p>Spotify Id: {this.state.spotify_id}</p>
                <p>E-Mail: {this.state.email}</p>
                <p>Profile Url: {this.state.profileUrl}</p>
                <img src={this.state.photo} height="50px" width="50px" />
                <br />
                <hr className="horiLine" />
                <br />
                <h2>Create a Playlist out of the related Artists!</h2>
                <br />
                <input
                    type="text"
                    placeholder="Artist Name"
                    name="artistName"
                    className="textInput"
                    onChange={this.handleChange}
                />
                <br />
                <button className="button" onClick={this.handleSubmit}>
                    Search Artist
                </button>
                <br />
                <hr className="horiLine" />
                {this.state.showResultOfSearch && (
                    <div>
                        <h3>Result of Search Artist!</h3>
                        <h5>Arist Name: {this.state.SearchArtistName}</h5>
                        <p>Artist Id: {this.state.IdOfArtist}</p>
                        <img
                            src={this.state.SearchArtistPicture}
                            width="200"
                            height="200"
                        />
                        <button className="button" onClick={this.clearSearch}>
                            If its not you can clear!
                        </button>
                        <button
                            className="button"
                            onClick={this.getRelatedArtists}
                        >
                            Yes, hes perfect!
                        </button>
                    </div>
                )}
                {this.state.nothingFound && (
                    <div>Nothing Found! Be precise with search Name!</div>
                )}

                <hr className="horiLine" />
                <h3>CREATE PLAYLIST SECTION</h3>
                <input
                    type="text"
                    placeholder="Playlist Name"
                    name="playlistName"
                    className="textInput"
                    onChange={this.handleChangeForCreatingPlaylist}
                />
                <br />
                <button
                    className="button"
                    onClick={this.handleSubmitForCreatingPlaylist}
                >
                    Create Playlist
                </button>
                {this.state.playListCreated && (
                    <div>
                        <hr className="horiLine" />
                        <h1>Playlist Created</h1>
                        <p>Name of Playlist: {this.state.playListName}</p>
                        <p>Id of Playlist: {this.state.playListId}</p>
                        <a
                            href={this.state.linkToPlayList}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Link to the PlayList
                        </a>
                        <a
                            href={this.state.playListUri}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open in Spotify!
                        </a>

                        <hr className="horiLine" />
                    </div>
                )}
            </div>
        );
    }
}
