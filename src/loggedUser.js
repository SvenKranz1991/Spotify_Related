import React from "react";
import axios from "./axios";
import ShowTopArtists from "./showTopArtists";

export default class LoggedUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get("/access").then(result => {
            console.log("LogmyAccesstoken: ", result.data.token);
            if (result.data.token == "") {
                location.replace("/");
            }
            this.setState({
                token: result.data.token,
                spotify_id: result.data.user.spotify_id,
                displayname: result.data.user.displayname,
                email: result.data.user.email,
                profileUrl: result.data.user.profileurl,
                photo: result.data.user.photo
            });
        });
    }
    render() {
        return (
            <div className="userProfile">
                <hr className="horiLine" />
                <br />
                <h2>USER INFO</h2>
                <p>
                    Spotify Id: {this.state.spotify_id} --- E-Mail:{" "}
                    {this.state.email} --- Profile Url: {this.state.profileUrl}
                </p>
                <img src={this.state.photo} height="100px" width="100px" />
                <br />
                <hr className="horiLine" />
                <ShowTopArtists />
            </div>
        );
    }
}
