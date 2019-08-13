import React from "react";
import axios from "./axios";
import RelatedArtists from "./relatedArtists";
import { Route, BrowserRouter, Link } from "react-router-dom";
import ShowingCreatedPlaylists from "./showingCreatedPlaylists";
import SingleGeneratePlaylist from "./singleGeneratePlaylist";
import LoggedUser from "./loggedUser";
import SpotifyPlayerComponent from "./spotifyPlayerComponent";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRelated: false,
            playListCreated: false,
            showResultOfSearch: false,
            linkToPlayList: ""
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
    }
    componentDidMount() {
        console.log("Main Page Mounted");
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
                    SearchArtistPicture,
                    SearchArtistUrl
                } = data.data;

                this.setState({
                    IdOfArtist: IdOfArtist,
                    SearchArtistName: SearchArtistName,
                    SearchArtistPicture: SearchArtistPicture,
                    showResultOfSearch: true,
                    SearchArtistUrl: SearchArtistUrl,
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

    render() {
        return (
            <div>
                <BrowserRouter>
                    <header>
                        <Link to="/app">Home</Link>
                        <Link to="/app/playlists">Playlists</Link>
                        <Link to="/app/justCreatePlaylist">
                            Create Playlist
                        </Link>
                    </header>

                    <div className="mainbody">
                        <div>
                            <Route
                                exact
                                path="/app"
                                render={() => {
                                    return (
                                        <div>
                                            <h1>Spotify Playlist Generator</h1>

                                            <br />
                                            <LoggedUser />
                                            <hr className="horiLine" />
                                            <br />
                                            <h2>
                                                Create a Playlist out of the
                                                related Artists!
                                            </h2>
                                            <br />
                                            <input
                                                type="text"
                                                placeholder="Artist Name"
                                                name="artistName"
                                                className="textInput"
                                                onChange={this.handleChange}
                                            />
                                            <br />
                                            <button
                                                className="button"
                                                onClick={this.handleSubmit}
                                            >
                                                Search Artist
                                            </button>
                                            <br />
                                            <hr className="horiLine" />
                                            {this.state.showResultOfSearch && (
                                                <div>
                                                    <h1>
                                                        Result of Search Artist!
                                                    </h1>
                                                    <h2>
                                                        Artist Name:{" "}
                                                        {
                                                            this.state
                                                                .SearchArtistName
                                                        }
                                                    </h2>
                                                    <h3>
                                                        Artist Id:{" "}
                                                        {this.state.IdOfArtist}
                                                    </h3>
                                                    <a
                                                        href={
                                                            this.state
                                                                .SearchArtistUrl
                                                        }
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={
                                                                this.state
                                                                    .SearchArtistPicture
                                                            }
                                                            width="300px"
                                                            height="300px"
                                                            className="ArtistPicture"
                                                        />
                                                    </a>
                                                    <button
                                                        className="button"
                                                        onClick={
                                                            this.clearSearch
                                                        }
                                                    >
                                                        If its not you can
                                                        clear!
                                                    </button>
                                                    <button
                                                        className="button"
                                                        onClick={
                                                            this
                                                                .getRelatedArtists
                                                        }
                                                    >
                                                        Yes, thats perfect! Get
                                                        me the related Artists!
                                                    </button>
                                                    <RelatedArtists
                                                        artistId={
                                                            this.state
                                                                .IdOfArtist
                                                        }
                                                    />

                                                    <hr className="horiLine" />
                                                    <h1>
                                                        Testing getting Top
                                                        Tracks
                                                    </h1>
                                                    <hr className="horiLine" />
                                                    <button
                                                        className="button"
                                                        onClick={
                                                            this.getTopTracks
                                                        }
                                                    >
                                                        Yes, get me the Top
                                                        Tracks!
                                                    </button>
                                                </div>
                                            )}
                                            {this.state.nothingFound && (
                                                <div>
                                                    Nothing Found! Be precise
                                                    with search Name!
                                                </div>
                                            )}

                                            <hr className="horiLine" />
                                            <h1>CREATE PLAYLIST SECTION</h1>
                                            <input
                                                type="text"
                                                placeholder="Playlist Name"
                                                name="playlistName"
                                                className="textInput"
                                                onChange={
                                                    this
                                                        .handleChangeForCreatingPlaylist
                                                }
                                            />
                                            <br />
                                            <button
                                                className="button"
                                                onClick={
                                                    this
                                                        .handleSubmitForCreatingPlaylist
                                                }
                                            >
                                                Create Playlist
                                            </button>
                                            {this.state.playListCreated && (
                                                <div>
                                                    <SpotifyPlayerComponent
                                                        playListName={
                                                            this.state
                                                                .playListName
                                                        }
                                                        playListId={
                                                            this.state
                                                                .playListId
                                                        }
                                                        uri={
                                                            this.state
                                                                .playListUri
                                                        }
                                                        href={
                                                            this.state
                                                                .linkToPlayList
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                        </div>
                        <Route
                            exact
                            path="/app/playlists"
                            component={ShowingCreatedPlaylists}
                        />
                        <Route
                            path="/app/justCreatePlaylist"
                            component={SingleGeneratePlaylist}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

// {this.state.showRelated && (
//     <RelatedArtists artistId={this.state.IdOfArtist} />
// )}
