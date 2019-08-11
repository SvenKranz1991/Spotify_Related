import React, { useEffect } from "react";
import axios from "./axios";

export default function Logout() {
    useEffect(() => {
        axios.post("/logout").then(() => {
            console.log("LoggedOut");
            location.replace("/welcome");
        });
    }, []);
    return (
        <div className="Loggout">
            <h1>Logging out!</h1>
        </div>
    );
}
