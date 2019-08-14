import React from "react";
import axios from "./axios";

export default class TrackList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("My Props in TrackList: ", this.props);
        let tracks = this.props.trackList;
        let artistIds = this.props.artistIdFormat;

        axios
            .get(`/tracklist`, {
                params: {
                    tracks: tracks,
                    artistIds: artistIds
                }
            })
            .then(result => {
                console.log("My Result in TrackList: ", result);
            });
    }
    render() {
        return (
            <div>
                <p>My Track List</p>
            </div>
        );
    }
}
