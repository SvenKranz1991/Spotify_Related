import React from "react";
import axios from "./axios";
import AudioFeature from "./audioFeature.js";

export default class TrackRows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myList: [],
            showAudioFeature: ""
        };
        this.getAudioFeature = this.getAudioFeature.bind(this);
    }
    componentDidMount() {
        let tracks = this.props.trackList;
        let artistIds = this.props.artistIds;

        axios
            .get(`/tracklist`, {
                params: {
                    tracks: tracks,
                    artistIds: artistIds
                }
            })
            .then(result => {
                console.log("My Result in TrackList: ", result);
                // this.setState({
                //     trackInfoRows: result.data.formatTrackInfoList
                // });
                console.log(
                    "Log My Result for Tracklist: ",
                    result.data.formatTrackInfoList
                );
                this.setState({
                    myList: result.data.formatTrackInfoList
                });

                console.log(this.state);
            });
    }
    getAudioFeature(e) {
        console.log("My Target: ", e.target.value);
        let trackId = e.target.value;
        if (e.target.value == this.state.showAudioFeature) {
            this.setState({
                showAudioFeature: false
            });
        } else {
            this.setState({
                showAudioFeature: trackId
            });
            axios.get(`/audioFeature/${trackId}.json`).then(result => {
                console.log("My AudioFeature Result: ", result);
                this.setState({
                    trackId
                });
            });
        }
    }
    render() {
        return (
            <div className="className">
                <div className="trackListTitle">
                    <h3>Your Tracklist</h3>
                </div>

                <div className="trackListWrapper">
                    <div className="trackListLines">
                        {this.state.myList &&
                            this.state.myList.map(list => (
                                <div key={list.id}>
                                    <a
                                        href={list.linkToSpotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={list.trackImageLink}
                                            height="100px"
                                            width="100px"
                                        />
                                    </a>
                                    <p>Artist: {list.interpret}</p>
                                    <p>Name of Track: {list.name}</p>
                                    <p>Popularity: {list.popularity}</p>

                                    <button
                                        value={list.id}
                                        onClick={this.getAudioFeature}
                                        className="buttonShowAudioFeature"
                                    >
                                        Open - Close Audio Feature
                                    </button>

                                    {this.state.showAudioFeature == list.id && (
                                        <div>
                                            <span>
                                                <AudioFeature
                                                    trackId={list.id}
                                                />
                                            </span>
                                        </div>
                                    )}

                                    <br />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}
