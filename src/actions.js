import axios from "./axios";

export async function getListOfLove() {
    // console.log("connected to action getDataForFriends");
    const list = await axios.get("/friends/getDataForFriends");
    // console.log("Data from front/getInfoForFriends: ", list);
    // console.log("Friendsdata: ", list.data.friendsdata.rows);
    return {
        type: "GET_DATA_FOR_FRIENDS",
        users: list.data.friendsdata.rows
    };
}

export async function acceptFriendship(id) {
    // console.log("connected to action acceptFriend");
    // console.log("Id for Accepting at action.js: ", id);
    const data = await axios.post(`/user/acceptFriendRequest/${id}.json`);
    console.log("Data for accepting Friend: ", data);
    return {
        type: "ACCEPT_FRIEND",
        id
    };
}

export async function declineFriendship(id) {
    // console.log("connected to action declineFriendship");
    // console.log("Id for declining at action.js: ", id);
    const data = await axios.post(`/user/declineFriendRequest/${id}.json`);
    console.log("Data for declining Friend: ", data);
    return {
        type: "DECLINE_FRIEND",
        id
    };
}

export function chatMessages(msgs) {
    // console.log("My msgs from actions: ", msgs);
    return {
        type: "GET_CHAT_MESSAGES",
        chatMessages: msgs
    };
}

export function chatMessage(msg) {
    // console.log("My msg from actions: ", msg);
    return {
        type: "GET_NEW_MESSAGE",
        chatMessage: msg
    };
}

// show Users online

export function showUsers(usersId) {
    // console.log("My Online users: ", usersId);
    let arr = [];
    arr.push(usersId);
    // console.log("MyNewArr", arr);
    return {
        type: "USERS_ONLINE",
        usersOnline: arr[0]
    };
}

// Get Friends of Friends

export async function getFriendsOfFriendsList(user) {
    const { data } = await axios.get(`/friendsOfFriends/${user}.json`);

    return {
        type: "FRIENDS_OF_FRIENDS_LIST",
        friendsList: data.friendsList.rows
    };
}

export async function getFriendstatus(user) {
    const { data } = await axios.get(`/friendstatus/${user}.json`);
    // console.log("Log My Friends Data", data.friendstatus.rows);

    return {
        type: "FRIENDSTATUS",
        friendStatus: data.friendstatus.rows
    };
}
