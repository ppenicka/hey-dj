# Hey DJ (what's that song?)
Web app that performs tracklist recognition in DJ sets through the ACRCloud music recognition API. You give it a recorded DJ set, it gives you a list of tracks that the DJ played during the set.

# How it Works

1. User provides a recorded DJ set either through a file upload or YouTube link.

2. Set gets uploaded to the server from client, or downloaded to the server from YouTube.

3. Multiple 12 second segments get extracted from the set in an interval specified by the `SEGMENT_INTERVAL` environment variable

4. Each segment gets sent to the ACRCloud API for identification

5. Once a response is received for all segments, a second attempt is performed for segments that were not successfully identified in the first run. New segments are extracted for the second attempt at original time plus half of HEY_DJ_INTERVAL, i.e. approximately in the middle between the original two segments.

6. Results are pruned of duplicate results, stored in persistent cache for future identical requests, and sent back to the client.

7. Client renders a tracklist, displaying track name, artist and links to 3rd party services when available (Spotify, YouTube, Deezer and MusicBrainz).

# Tech Stack

The application is utilizes the following technologies:

- **React** for front-end
- **Express** for back-end server
- **MongoDB** for persistent caching of results
- **Mongoose** for interaction between server and DB
- **FFMPEG** for audio file manipulation
- **ACRCloud API** for recognition of extracted audio segments
- **youtube-mp3-downloader** for downloading audio tracks from youtube videos

# Installation

This prodcedure describes how to launch the application in a development or testing environment, with client and server on the same machine. In production environments the client and server would be deployed on different machines.

1. Clone the repository.

2. Run `npm install` in both *server* and *client* directories.

3. Registered with [ACRCloud](https://www.acrcloud.com/).

4. Log in to [ACRCloud Console](https://console.acrcloud.com/) and navigate to *Project -> Audio & Video Recognition*. Set up a project with the following settings:

- *Audio Source*: Recorded Audio
- *Enable 3rd Party ID Integration*: enabled

5. Set up the following environment variables in your environment, or create a *server/.env* file and specify them in the file:

- `ACCESS_KEY`: ACRCloud project access key
- `ACCESS_SECRET`: ACRCloud project secret key
- `HOST`: ACRCloud project host URL
- `DB_URL`: URL of your MongoDB instance, including database name (e.g. *mongodb:localhost:27017/hey-dj*)
- `PORT`: port number on which the server should run
- `SEGMENT_INTERVAL`:

6. Launch MongoDB.

7. Launch the server by running `node index.js` inside the *server* directory.

8. Launch the client by running `npm start` inside the *client* directory.

9. Enjoy!
