import chalk from 'chalk'
import figlet from 'figlet'

const CAT_COLORS = ['magenta', 'cyan', 'yellow', 'green', 'blue', 'red', 'white']

const CAT_ANIMATIONS = {
  bop: [
    [
      "        ( meow... ) ",
      "       O            ",
      "   /\\_/\\ o          ",
      "  ( o.o )           ",
      "   > ^ <            "
    ],
    [
      "        ( meow... ) ",
      "       O            ",
      "   /\\_/\\ o          ",
      "  ( -.- )           ",
      "   > ^ <            "
    ]
  ],
  dj: [
    [
      "         ( purrrr... )   ",
      "        O                ",
      "  /\\_/\\ o                ",
      "=( °w° )=                ",
      "  )   (  //              ",
      " (__ __)//               "
    ],
    [
      "         ( purrrr... )   ",
      "        O                ",
      "  /\\_/\\ o                ",
      "=( >w< )=                ",
      "  )   (  //              ",
      " (__ __)//               "
    ]
  ],
  sleep: [
    [
      "          ( tuna! )  ",
      "         O           ",
      "   |\\___/| o         ",
      "   )     (           ",
      "  =\\     /=          "
    ],
    [
      "          ( tuna! )  ",
      "     z   O           ",
      "   |\\___/| o         ",
      "   ) -.- (           ",
      "  =\\     /=          "
    ],
    [
      "          ( tuna! )  ",
      "       Z O           ",
      "   |\\___/| o         ",
      "   ) -.- (           ",
      "  =\\     /=          "
    ]
  ],
  coffee: [
    [
      "    (  )     ",
      "     ) (     ",
      "   .____.    ",
      "   |    |--. ",
      "   '----'--' "
    ],
    [
      "     )(      ",
      "    (  )     ",
      "   .____.    ",
      "   |    |--. ",
      "   '----'--' "
    ]
  ],
  sudo: [
    [
      "  ___ _   _ ___   ___  ",
      " / __| | | |   \\ / _ \\ ",
      " \\__ \\ |_| | |) | (_) |",
      " |___/\\___/|___/ \\___/ "
    ],
    [
      "  ___ _   _ ___   ___   _",
      " / __| | | |   \\ / _ \\ | |",
      " \\__ \\ |_| | |) | (_) || |",
      " |___/\\___/|___/ \\___/ |_|"
    ]
  ],
  curl: [
    [
      "   ___ _   _ ___ _    ",
      "  / __| | | | _ \\ |   ",
      " | (__| |_| |   / |__ ",
      "  \\___|\\___/|_|_\\____|"
    ],
    [
      "   ___ _   _ ___ _     _",
      "  / __| | | | _ \\ |   | |",
      " | (__| |_| |   / |__ |_|",
      "  \\___|\\___/|_|_\\____|(_)"
    ]
  ],
  bash: [
    [
      "  ___  _   ___ _  _ ",
      " | _ )/_\\ / __| || |",
      " | _ \\/ _ \\__ \\ __ |",
      " |___/_/ \\_\\___/_||_|",
      "                    "
    ],
    [
      "  ___  _   ___ _  _ ",
      " | _ )/_\\ / __| || |",
      " | _ \\/ _ \\__ \\ __ |",
      " |___/_/ \\_\\___/_||_|",
      " ------------------"
    ]
  ],
  title: [[]],
  cover: [[]]
}

export class TUI {
  constructor() {
    this.animationType = 'bop' // default
    this.colorIndex = 0
    this.animationSpeed = 2
    this.frameIndex = 0
    this.frameCount = 0
    this.state = {
      title: 'Loading...',
      artist: '',
      timeString: '00:00 / 00:00',
      progressPercent: 0,
      nextTrack: '',
      isPaused: false,
      playlistPosition: '',
      commandInput: undefined
    }
  }

  enterAlternateScreen() {
    process.stdout.write('\x1b[?1049h') // Enter alternate screen
    process.stdout.write('\x1b[?25l')   // Hide cursor
  }

  leaveAlternateScreen() {
    process.stdout.write('\x1b[?1049l') // Leave alternate screen
    process.stdout.write('\x1b[?25h')   // Show cursor
  }

  cycleAnimation() {
    const keys = Object.keys(CAT_ANIMATIONS)
    const currentIndex = keys.indexOf(this.animationType)
    this.animationType = keys[(currentIndex + 1) % keys.length]
    this.frameIndex = 0
  }

  cycleColor() {
    this.colorIndex = (this.colorIndex + 1) % CAT_COLORS.length
  }

  increaseSpeed() {
    this.animationSpeed = Math.max(1, this.animationSpeed - 1)
  }

  decreaseSpeed() {
    this.animationSpeed = Math.min(10, this.animationSpeed + 1)
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState }
  }

  render() {
    // Clear screen and move cursor to top left
    process.stdout.write('\x1b[2J\x1b[H')

    const width = process.stdout.columns || 80
    const separator = chalk.gray('='.repeat(Math.min(width, 60)))
    const centeredText = (text, rawLength = text.length) => {
      const pad = Math.max(0, Math.floor((Math.min(width, 60) - rawLength) / 2))
      return ' '.repeat(pad) + text
    }

    console.log(separator)
    console.log(centeredText(chalk.bold.green('MUSYNC PLAYER'), 13))
    console.log(separator)
    console.log()
    
    // Track Info
    const pos = this.state.playlistPosition ? ` ${chalk.magenta(this.state.playlistPosition)}` : ''
    console.log(chalk.cyan(`  Currently Playing${pos}:`))
    console.log(`  ${chalk.bold(this.state.title)} ${this.state.artist ? chalk.gray('— ' + this.state.artist) : ''}`)
    console.log()
    
    // Progress Bar
    const barWidth = 30
    const filledCount = Math.floor((this.state.progressPercent / 100) * barWidth)
    const emptyCount = Math.max(0, barWidth - filledCount)
    const bar = chalk.green('=').repeat(filledCount) + chalk.gray('.').repeat(emptyCount)
    
    console.log(`  [${this.state.timeString}]`)
    console.log(`  [${bar}]`)
    console.log()

    if (this.state.nextTrack) {
      console.log(chalk.gray(`  Up Next: ${this.state.nextTrack}`))
    } else {
      console.log()
    }
    
    console.log()
    console.log(separator)
    console.log()

    // Animation
    let frames = CAT_ANIMATIONS[this.animationType]
    
    if (this.animationType === 'title') {
      const displayTitle = this.state.title ? this.state.title.slice(0, 20) : 'Musync'
      const asciiText = figlet.textSync(displayTitle, { font: 'Small', width: 60, whitespaceBreak: true })
      const lines = asciiText.split('\n').filter(l => l.trim().length > 0)
      frames = [ lines, lines.map(l => ' ' + l) ] // slight bop effect
    } else if (this.animationType === 'cover') {
      if (this.state.coverLines) {
        frames = [ this.state.coverLines, this.state.coverLines ] // static cover
      } else {
        frames = [ ['Loading cover art...'], ['Loading cover art... '] ]
      }
    }

    const currentFrame = frames[this.frameIndex % frames.length] || []
    const currentColor = CAT_COLORS[this.colorIndex]
    
    currentFrame.forEach(line => {
      if (this.animationType === 'cover' && this.state.coverLines) {
        // Don't apply chalk color to terminal-image output since it has its own ANSI
        console.log(centeredText(line, line.replace(/\x1b\[.*?m/g, '').length))
      } else {
        console.log(centeredText(chalk[currentColor](line), line.length))
      }
    })

    if (!this.state.isPaused) {
      this.frameCount++
      if (this.frameCount % this.animationSpeed === 0 && frames.length > 0) {
        this.frameIndex = (this.frameIndex + 1) % frames.length
      }
    }

    console.log()
    console.log(separator)
    if (this.state.commandInput !== undefined) {
      console.log(chalk.bold.yellow('  Search or jump to track: ') + this.state.commandInput + chalk.bgWhite(' '))
    } else {
      console.log(chalk.gray('  Controls: [Space] Pause  [n/p] Next/Prev  [c/v] Cat/Color  [+/-] Speed  [q] Quit  [/] Search'))
    }
    console.log(separator)
  }
}

export const tui = new TUI()
