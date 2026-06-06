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
The easiest way to install Musync globally on macOS and Linux. Open your terminal and paste this command:
```bash
curl -sL https://raw.githubusercontent.com/Saarthak1234/musync/main/install.sh | bash
```
*(You may be prompted for your password to copy the binary globally and to install ffmpeg/yt-dlp automatically)*.

### Method 2: The One-Line Installer (Windows)
The easiest way to install Musync globally on Windows.

* **Option A: If using PowerShell:**
  ```powershell
  irm https://raw.githubusercontent.com/Saarthak1234/musync/main/install.ps1 | iex
  ```

* **Option B: If using standard Command Prompt (cmd.exe):**
  ```cmd
  powershell -Command "irm https://raw.githubusercontent.com/Saarthak1234/musync/main/install.ps1 | iex"
  ```
*(This automatically downloads the latest compiled binary, creates a safe home folder, and sets up your User PATH environment variables automatically)*.

### Method 3: Manual Binary Download
If you prefer to download standalone binaries directly without running installers:
1. Go to the [Releases](https://github.com/Saarthak1234/musync/releases) page.
2. Download the binary for your platform (`musync-mac-arm`, `musync-mac-intel`, `musync-windows.exe`, or `musync-linux`).
3. Move the binary into your system's PATH folder (such as `/usr/local/bin` on Mac/Linux or your environment variable path on Windows).

### Method 4: Install via Source (For Developers)
Ensure you have Node.js (v18+) installed.
```bash
git clone https://github.com/Saarthak1234/musync.git
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
To fetch your private playlists by name or bypass the 100-track limit, you must connect your own Spotify Developer App.

**How to get your credentials:**
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in with your Spotify account and click **Create app**.
3. Fill in the required fields (App Name, Description).
4. For **Redirect URI**, you MUST enter exactly: `http://127.0.0.1:8888/callback` (Make sure to click "Add").
5. Check the box for "Web API", accept the terms, and click **Save**.
6. On your app's dashboard, click **Settings**.
7. Copy your **Client ID** and **Client Secret**.

Run the following command to begin the interactive login process:
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

### 6. View All Tracks in a Playlist
Want to just see what songs are inside a playlist before playing it? You can print out the entire tracklist!
```bash
musync view "My Awesome Playlist"
```

### 7. Developer Mode (Split-Screen Terminal)
Want to run terminal commands while listening to music? Musync can automatically wrap your session in `tmux` to provide a flawless split-screen environment. The music plays on top, and your normal interactive shell (`bash`/`zsh`) runs perfectly at the bottom.

**For Playlists:**
```bash
musync dev "My Awesome Playlist"
```

**For Single Songs:**
```bash
musync dev-search "Rick Astley Never Gonna Give You Up"
```

*(Note: Requires `tmux`. If not installed, Musync will attempt to auto-install it via `brew` or `apt`. This feature is natively supported on macOS and Linux. For Windows, you must run Musync inside WSL or Git Bash to use Dev Mode).*

**Navigating Dev Mode:**
- **Switch Windows:** You can click the top/bottom window with your mouse, or press `Ctrl + B` then `Up` or `Down` arrows.
- **Send to Background:** Press `Ctrl + B` then `d` to detach. The UI disappears and your terminal returns to normal, but the music keeps playing in the background! Bring the UI back anytime by typing `tmux attach`.
- **Exit Normal Way:** Click the bottom terminal and type `exit` (or press `Ctrl + D`). Click the top player and press `q`.
- **Force Kill:** Press `Ctrl + B` then `&`, and press `y` to confirm.

**Initial Playlist Prompt:** 
When you run the play command for a playlist, you will see a list of all tracks. You can then:
- Enter a specific **track number** to start playing from that song.
- Type `shuffle` (or `s`) to randomly shuffle the tracks.
- Press **Enter** to play normally from the beginning.

**Interactive Playback Controls:**
Once the player starts, you can control playback directly using your keyboard:
- **Spacebar:** Pause or resume playback.
- **n / p (or Left/Right Arrows):** Skip to the next or previous track.
- **l:** Toggle Loop mode to continuously repeat the current song. (Note: Skips will restart the current song when loop is active).
- **c:** Cycle through different ASCII animations (Musync Logo, Fire, Retro Equalizer, Starfield, Oscilloscope, 3D Cube, Cats, Developer Tools, Dynamic Track Title).
- **v:** Change the accent color of the ASCII animations.
- **+ / -:** Adjust the baseline speed and intensity of the ASCII animations (Speed Level 1-10).

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
