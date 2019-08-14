let tracklist = [];
console.log("Tracklist: ", tracklist);

let newTrackList = tracklist.map(track => {
    let slicedTrackName = track.slice(0, 13);

    return slicedTrackName;
});

console.log("NewTrackList: ", newTrackList);
