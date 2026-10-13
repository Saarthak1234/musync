# Musync

Musync is a fast, interactive music player that lives in your terminal. Search for any song and start streaming instantly, build a queue on the fly, and watch real-time ASCII visualizers react to your music, all without leaving the command line.

Already have playlists you love? Musync also supports **Spotify playlists**, so you can bring your existing library straight into your terminal.

---

## Demo

<a href="https://www.loom.com/share/6dfb90f40ee64fec80bdf972b0284b78">
  <img src="https://www.loom.com/v1/videos/6dfb90f40ee64fec80bdf972b0284b78/thumbnail.gif" alt="Musync demo video" width="100%">
</a>

▶️ **[Watch the full demo on Loom](https://www.loom.com/share/6dfb90f40ee64fec80bdf972b0284b78)**

---

## Features

- **Search & Play Anything:** Search for any song by name and start streaming it instantly. No account or login required.
- **Interactive Playback UI:** A fully dynamic Terminal UI that scales to your window width, with a synchronized progress bar, a real-time "Up Next" queue display, and a suite of interactive ASCII animations, including a procedural fire visualizer that reacts to the audio volume.
- **Advanced Command Mode:** Press `/` during playback to jump to another track, search for a new song, or manage your queue by adding (`+`) or removing (`-`) tracks.
- **Developer Mode:** Split your terminal with `tmux` so music plays on top while you keep working in your shell below.
- **Spotify Playlist Support:** Play any public Spotify playlist by pasting its URL, or connect your own Spotify Developer App to load your private playlists by name.
- **Auto Dependency Management:** A setup wizard automatically installs `yt-dlp` and `ffmpeg`, so there's nothing to configure manually.
- **Standalone Binaries:** Download a single executable and run it. No Node.js, npm, or `npm install` required.

---

## Installation & Setup

### Method 1: The One-Line Installer (Mac & Linux)
The easiest way to install Musync globally on macOS and Linux. Open your terminal and paste this command:
```bash
curl -sL https://raw.githubusercontent.com/Saarthak1234/musync/main/install.sh | bash
```
*(You may be prompted for your password to copy the binary globally and to install ffmpeg/yt-dlp automatically.)*

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
*(This automatically downloads the latest compiled binary, creates a safe home folder, and sets up your User PATH environment variables.)*

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

---

## Usage

### 1. Search and Play a Song
Search for any song by name and start streaming it right away.
```bash
musync search "Rick Astley Never Gonna Give You Up"
```

### 2. Play a Spotify Playlist by URL (No Login Required)
Paste any public Spotify playlist URL to start playing it.
```bash
musync play "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
```

### 3. Developer Mode (Split-Screen Terminal)
Want to run terminal commands while listening to music? Musync can wrap your session in `tmux` to give you a split-screen environment. The music plays on top, and your normal interactive shell (`bash`/`zsh`) runs at the bottom.

**For Single Songs:**
```bash
musync dev-search "Rick Astley Never Gonna Give You Up"
```

**For Playlists:**
```bash
musync dev "My Awesome Playlist"
```

*(Note: Requires `tmux`. If it isn't installed, Musync will attempt to auto-install it via `brew` or `apt`. Dev Mode is natively supported on macOS and Linux. On Windows, run Musync inside WSL or Git Bash to use it.)*

**Navigating Dev Mode:**
- **Switch Windows:** Click the top/bottom window with your mouse, or press `Ctrl + B` then `Up` or `Down`.
- **Send to Background:** Press `Ctrl + B` then `d` to detach. The UI disappears and your terminal returns to normal, but the music keeps playing. Bring the UI back anytime by typing `tmux attach`.
- **Exit Normally:** Click the bottom terminal and type `exit` (or press `Ctrl + D`). Click the top player and press `q`.
- **Force Kill:** Press `Ctrl + B` then `&`, and press `y` to confirm.

---

## Playback Controls

**Initial Playlist Prompt:**
When you play a playlist, you'll see a list of all its tracks. You can then:
- Enter a **track number** to start playing from that song.
- Type `shuffle` (or `s`) to shuffle the tracks.
- Press **Enter** to play from the beginning.

**Keyboard Controls:**
- **Spacebar:** Pause or resume playback.
- **n / p (or Left/Right Arrows):** Skip to the next or previous track.
- **l:** Toggle Loop mode to repeat the current song. (Skips restart the current song while loop is active.)
- **c:** Cycle through ASCII animations (Musync Logo, Fire, Retro Equalizer, Starfield, Oscilloscope, 3D Cube, Cats, Developer Tools, Dynamic Track Title).
- **v:** Change the accent color of the ASCII animations.
- **+ / -:** Adjust the speed and intensity of the ASCII animations (Speed Level 1–10).

**Command Mode (Queue & Search):**
Press `/` at any time during playback to open the command prompt.
- **Jump/Search:** Type a number to jump to a playlist track, or type a song name to start streaming it immediately.
- **Add to Queue:** Type `+ [song name]` to add a track to the "Up Next" queue. The queue works in both playlist mode and search mode.
- **Remove from Queue:** Type `- [queue number]` or `- [song name]` to remove a track. Type just `-` to remove the last added track.

---

## Spotify Playlist Support

Musync can load playlists from Spotify in two ways.

### 1. Public Playlists (No Login)
Paste any public Spotify playlist URL and start playing instantly.
**Note:** Spotify limits public playlist pages to the first 100 tracks, so larger playlists will only load their first 100 songs in this mode.

### 2. Connected Account (Private & Large Playlists)
Connect your own Spotify Developer App to load private playlists by name and play playlists of any size through the official API.

**How to get your credentials:**
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in with your Spotify account and click **Create app**.
3. Fill in the required fields (App Name, Description).
4. For **Redirect URI**, you MUST enter exactly: `http://127.0.0.1:8888/callback` (Make sure to click "Add").
5. Check the box for "Web API", accept the terms, and click **Save**.
6. On your app's dashboard, click **Settings**.
7. Copy your **Client ID** and **Client Secret**.

Then run the interactive login:
```bash
musync auth
```

**Once connected:**

List all the playlists in your Spotify library:
```bash
musync list
```

Play a playlist by name:
```bash
musync play "My Awesome Playlist"
```

View every track in a playlist without playing it:
```bash
musync view "My Awesome Playlist"
```

---

## How It Works

1. **Track lookup:** For searches, Musync uses the song name you type. For Spotify playlists, it reads track names from the public playlist page using `spotify-url-info`, or from the Spotify API when you're connected.
2. **Audio sourcing:** Track titles and artist names are passed to `yt-dlp`, which finds the matching official audio stream.
3. **Playback engine:** `ffplay` streams the audio in the background, using HTTP reconnect flags to keep playback stable.
4. **Terminal UI:** Musync parses `ffplay`'s output to drive a synchronized progress bar, and listens for keystrokes through Node's `readline` for real-time controls.

---

## Building Standalone Binaries (For Contributors)
Musync uses [Bun](https://bun.sh) to compile the Node application into standalone executables.
To compile the binaries for Mac, Windows, and Linux yourself, run:
```bash
npm run build:all
```
The executables will be placed in the `dist/` folder.

---

## License
MIT License.
