# "Spotify-Related"

Spotify-Related is a SPA / Website, where I wanted to make a Custom Playlist Generator that satisfies my taste as a music lover.

I also wanted to display those valuable Informations Spotify provides for each Track.
like
...the Key and Tempo of every Song
...the average Loudness
...the analysis Spotify makes for every Track

Especially the data was of high interested for me, since as a Sound Designer I was curious to see how and what Spotify stores about each track.

![The Login Process and Overview of Landing Page](readmegifs/Gif_1_640px_Login.gif)

## Getting Started

I deployed the website on Heroku. So no need for cloning the repo. _yay_
You just need to have your Spotify Logins ready for the OAuth process.

```
spotifyrelated.herokuapp.com
```

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

->![Create Playlist - Process](readmegifs/Gif_1_640px_CreatePlaylist.gif)<-

## Displaying Audio Features from every Track from the created Playlist

->![Showing the Data of each Track in created Playlist](readmegifs/Gif_1_640px_TrackListData.gif)<-

### Show Data of a specific Track from Spotify's "Audio Features" - Endpoint

->![Getting Data of a specific Track - Process](readmegifs/Gif_1_640px_SingleData.gif)<-

## Authors

-   **Sven Kranz** - [SvenKranz1991](https://github.com/SvenKranz1991)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

-   Thank god for the really good documentation from Spotify. It was a really great resource, while developing.
