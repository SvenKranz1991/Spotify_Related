import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import axios from "./axios";

console.log("Log axios for sanity: ", axios);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(e) {
        // this.setState({
        //     whatever: "something"
        // });
        // console.log("Check: ", this.state.whatever);
        console.log("e: ", e);
        console.log("NameState: ", this.state.artistName);
        let artistName = this.state.artistName;

        axios.get(`/artistName/${artistName}.json`);
        // .then(({ data }) => {
        //     console.log({ data });
        // })
        // .catch(err => {
        //     console.log("Error in getting ArtistName: ", err);
        // });
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
                <h1>Spotify Playlist Generator</h1>
                <br />
                <hr className="horiLine" />
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
