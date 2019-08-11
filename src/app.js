import React from "react";
import axios from "./axios";

console.log("Log axios for sanity: ", axios);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        axios.get("/access").then(result => {
            console.log("LogmyAccesstoken: ", result.data.token);
            console.log("My Result: ", result);
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
    handleSubmit() {
        // curl -X GET "https://api.spotify.com/v1/search?q=tania%20bowra&type=artist" -H "Authorization: Bearer {your access token}"
        console.log("NameState: ", this.state.artistName);
        let artistName = this.state.artistName;
        let url = `https://api.spotify.com/v1/search?q=${artistName}&type=artist`;
        // axios.get(`/artistName/${artistName}.json`);
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.state.token}`
            }
        })
            .then(data => {
                console.log("logmydata: ", data);
            })
            .catch(err => {
                console.log("Error in getting Data: ", err);
            });
    }
    handleChange(e) {
        console.log("e: ", e.target.name, e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    render() {
        return (
            <div>
                <br />
                <br />
                <h1>Spotify Playlist Generator</h1>
                <p>Spotify Id: {this.state.spotify_id}</p>
                <p>E-Mail: {this.state.email}</p>
                <p>Profile Url: {this.state.profileUrl}</p>
                <img src={this.state.photo} height="50px" width="50px" />
                <br />
                <hr className="horiLine" />
                <br />
                <h2>Create a Playlist out of a Seed!</h2>
                <br />
                <input
                    type="text"
                    placeholder="Artist Name"
                    name="artistName"
                    className="textInput"
                    onChange={this.handleChange}
                />
                <br />
                <button className="button" onClick={this.handleSubmit}>
                    Click me to make Ajax Request
                </button>
                <br />
                <hr className="horiLine" />
                <h3>Output should show below!</h3>
            </div>
        );
    }
}
