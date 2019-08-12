import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import reducer from "./reducers";
import Authentication from "./authentication";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

if (location.pathname == "/app") {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
} else {
    elem = <Authentication />;
}

ReactDOM.render(elem, document.querySelector("main"));
