# Musync

Musync is a fast, interactive command-line application that allows you to stream your Spotify playlists completely free by sourcing the official audio directly from YouTube. Say goodbye to Spotify ads and premium limitations.

Musync features an interactive CLI that gives you total control of your playback seamlessly right from your terminal without opening any browser or desktop app.

## Features

- **Zero-Setup Playback:** Paste any public Spotify Playlist URL to start playing immediately—no Spotify account or login required.
- **Optional Spotify Login:** Connect your own Spotify Developer App to securely fetch and play your private playlists by name.
- **Auto Dependency Management:** A smart setup wizard automatically installs yt-dlp and ffmpeg so you don't have to configure anything manually.
- **Interactive Playback UI:** Experience a fully dynamic Terminal UI that scales to your window width. Features a synchronized progress bar, real-time "Up Next" queue display, and a suite of interactive ASCII animations including a procedural fire visualizer that automatically reacts to the audio volume.
- **Advanced Command Mode:** Press `/` during playback to instantly jump to another track, search for a custom song, or manage your active playback queue by adding (`+`) or removing (`-`) tracks.
- **Standalone Binaries:** Download a single executable file and run it. No Node.js, npm, or npm install required.

## Spotify Modes & Limitations

Before installing, it is important to understand the two ways you can use Musync:

### 1. Zero-Setup Mode (No Login)
You can play any public Spotify playlist URL instantly without logging in. 
**Limitation:** Spotify explicitly limits public webpage scraping to exactly 100 tracks. If your playlist has more than 100 tracks, you will only be able to play the first 100.

### 2. Authenticated Mode (Recommended for large playlists)
If you want to play private playlists or playlists with more than 100 tracks, you must authenticate. Run `musync auth` to connect your Spotify account using a Developer App. This unlocks the official API pagination, allowing you to stream thousands of tracks and search your library by playlist name.

## Installation & Setup

### Method 1: The One-Line Installer (Mac & Linux)
The easiest way to install Musync globally so you can run it from anywhere. Open your terminal and paste this command:
```bash
curl -sL https://raw.githubusercontent.com/Saarthak1234/musync/main/install.sh | bash
```
(You may be prompted for your password to install it globally and to install system dependencies like ffmpeg).

### Method 2: Manual Download (Windows)
1. Go to the [Releases](https://github.com/Saarthak1234/musync/releases) page.
2. Download `musync-windows.exe`.
3. Open it! (You can also rename it to `musync.exe` and add it to your Windows Environment Variables Path to run it globally from command prompt).

### Method 3: Install via Source (For Developers)
Ensure you have Node.js (v18+) installed.
```bash
git clone <repo-url>
cd musync
npm install
npm link
musync
```

## Building Standalone Binaries (For Contributors)
We use [Bun](https://bun.sh) to compile this Node application into a standalone executable.
To compile the binaries for Mac, Windows, and Linux yourself, run:
```bash
npm run build:all
```
This will place the executable files inside the `dist/` folder.

## Usage

### 1. Play Public URLs (No Login Required)
You can play any public Spotify playlist directly using its URL without needing a Spotify account.
```bash
musync play "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
```

### 2. Search for a Specific Song (No Login Required)
You can directly search and stream any custom song.
```bash
musync search "Rick Astley Never Gonna Give You Up"
```

### 3. Authenticate with Spotify (For Private/Large Playlists)
To fetch your private playlists by name or bypass the 100-track limit, log in.
```bash
musync auth
```

### 4. List Your Playlists
List all the playlists currently saved in your Spotify library.
```bash
musync list
```

### 5. Play Your Playlists by Name
Start playing a specific playlist by name from your connected Spotify account.
```bash
musync play "My Awesome Playlist"
```

**Initial Playlist Prompt:** 
When you run the play command for a playlist, you will see a list of all tracks. You can then:
- Enter a specific **track number** to start playing from that song.
- Type `shuffle` (or `s`) to randomly shuffle the tracks.
- Press **Enter** to play normally from the beginning.

**Interactive Playback Controls:**
Once the player starts, you can control playback directly using your keyboard:
- **Spacebar:** Pause or resume playback.
- **c:** Cycle through different ASCII animations (Musync Logo, Fire, Cats, Developer Tools, Dynamic Track Title).
- **v:** Change the accent color of the ASCII animations.
- **+ / -:** Adjust the baseline speed and intensity of the ASCII animations.

**Command Mode (Queue & Search):**
Press `/` at any time during playback to open the command input prompt.
- **Jump/Search:** Type a number to jump to a playlist track, or type a song name to immediately interrupt playback and stream it.
- **Add to Queue:** Type `+ [song name]` to add a specific track to the "Up Next" queue. The queue works in both playlist mode and standalone search mode.
- **Remove from Queue:** Type `- [queue number]` or `- [song name]` to remove a track from the queue. Type just `-` to quickly remove the last added track.

## How It Works
1. Musync scrapes public Spotify URLs using `spotify-url-info` (or uses the Spotify API for private authenticated requests) to extract track names.
2. It passes the track titles and artist names to `yt-dlp`, which does a fast query for the official audio stream URL on YouTube.
3. `ffplay` streams the audio URL silently in the background, keeping connections alive with HTTP reconnect flags to bypass throttling.
4. Musync parses the `ffplay` audio engine output to display a perfectly synchronized progress bar and allows control via Node's `readline` keystroke listeners.

## License
MIT License.
