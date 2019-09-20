# "Spotify-Related"

Spotify-Related was my final project built within 5 days at SPICED Academy - an onsite 12 weeks coding bootcamp in Berlin.

The SPA was built with React.js using Hooks and Redux, Node.js and Express.js, PostgreSQL.

Spotify-Related is a Website, where I wanted to make a public custom Playlist Generator that satisfies my taste as a music lover.

I wanted that the user gets on my Site with a specific Artist in mind and leaves with a playlist in his Spotify Account within minutes, which inherits all the Artists that are similar or "related" to the Artist given by the user.

For this process to work I had to work a lot with the Spotify API and learning and implementing an OAuth2 process on my site, in order to get an Access Token for the User Account in order to be able to create a Playlist in the users account.

I also wanted to display those valuable Informations Spotify provides for each Track.

#### The Data I was interested in from the "Audio Features" - Endpoint that Spotify provided

-   the Key and Tempo of every Song
-   the average Loudness
-   the Analysis Spotify makes for every Track

Especially the latter part was of high interested for me, since as a Sound Designer I was curious to see how and what Spotify stores about each track.

![The Login Process and Overview of Landing Page](readmegifs/Gif_1_640px_Login.gif)

## Getting Started

I deployed the website on Heroku. So no need for cloning the repo. _yay_
You just need to have your Spotify Logins ready for the OAuth process.

[Spotify Related on Heroku](https://www.spotifyrelated.herokuapp.com)

## Built With

### Frontend

-   React.js
-   [Victory.js](https://formidable.com/open-source/victory/) (for Data Visualization)
-   [React-Spring](https://www.react-spring.io/) (for Animations)
-   CSS3

### Backend

-   Node.js
-   Express.js
-   PostgreSQL
-   [Spotify-Web-API-Node](https://www.npmjs.com/package/spotify-web-api-node)
-   [Passport-Spotify](https://github.com/JMPerez/passport-spotify)

## The "Create Playlist" - Process

![Create Playlist - Process](readmegifs/Gif_1_640px_CreatePlaylist.gif)

### Displaying Audio Features from every Track from the created Playlist

![Showing the Data of each Track in created Playlist](readmegifs/Gif_1_640px_TrackListData.gif)

## Show Data of a specific Track from Spotify's "Audio Features" - Endpoint

![Getting Data of a specific Track - Process](readmegifs/Gif_1_640px_SingleData.gif)

## Authors

-   **Sven Kranz** - [SvenKranz1991](https://github.com/SvenKranz1991)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

-   Thank god for the really good documentation from Spotify. It was a really great resource, while developing.
