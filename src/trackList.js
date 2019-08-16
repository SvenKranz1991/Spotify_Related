import React from "react";
import axios from "./axios";
import TrackRows from "./trackRows";

export default class TrackList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackInfoRows: []
        };
    }
    componentDidMount() {
        console.log("My Props in TrackList: ", this.props);
        let tracks = this.props.trackList;
        let artistIds = this.props.artistIdFormat;

        // axios
        //     .get(`/tracklist`, {
        //         params: {
        //             tracks: tracks,
        //             artistIds: artistIds
        //         }
        //     })
        //     .then(result => {
        //         console.log("My Result in TrackList: ", result);
        //         this.setState({
        //             trackInfoRows: result.data.formatTrackInfoList
        //         });
        //     });
    }
    render() {
        return (
            <div>
                <TrackRows
                    artistIds={this.props.artistIdFormat}
                    tracks={this.props.trackList}
                />
            </div>
        );
    }
}
