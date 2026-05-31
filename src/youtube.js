import YTDlpWrapModule from 'yt-dlp-wrap'
const YTDlpWrap = YTDlpWrapModule.default || YTDlpWrapModule
import chalk from 'chalk'
import ora from 'ora'
import { playStream } from './player.js'

const ytDlp = new YTDlpWrap()

export async function searchAndPlay(query) {
  const spinner = ora('  Finding on YouTube...').start()
  const searchQuery = `${query} lyric video`

  try {
    // search YouTube and get the best audio stream URL
    const output = await ytDlp.execPromise([
      `ytsearch1:${searchQuery}`,   // top 1 result
      '--get-url',            // just print the stream URL
      '--get-title',          // and the title
      '--get-duration',       // and the duration
      '-f', 'bestaudio/best', // audio only, best quality
      '--no-playlist',
      '--no-warnings',
    ])

    const lines     = output.trim().split('\n')
    const title     = lines[0]
    const streamUrl = lines[1]
    const durationStr = lines[2]

    let durationInSeconds = 0
    if (durationStr) {
      const parts = durationStr.split(':').map(Number)
      if (parts.length === 3) {
        durationInSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
      } else if (parts.length === 2) {
        durationInSeconds = parts[0] * 60 + parts[1]
      } else if (parts.length === 1) {
        durationInSeconds = parts[0]
      }
    }

    if (!streamUrl) {
      spinner.fail(chalk.red('  No stream found'))
      return
    }

    spinner.stop()
    console.log(chalk.gray(`  ▶ ${title}`))

    await playStream(streamUrl, durationInSeconds)
  } catch (err) {
    spinner.fail(chalk.red(`  YouTube error: ${err.message}`))
  }
}

import readline from 'readline'
import { stopCurrentStream, pauseCurrentStream, resumeCurrentStream } from './player.js'

export async function searchCommand(query) {
  console.log(chalk.bold(`\n  🔍 Searching: ${query}\n`))

  let isPaused = false
  readline.emitKeypressEvents(process.stdin)
  if (process.stdin.isTTY) process.stdin.setRawMode(true)
  process.stdin.resume()

  const handleInput = (str, key) => {
    if ((key.ctrl && key.name === 'c') || key.name === 'q') {
      stopCurrentStream()
      process.exit(0)
    } else if (key.name === 's' || key.name === 'space') {
      if (isPaused) {
        resumeCurrentStream()
        isPaused = false
      } else {
        pauseCurrentStream()
        isPaused = true
      }
    }
  }

  process.stdin.on('keypress', handleInput)
  
  console.log(chalk.gray('  Controls:'))
  console.log(chalk.gray('  [Space] Pause/Resume  [q/Ctrl+C] Quit\n'))

  await searchAndPlay(query)

  process.stdin.off('keypress', handleInput)
  if (process.stdin.isTTY) process.stdin.setRawMode(false)
  process.stdin.pause()
}