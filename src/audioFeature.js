import React from "react";
import axios from "./axios";
import BarChartFeature from "./barChartFeature";

function digitIntoKey(int) {
    console.log("got digit");
    if (int == 1) {
        return "C/B♯";
    } else if (int == 2) {
        return "C♯/D♭";
    } else if (int == 3) {
        return "D";
    } else if (int == 4) {
        return "D♯/E♭";
    } else if (int == 5) {
        return "E";
    } else if (int == 6) {
        return "F";
    } else if (int == 7) {
        return "F♯/G♭";
    } else if (int == 8) {
        return "G";
    } else if (int == 9) {
        return "G♯/A♭";
    } else if (int == 10) {
        return "A";
    } else if (int == 11) {
        return "A♯/B♭";
    } else {
        return "B";
    }
}

function digitIntoMode(int) {
    console.log("got digit mode");
    if (int == 1) {
        return "Major";
    } else {
        return "Minor";
    }
}

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

                console.log(digitIntoMode(mode));
                console.log(digitIntoKey(key));

                let newMode = digitIntoMode(mode);
                let newKey = digitIntoKey(key);

                this.setState({
                    id: id,
                    acousticness: acousticness,
                    danceability: danceability,
                    energy: energy,
                    instrumentalness: instrumentalness,
                    key: newKey,
                    liveness: liveness,
                    loudness: loudness,
                    mode: newMode,
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
                    <p>
                        Key - {this.state.key} {this.state.mode}
                    </p>
                    <p>Beats per Minute - {this.state.tempo}</p>
                </div>
                <BarChartFeature
                    acousticness={this.state.acousticness}
                    danceability={this.state.danceability}
                    energy={this.state.energy}
                    instrumentalness={this.state.instrumentalness}
                    liveness={this.state.liveness}
                    speechiness={this.state.speechiness}
                    valence={this.state.valence}
                />
            </div>
        );
    }
}

// <p>Acousticness -{this.state.acousticness}</p>
// <p>Danceability - {this.state.danceability}</p>
// <p>Energy - {this.state.energy}</p>
// <p>Instrumentalness - {this.state.instrumentalness}</p>
// <p>Liveness - {this.state.liveness}</p>
// <p>Loudness - {this.state.loudness}</p>
// <p>Speechiness - {this.state.speechiness}</p>
// <p>Valence - {this.state.valence}</p>
