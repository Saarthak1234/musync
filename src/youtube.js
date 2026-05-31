import YTDlpWrapModule from 'yt-dlp-wrap'
const YTDlpWrap = YTDlpWrapModule.default || YTDlpWrapModule
import chalk from 'chalk'
import ora from 'ora'
import { playStream } from './player.js'
import { tui } from './tui.js'

const ytDlp = new YTDlpWrap()

export async function searchAndPlay(query, isStandalone = false) {
  let spinner;
  if (!isStandalone) {
    // Playlist mode: just set title
    tui.updateState({ title: 'Searching YouTube...', artist: '' })
    tui.render()
  } else {
    // Single search mode: use standard CLI spinner
    spinner = ora('  Finding on YouTube...').start()
  }

  const searchQuery = query

  try {
    const output = await ytDlp.execPromise([
      `ytsearch1:${searchQuery}`,   
      '--get-url',            
      '--get-title',          
      '--get-duration',       
      '-f', 'bestaudio/best', 
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
      if (spinner) spinner.fail(chalk.red('  No stream found'))
      return
    }

    if (spinner) spinner.stop()
    
    if (!isStandalone) {
      tui.updateState({ title, artist: '' })
      tui.render()
    } else {
      console.log(chalk.gray(`  ▶ ${title}`))
    }

    await playStream(streamUrl, durationInSeconds)
  } catch (err) {
    spinner.fail(chalk.red(`  YouTube error: ${err.message}`))
  }
}

import readline from 'readline'
import { stopCurrentStream, pauseCurrentStream, resumeCurrentStream } from './player.js'

export async function searchCommand(query) {

  let isPaused = false
  let isQuit = false
  let isCommandMode = false
  let commandBuffer = ''
  let currentQuery = query
  let nextQuery = null

  readline.emitKeypressEvents(process.stdin)
  if (process.stdin.isTTY) process.stdin.setRawMode(true)
  process.stdin.resume()

  const handleInput = (str, key) => {
    if (!key) return

    if (isCommandMode) {
      if (key.name === 'return' || key.name === 'enter') {
        isCommandMode = false
        tui.updateState({ commandInput: undefined })
        const val = commandBuffer.trim()
        
        if (val.length > 0) {
          nextQuery = val
          stopCurrentStream()
        }
        tui.render()
      } else if (key.name === 'escape') {
        isCommandMode = false
        tui.updateState({ commandInput: undefined })
        tui.render()
      } else if (key.name === 'backspace') {
        commandBuffer = commandBuffer.slice(0, -1)
        tui.updateState({ commandInput: commandBuffer })
        tui.render()
      } else if (str && str.length === 1) {
        commandBuffer += str
        tui.updateState({ commandInput: commandBuffer })
        tui.render()
      }
      return
    }

    if ((key.ctrl && key.name === 'c') || key.name === 'q') {
      isQuit = true
      stopCurrentStream()
      tui.leaveAlternateScreen()
      process.exit(0)
    } else if (key.name === 's' || key.name === 'space') {
      if (isPaused) {
        resumeCurrentStream()
        isPaused = false
        tui.updateState({ isPaused: false })
        tui.render()
      } else {
        pauseCurrentStream()
        isPaused = true
        tui.updateState({ isPaused: true })
        tui.render()
      }
    } else if (key.name === 'c') {
      tui.cycleAnimation()
      tui.render()
    } else if (key.name === 'v') {
      tui.cycleColor()
      tui.render()
    } else if (str === '+' || str === '=') {
      tui.increaseSpeed()
      tui.render()
    } else if (str === '-' || str === '_') {
      tui.decreaseSpeed()
      tui.render()
    } else if (str === '/' || key.name === '/') {
      isCommandMode = true
      commandBuffer = ''
      tui.updateState({ commandInput: commandBuffer })
      tui.render()
    }
  }

  process.stdin.on('keypress', handleInput)

  tui.enterAlternateScreen()

  while (currentQuery && !isQuit) {
    const finalQuery = `${currentQuery} lyric video`
    tui.updateState({ title: `Searching: ${currentQuery}`, artist: '', nextTrack: 'None' })
    tui.render()

    await searchAndPlay(finalQuery, false)

    if (nextQuery) {
      currentQuery = nextQuery
      nextQuery = null
    } else {
      break
    }
  }

  tui.leaveAlternateScreen()
  
  process.stdin.off('keypress', handleInput)
  if (process.stdin.isTTY) process.stdin.setRawMode(false)
  process.stdin.pause()
  console.log(chalk.green('\n  [Success] Finished!\n'))
}