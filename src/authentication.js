import React, { useEffect } from "react";
import axios from "./axios";

export default function Authentication() {
    useEffect(() => {
        // axios.get("/auth/spotify").then(() => {
        console.log("Something went wrong!");
        //     location.replace("/app");
        // });
    }, []);
    return (
        <div className="Loggout">
            <h1>Something went wrong! Login again...</h1>
        </div>
    );
}
