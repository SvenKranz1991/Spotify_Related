import React from "react";
import axios from "./axios";

export default class AudioFeature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        let trackId = this.props.trackId;
        axios
            .get(`/audioFeature/${trackId}.json`)
            .then(result => {
                console.log("My AudioFeature Result: ", result);

                let {
                    id,
                    acousticness,
                    danceability,
                    energy,
                    instrumentalness,
                    key,
                    liveness,
                    loudness,
                    mode,
                    speechiness,
                    tempo,
                    time_signature,
                    uri,
                    valence
                } = result.data.data;

                this.setState({
                    id: id,
                    acousticness: acousticness,
                    danceability: danceability,
                    energy: energy,
                    instrumentalness: instrumentalness,
                    key: key,
                    liveness: liveness,
                    loudness: loudness,
                    mode: mode,
                    speechiness: speechiness,
                    tempo: tempo,
                    time_signature: time_signature,
                    uri: uri,
                    valence: valence
                });
            })
            .catch(err => {
                console.log("Error in getting Features: ", err);
            });
    }

    render() {
        return (
            <div className="playlistsWrapper">
                <h3>Audio Feature</h3>
                <a
                    href={this.state.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Link to Track
                </a>
                <div>
                    <p>Acousticness -{this.state.acousticness}</p>
                    <p>Popularity - {this.state.danceability}</p>
                    <p>Energy - {this.state.energy}</p>
                    <p>Instrumentalness - {this.state.instrumentalness}</p>
                    <p>Liveness - {this.state.liveness}</p>
                    <p>Loudness - {this.state.loudness}</p>
                    <p>Speechiness - {this.state.speechiness}</p>
                    <p>Valence - {this.state.valence}</p>
                    <p>Beats per Minute - {this.state.tempo}</p>
                </div>
            </div>
        );
    }
}
