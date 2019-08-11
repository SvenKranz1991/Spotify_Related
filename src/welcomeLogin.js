import React from "react";
import axios from "./axios";

console.log("Log axios for sanity: ", axios);

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit() {
        console.log("Submitted!");

        axios.get("/login");
    }
    render() {
        return (
            <div>
                <br />
                <h1>Spotify Playlist Generator</h1>
                <br />
                <hr className="horiLine" />
                <br />
                <br />
                <button className="button" onClick={this.handleSubmit}>
                    Log In with Your Spotify Account
                </button>
                <br />
                <hr className="horiLine" />
            </div>
        );
    }
}
