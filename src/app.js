import React from "react";
import axios from "./axios";
import SpotifyPlayer from "react-spotify-player";
import RelatedArtists from "./relatedArtists";

const size = {
    width: "100%",
    height: 300
};
const view = "list"; // or 'coverart'
const theme = "white"; // or 'white'

console.log("Log axios for sanity: ", axios);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRelated: false
        };
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
        this.getTopTracks = this.getTopTracks.bind(this);
        this.handleSubmitBigBadButton = this.handleSubmitBigBadButton.bind(
            this
        );
        this.handleChangeBigBadButton = this.handleChangeBigBadButton.bind(
            this
        );
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
                        nothingFound: true,
                        showResultOfSearch: false
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
        let artistId = this.state.IdOfArtist;
        console.log("Clicked");
        axios.get(`/getRelatedArtists/${artistId}.json`).then(result => {
            console.log("Artists Data: ", result.data);
        });
        // this.setState({
        //     showRelated: true
        // });
    }
    getTopTracks(e) {
        console.log("Clicked");
        let artistId = this.state.IdOfArtist;
        axios.get(`/topTracksOfEachArtist/${artistId}.json`);
    }
    handleSubmitBigBadButton() {
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

                // if (data.data.ooops) {
                //     return this.setState({
                //         nothingFound: true,
                //         showResultOfSearch: false
                //     });
                // }
                //
                // let {
                //     IdOfArtist,
                //     SearchArtistName,
                //     SearchArtistPicture
                // } = data.data;
                //
                // this.setState({
                //     IdOfArtist: IdOfArtist,
                //     SearchArtistName: SearchArtistName,
                //     SearchArtistPicture: SearchArtistPicture,
                //     showResultOfSearch: true,
                //     nothingFound: false
                // });
            })
            .catch(err => {
                console.log("Error in finding Artist: ", err);
            });
    }
    handleChangeBigBadButton(e) {
        console.log("e: ", e.target.name, e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>
                <hr className="horiLine" />
                <br />
                <h2>BigBadButton!</h2>
                <br />
                <input
                    type="text"
                    placeholder="Artist Name"
                    name="bigbadbutton"
                    className="textInput"
                    onChange={this.handleChangeBigBadButton}
                />
                <br />
                <button
                    className="button"
                    onClick={this.handleSubmitBigBadButton}
                >
                    Search Artist
                </button>
                <br />
                <h2>USER INFO</h2>
                <p>
                    Spotify Id: {this.state.spotify_id} --- E-Mail:{" "}
                    {this.state.email} --- Profile Url: {this.state.profileUrl}
                </p>
                <img src={this.state.photo} height="100px" width="100px" />
                <br />
                <h1>Spotify Playlist Generator</h1>

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
                        <h1>Result of Search Artist!</h1>
                        <h2>Artist Name: {this.state.SearchArtistName}</h2>
                        <h3>Artist Id: {this.state.IdOfArtist}</h3>
                        <img
                            src={this.state.SearchArtistPicture}
                            width="300px"
                            height="300px"
                            className="ArtistPicture"
                        />
                        <button className="button" onClick={this.clearSearch}>
                            If its not you can clear!
                        </button>
                        <button
                            className="button"
                            onClick={this.getRelatedArtists}
                        >
                            Yes, thats perfect! Get me the related Artists!
                        </button>
                        <RelatedArtists artistId={this.state.IdOfArtist} />

                        <hr className="horiLine" />
                        <h1>Testing getting Top Tracks</h1>
                        <hr className="horiLine" />
                        <button className="button" onClick={this.getTopTracks}>
                            Yes, get me the Top Tracks!
                        </button>
                    </div>
                )}
                {this.state.nothingFound && (
                    <div>Nothing Found! Be precise with search Name!</div>
                )}

                <hr className="horiLine" />
                <h1>CREATE PLAYLIST SECTION</h1>
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
                        <h2>-------------Playlist Created-----------------</h2>
                        <p>Name of Playlist: {this.state.playListName}</p>
                        <p>Id of Playlist: {this.state.playListId}</p>
                        <SpotifyPlayer
                            uri={this.state.playListUri}
                            size={size}
                            view={view}
                            theme={theme}
                        />
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

// {this.state.showRelated && (
//     <RelatedArtists artistId={this.state.IdOfArtist} />
// )}
