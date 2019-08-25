import React from "react";
import axios from "./axios";
import AudioFeature from "./audioFeature";
import { Spring } from "react-spring/renderprops";
import ShowTopArtists from "./showTopArtists";
import ShowingCreatedPlaylists from "./showingCreatedPlaylists";

export default class SingleTrackFeature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myList: false,
            showAudioFeature: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getAudioFeature = this.getAudioFeature.bind(this);
    }
    componentDidMount() {
        console.log("SingleTrackFeature Mounted!");
    }
    handleSubmit() {
        let trackName = this.state.trackName;
        this.setState({
            showRelated: false
        });

        axios
            .get(`/singleTrack/${trackName}.json`)
            .then(data => {
                console.log("Data from Searching Track: ", data);
                this.setState({
                    myList: true,
                    tracks: data.data.formatTrackInfoList
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
    getAudioFeature(e) {
        console.log("My Target: ", e.target.value);
        let trackId = e.target.value;
        if (e.target.value == this.state.showAudioFeature) {
            console.log(
                "It's the same id: ",
                e.target.value,
                this.state.showAudioFeature
            );
            this.setState({
                showAudioFeature: false
            });
        } else {
            this.setState({
                showAudioFeature: trackId
            });
        }
    }
    render() {
        return (
            <div className="searchTitleContainer">
                <div className="searchTitleWrapper">
                    <div className="searchTitle">
                        <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
                            {props => (
                                <div style={props}>
                                    <h1 className="white">
                                        Search for a specific Track and get
                                        Audio Features
                                    </h1>
                                    {this.state.nothingFound && (
                                        <div>
                                            Nothing Found! Be precise with
                                            search Name!
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Track Name"
                                        name="trackName"
                                        className="textInput"
                                        onChange={this.handleChange}
                                    />
                                    <br />
                                    <button
                                        className="searchButtonForArtist"
                                        onClick={this.handleSubmit}
                                    >
                                        Search Track
                                    </button>
                                </div>
                            )}
                        </Spring>
                    </div>
                </div>

                {!this.state.myList && (
                    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
                        {props => (
                            <div style={props}>
                                <div className="uniqueColor">
                                    <ShowTopArtists className="uniqueColor" />
                                </div>
                                <ShowingCreatedPlaylists />
                            </div>
                        )}
                    </Spring>
                )}
                {this.state.myList && (
                    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
                        {props => (
                            <div style={props}>
                                <div className="trackListTitle">
                                    <h3>Your Tracks</h3>
                                </div>
                            </div>
                        )}
                    </Spring>
                )}
                {this.state.myList && (
                    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
                        {props => (
                            <div style={props}>
                                <div className="trackListWrapper">
                                    <div className="trackListLines">
                                        {this.state.myList &&
                                            this.state.tracks.map(list => (
                                                <div key={list.id}>
                                                    <a
                                                        href={
                                                            list.linkToSpotify
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={
                                                                list.trackImageLink
                                                            }
                                                            height="100px"
                                                            width="100px"
                                                        />
                                                    </a>
                                                    <p>
                                                        Artist: {list.interpret}
                                                    </p>
                                                    <p>
                                                        Name of Track:{" "}
                                                        {list.name}
                                                    </p>
                                                    <p>
                                                        Popularity:{" "}
                                                        {list.popularity}
                                                    </p>

                                                    <button
                                                        value={list.id}
                                                        onClick={
                                                            this.getAudioFeature
                                                        }
                                                        className="buttonShowAudioFeature"
                                                    >
                                                        Open - Close Audio
                                                        Feature
                                                    </button>
                                                    {this.state
                                                        .showAudioFeature ==
                                                        list.id && (
                                                        <div>
                                                            <AudioFeature
                                                                trackId={
                                                                    list.id
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                    <br />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Spring>
                )}
            </div>
        );
    }
}

// <TrackList />
//
// trackList={this.state.wholeIds}
// artistIdFormat={this.state.mappedArtistsIdFormat}
