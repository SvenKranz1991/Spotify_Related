import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";

console.log("Log axios for sanity: ", axios);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <br />
                <h1>Spotify Playlist Generator</h1>
                <br />
                <hr className="horiLine" />
                <br />

                <input
                    type="text"
                    placeholder="Artist Name"
                    className="textInput"
                />
                <br />
                <button className="button">
                    Click me to make Ajax Request
                </button>
                <br />
                <hr className="horiLine" />
                <h3>Output should show below!</h3>
            </div>
        );
    }
}
