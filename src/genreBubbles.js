import React, { useState, useEffect } from "react";

export default function RelatedArtists(props) {
    const [genres, setGenres] = useState();
    let genreBubbles = props;

    let i = 0;

    function generateKey() {
        return i++;
    }

    useEffect(() => {
        let newArray = genreBubbles.genres.map(eachBubble => {
            let id = generateKey();

            let gen = { genre: eachBubble };

            return { id, gen };
        });

        console.log("My new Genre Array: ", newArray);

        setGenres(newArray);
    }, []);

    // console.log("My props in Genres: ", genres);

    return (
        <div className="relatedArtistsWrapper">
            <p>Genres:</p>
            {genres &&
                genres.map(bubble => (
                    <div key={bubble.id}>
                        <a
                            href={"https://lmgtfy.com/?q=" + bubble.gen.genre}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p>{bubble.gen.genre}</p>
                        </a>
                    </div>
                ))}
        </div>
    );
}
