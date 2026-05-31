import { spawn } from 'child_process'
import chalk from 'chalk'
import { platform } from 'os'
import { tui } from './tui.js'

const OS = platform()

let currentPlayer = null;
let isPaused = false;
let intentionallyPaused = false;
let isProgressBarSuspended = false;
let elapsedTime = 0;
let totalDuration = 0;
let currentUrl = null;
let resolvePlayPromise = null;

function formatTime(sec) {
  if (isNaN(sec) || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function suspendProgressBar() {
  isProgressBarSuspended = true;
}

export function resumeProgressBar() {
  isProgressBarSuspended = false;
}

function startFfplay(url, startTime) {
  const args = [
    '-nodisp',
    '-autoexit',
    '-loglevel', 'info', // Use info to get stderr progress logs
    '-reconnect', '1',
    '-reconnect_streamed', '1',
    '-reconnect_delay_max', '5'
  ];
  if (startTime > 0) {
    args.push('-ss', startTime.toString());
  }
  args.push(url);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

  // Bind stderr to pipe so we can parse actual playback progress
  currentPlayer = spawn('ffplay', args, { stdio: ['ignore', 'ignore', 'pipe'] });

  currentPlayer.stderr.on('data', (data) => {
    if (isPaused) return;

    const str = data.toString();
    const chunks = str.split('\r');
    for (const chunk of chunks) {
      const match = chunk.match(/\s*(\d+\.\d+)\s+M-A:/) || chunk.match(/\s*(\d+\.\d+)\s+A-V:/);
      if (match && totalDuration > 0) {
        const currentSeconds = parseFloat(match[1]);
        if (!isNaN(currentSeconds)) {
          elapsedTime = Math.max(elapsedTime, currentSeconds);
          if (elapsedTime > totalDuration) elapsedTime = totalDuration;

          if (!isProgressBarSuspended) {
            const progress = (elapsedTime / totalDuration) * 100;
            tui.updateState({
              progressPercent: progress,
              timeString: `${formatTime(elapsedTime)} / ${formatTime(totalDuration)}`
            });
            tui.render();
          }
        }
      }
    }
  });

  currentPlayer.on('close', (code) => {
    if (intentionallyPaused) {
      return; // We killed it just to pause
    }
    if (currentPlayer === currentPlayer) currentPlayer = null;
    cleanupAndResolve();
  });

  currentPlayer.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.log(chalk.red(
        '\n  ffplay not found. Please install ffmpeg:\n' +
        (OS === 'darwin' ? '  brew install ffmpeg\n' :
         OS === 'linux'  ? '  sudo apt install ffmpeg\n' :
                           '  https://ffmpeg.org/download.html\n')
      ));
    }
    cleanupAndResolve();
  });
}

function cleanupAndResolve() {
  if (resolvePlayPromise) {
    resolvePlayPromise();
    resolvePlayPromise = null;
  }
}

export function playStream(url, duration) {
  return new Promise((resolve, reject) => {
    currentUrl = url;
    totalDuration = duration || 0;
    elapsedTime = 0;
    isPaused = false;
    intentionallyPaused = false;
    resolvePlayPromise = resolve;

    startFfplay(url, 0);
  });
}

export function stopCurrentStream() {
  intentionallyPaused = false;
  if (currentPlayer) currentPlayer.kill('SIGKILL');
}

export function pauseCurrentStream() {
  if (currentPlayer && !isPaused) {
    intentionallyPaused = true;
    isPaused = true;
    currentPlayer.kill('SIGKILL');
  }
}

export function resumeCurrentStream() {
  if (isPaused) {
    intentionallyPaused = false;
    isPaused = false;
    if (currentUrl) {
      startFfplay(currentUrl, elapsedTime);
    }
  }
}