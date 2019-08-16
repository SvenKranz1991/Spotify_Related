import React from "react";
import axios from "./axios";
import RelatedArtists from "./relatedArtists";

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
    }
    handleSubmit() {
        let artistName = this.state.artistName;
        this.setState({
            showRelated: false
        });

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
            SearchArtistPicture: "",
            showRelated: false
        });
    }
    getRelatedArtists(e) {
        this.setState({
            showRelated: true
        });
    }

    render() {
        return (
            <div className="compGenratePlaylistWrapper">
                <div>
                    <div className="searchWrapper">
                        <div className="searchField">
                            <h2 className="textBlock">
                                Cool... so lets start with an Artist Name!
                            </h2>
                            <br />
                            {this.state.nothingFound && (
                                <div className="white">
                                    Nothing Found! Be precise with search Name!
                                </div>
                            )}
                            <br />
                            <input
                                type="text"
                                placeholder="Artist Name"
                                name="artistName"
                                className="textInput"
                                onChange={this.handleChange}
                            />
                            <br />
                            <p
                                className="searchButton"
                                onClick={this.handleSubmit}
                            >
                                Search Artist
                            </p>
                            <br />
                        </div>
                    </div>
                    <hr className="horiLine" />
                    {this.state.showResultOfSearch && (
                        <div>
                            <div className="resultOfSearchArtist">
                                <h1>Result of Search Artist!</h1>
                                <h2>
                                    Artist Name: {this.state.SearchArtistName}
                                </h2>

                                <a
                                    href={this.state.SearchArtistUrl}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <img
                                        src={this.state.SearchArtistPicture}
                                        className="ArtistPicture"
                                    />
                                </a>
                                <p>Artist Id:</p>
                                <p>{this.state.IdOfArtist}</p>
                                <div className="buttonSearchWrapper">
                                    <p
                                        className="conButton"
                                        onClick={this.clearSearch}
                                    >
                                        Clear Search
                                    </p>
                                    <p
                                        className="conButton"
                                        onClick={this.getRelatedArtists}
                                    >
                                        Yes, thats perfect! Get me the related
                                        Artists!
                                    </p>
                                </div>
                            </div>

                            {this.state.showRelated && (
                                <div>
                                    <div>
                                        <RelatedArtists
                                            artistId={this.state.IdOfArtist}
                                            searchArtistName={
                                                this.state.SearchArtistName
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
