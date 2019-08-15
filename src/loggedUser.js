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

            // if (result.data.user.spotify_id === "sven_kranz_bengun") {
            //     console.log("it is");
            //     result.data.user.spotify_id = "sven_kranz";
            //     result.data.user.displayname = "sven_kranz";
            // }

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
                <p>{this.state.email}</p>
                <a
                    href={this.state.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Profile
                </a>
                <img src={this.state.photo} height="100px" width="100px" />
                <br />
                <hr className="horiLine" />
                <ShowTopArtists />
            </div>
        );
    }
}
