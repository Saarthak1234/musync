# Musync 🎵

Musync is a fast, interactive command-line application that allows you to stream your Spotify playlists completely free by sourcing the official audio directly from YouTube. Say goodbye to Spotify ads and premium limitations! 

Musync features an interactive CLI that gives you total control of your playback seamlessly right from your terminal without opening any browser or desktop app.

## Features ✨

- **Zero-Setup Playback:** Paste any public Spotify Playlist URL to start playing immediately—no Spotify account or login required!
- **Optional Spotify Login:** Connect your own Spotify Developer App to securely fetch and play your private playlists by name.
- **Auto Dependency Management:** A smart setup wizard automatically installs `yt-dlp` and `ffmpeg` so you don't have to configure anything manually!
- **Interactive Playback UI:** Lists all your tracks and displays an accurate real-time progress bar synced to the audio engine.
- **Command Mode (Jump & Search):** Press `/` during playback to instantly jump to another track number or type a custom song name to play it mid-playlist.
- **Standalone Binaries:** Download a single executable file and run it. No Node.js, `npm`, or `npm install` required!

## Installation & Setup 🚀

### Method 1: The One-Line Installer (Mac & Linux)
The easiest way to install Musync globally so you can run it from anywhere. Open your terminal and paste this command:
```bash
curl -sL https://raw.githubusercontent.com/saarthakagarwal0408/musync/main/install.sh | bash
```
*(You may be prompted for your password to install it globally).*

### Method 2: Manual Download (Windows)
1. Go to the [Releases](https://github.com/saarthakagarwal0408/musync/releases) page.
2. Download `musync-windows.exe`.
3. Open it! (You can also rename it to `musync.exe` and add it to your Windows Environment Variables Path to run it globally from command prompt).

### Method 2: Install via Source (For Developers)
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

## Usage 🎶

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

### 3. Authenticate with Spotify (For Private Playlists)
To fetch your private playlists by name, you can log in. (You must complete the Developer App setup in the setup wizard first).
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
**Interactive Prompt:** 
When you run the play command, you will see a list of all tracks. You can then:
- Enter a specific **track number** to start playing from that song.
- Type `shuffle` (or `s`) to randomly shuffle the tracks.
- Press **Enter** to play normally from the beginning.

## How It Works ⚙️
1. Musync scrapes public Spotify URLs using `spotify-url-info` (or uses the Spotify API for private authenticated requests) to extract track names.
2. It passes the track titles and artist names to `yt-dlp`, which does a fast query for the official audio stream URL on YouTube.
3. `ffplay` streams the audio URL silently in the background, keeping connections alive with HTTP reconnect flags to bypass throttling.
4. Musync parses the `ffplay` audio engine output to display a perfectly synchronized progress bar and allows control via Node's `readline` keystroke listeners.

## License
MIT License.
