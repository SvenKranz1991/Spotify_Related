import React from "react";
import axios from "./axios";

export default class LoggedUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get("/access").then(result => {
            // console.log("LogmyAccesstoken: ", result.data.token);
            if (result.data.token == "") {
                location.replace("/");
            }

            if (result.data.user.email == "") {
                console.log("it is");
                result.data.user.email = "Please Reload Page and get Access";
                result.data.user.displayname =
                    "Please Reload Page and get Access";
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
                <p>Logged E-Mail: {this.state.email}</p>
            </div>
        );
    }
}

// <a
//     href={this.state.profileUrl}
//     target="_blank"
//     rel="noopener noreferrer"
// >
// </a>

// <img
//     src={this.state.photo}
//     className="profilePic"
//     height="100px"
//     width="100px"
// />
