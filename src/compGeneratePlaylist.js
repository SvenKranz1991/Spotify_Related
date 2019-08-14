import React from "react";
import axios from "./axios";
import RelatedArtists from "./relatedArtists";

import SpotifyPlayerComponent from "./spotifyPlayerComponent";

export default class CreatePlaylist extends React.Component {
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
        this.clearSearch = this.clearSearch.bind(this);
        this.getRelatedArtists = this.getRelatedArtists.bind(this);
        this.getTopTracks = this.getTopTracks.bind(this);
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
                <div>
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
                            <a
                                href={this.state.SearchArtistUrl}
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={this.state.SearchArtistPicture}
                                    width="300px"
                                    height="300px"
                                    className="ArtistPicture"
                                />
                            </a>
                            <button
                                className="button"
                                onClick={this.clearSearch}
                            >
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
                            <button
                                className="button"
                                onClick={this.getTopTracks}
                            >
                                Yes, get me the Top Tracks!
                            </button>
                        </div>
                    )}
                    {this.state.nothingFound && (
                        <div>Nothing Found! Be precise with search Name!</div>
                    )}

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
                </div>
            </div>
        );
    }
}
