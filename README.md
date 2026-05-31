# Musync 🎵

Musync is a fast, interactive command-line application that allows you to stream your Spotify playlists completely free by sourcing the official audio directly from YouTube. Say goodbye to Spotify ads and premium limitations! 

Musync features an interactive CLI that gives you total control of your playback seamlessly right from your terminal without opening any browser or desktop app.

## Features ✨

- **Authenticate with Spotify:** Uses official Spotify OAuth to log in securely and fetch your personal playlists.
- **Fetch from Spotify, Play from YouTube:** Automatically resolves your Spotify tracks and plays the highest quality audio streams from YouTube.
- **Interactive Playback UI:** Lists all your tracks and allows you to jump directly to any track number.
- **Keyboard Controls:** Once playback starts, control the stream using native terminal keystrokes:
  - `[Space] / s` : Pause and Resume
  - `[n] / Right Arrow` : Skip to Next Track
  - `[p] / Left Arrow` : Go back to Previous Track
  - `[r]` : Reshuffle the remaining playlist
  - `[q] / Ctrl+C` : Quit Musync
- **Shuffle Mode:** Shuffle your playlists locally before starting.
- **Updated API Support:** Fully supports Spotify's recent API changes (such as the new `/items` endpoints).

## Prerequisites 🛠️

Before installing, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **ffmpeg & ffplay**: Used for native background audio playback.
  - *macOS*: `brew install ffmpeg`
  - *Linux*: `sudo apt install ffmpeg`
  - *Windows*: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **Spotify Developer App**: You need a Spotify Client ID and Secret to run your own local OAuth server.

## Setup & Installation 🚀

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repo-url>
   cd musync
   npm install
   ```

2. **Link the CLI locally:**
   ```bash
   npm link
   ```
   *This allows you to run the `musync` command from anywhere in your terminal.*

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying the `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Spotify Developer credentials in the `.env` file:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
   ```

## Usage 🎶

### Authentication
Authenticate with your Spotify account. This will open a browser window for secure OAuth login.
```bash
musync auth
```

### List Playlists
List all the playlists currently saved in your Spotify library along with their exact track counts.
```bash
musync list
```

### Play Music
Start playing a specific playlist by name.
```bash
musync play "Playlist Name"
```
**Interactive Prompt:** 
When you run the play command, you will see a list of all tracks. You can then:
- Enter a specific **track number** to start playing from that song.
- Type `shuffle` (or `s`) to randomly shuffle the tracks.
- Press **Enter** to play normally from the beginning.

**CLI Options:**
- Play and instantly shuffle without waiting for the prompt:
  ```bash
  musync play "Playlist Name" --shuffle
  ```

### Logout
Clear your saved tokens and session data.
```bash
musync logout
```

## How It Works ⚙️
1. Musync uses `spotify-web-api-node` and native `fetch` API commands to securely query the user's Spotify Library.
2. It parses the playlist details (using the modernized Spotify `/items` endpoint structures).
3. It passes the track titles and artist names to `yt-dlp`, which does a fast query for the official audio stream URL on YouTube.
4. `ffplay` streams the audio URL silently in the background, piping playback controls directly through Node's `readline` keypress listeners.

## License
MIT License.
