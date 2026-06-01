import chalk from 'chalk'
import figlet from 'figlet'
import fontSmall from 'figlet/importable-fonts/Small.js'
import fontStandard from 'figlet/importable-fonts/Standard.js'
import fontSlant from 'figlet/importable-fonts/Slant.js'

figlet.parseFont('Small', fontSmall)
figlet.parseFont('Standard', fontStandard)
figlet.parseFont('Slant', fontSlant)

const CAT_COLORS = ['magenta', 'cyan', 'yellow', 'green', 'blue', 'red', 'white']

const CAT_ANIMATIONS = {
  logo: [[]],
  fire: [[]],
  eq: [[]],
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
  title: [[]]
}

export class TUI {
  constructor() {
    this.animationType = 'logo' // default
    this.lastAnimationType = 'logo'
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
    // Apply animation-specific default colors dynamically on transition
    if (this.animationType !== this.lastAnimationType) {
      if (this.animationType === 'fire'){
        this.colorIndex = 5 // Default to red
        this.animationSpeed = 6
      } 
      if (this.animationType === 'eq'){
        this.colorIndex = 3 // Default to green
        this.animationSpeed = 9
      }    
      this.lastAnimationType = this.animationType
    }

    // Clear screen and move cursor to top left
    process.stdout.write('\x1b[2J\x1b[H')

    const width = process.stdout.columns || 80
    const innerWidth = Math.max(40, width - 4)

    const separator = chalk.gray('='.repeat(innerWidth))
    const centeredText = (text, rawLength = text.length) => {
      const pad = Math.max(0, Math.floor((innerWidth - rawLength) / 2))
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
    const barWidth = Math.max(20, innerWidth - 20)
    const filledCount = Math.floor((this.state.progressPercent / 100) * barWidth)
    const emptyCount = Math.max(0, barWidth - filledCount)
    const bar = chalk.green('=').repeat(filledCount) + chalk.gray('.').repeat(emptyCount)
    
    console.log(`  [${this.state.timeString}]`)
    console.log(`  [${bar}]`)
    console.log()

    let upNext = this.state.nextTrack
    if (this.state.userQueue && this.state.userQueue.length > 0) {
      upNext = this.state.userQueue[0]
    }

    if (upNext) {
      console.log(chalk.gray(`  Up Next: ${upNext}`))
    } else {
      console.log()
    }
    
    if (this.state.userQueue && this.state.userQueue.length > 0) {
      console.log(chalk.cyan(`\n  Queue:`))
      this.state.userQueue.forEach((item, i) => {
        console.log(chalk.cyan(`    ${i + 1}. ${item}`))
      })
    }

    console.log()
    console.log(separator)
    console.log()

    // Animation
    let frames = CAT_ANIMATIONS[this.animationType] || [[]]
    
    if (this.animationType === 'title') {
      const displayTitle = this.state.title ? this.state.title.slice(0, 30) : 'Musync'
      const asciiText = figlet.textSync(displayTitle, { font: 'Small', width: innerWidth, whitespaceBreak: true })
      const lines = asciiText.split('\n').filter(l => l.trim().length > 0)
      frames = [ lines, lines.map(l => ' ' + l) ]
    } else if (this.animationType === 'logo') {
      const fontName = innerWidth > 80 ? 'Standard' : 'Slant'
      const asciiText = figlet.textSync('Musync', { font: fontName, width: innerWidth, whitespaceBreak: true })
      const lines = asciiText.split('\n').filter(l => l.trim().length > 0)
      frames = [ lines, lines.map(l => ' ' + l) ]
    } else if (this.animationType === 'fire') {
      if (!this.firePixels || this.fireWidth !== innerWidth - 4) {
        this.fireWidth = Math.max(10, innerWidth - 4)
        this.fireHeight = 26
        this.firePixels = new Array(this.fireWidth * this.fireHeight).fill(0)
      }
      
      // The user controls this.animationSpeed (1 is FAST, 10 is SLOW)
      const manualIntensity = 1.0 - ((this.animationSpeed - 1) / 9.0)
      
      // TRUE AUTOMATED AUDIO REACTIVITY!
      // ffplay streams real-time RMS volume into this.state.audioIntensity
      const hasAudio = this.state.audioIntensity !== undefined
      const audioPulse = hasAudio ? this.state.audioIntensity : 0
      
      // Combine manual baseline with real-time audio volume!
      const speedNorm = Math.min(1.0, Math.max(0.1, manualIntensity * 0.3 + audioPulse * 1.5))
      
      const beatPhase = (this.frameIndex * this.animationSpeed) % 24
      // Automatically detect beats based on loud volume spikes, fallback to manual cycle if silent
      const isBeat = hasAudio ? (audioPulse > 0.4) : (beatPhase < 3)
      
      for (let x = 0; x < this.fireWidth; x++) {
        let rand = Math.random()
        let heat
        
        if (isBeat) {
          // On beat: massive flare. Scales with speed.
          const maxBeatHeat = Math.floor(9 + speedNorm * 3) // 9 to 12
          heat = rand > 0.1 ? maxBeatHeat : maxBeatHeat - 3
        } else {
          // Off beat: simmering base. Scales with speed.
          const maxOffHeat = Math.floor(5 + speedNorm * 5) // 5 to 10
          heat = rand > 0.3 ? maxOffHeat : Math.max(1, maxOffHeat - 4)
        }
        
        // Lower speeds reduce the overall fuel density at the base!
        if (rand > 0.4 + speedNorm * 0.6) {
          heat = 0
        }
        
        this.firePixels[(this.fireHeight - 1) * this.fireWidth + x] = heat
      }
      
      for (let x = 0; x < this.fireWidth; x++) {
        for (let y = 0; y < this.fireHeight - 1; y++) {
          const src = (y + 1) * this.fireWidth + x
          const rand = Math.floor(Math.random() * 3)
          const dst = src - this.fireWidth - rand + 1
          if (dst >= 0 && dst < this.firePixels.length) {
            let decay = rand & 1
            
            // Higher speed = less decay = taller fire.
            // Lower speed = rapid decay = shorter fire.
            const decayProb = (1 - y / this.fireHeight) * (1.1 - speedNorm * 0.7)
            if (Math.random() < decayProb) {
              decay += 1
            }
            
            this.firePixels[dst] = Math.max(0, this.firePixels[src] - decay)
          }
        }
      }
      
      const fireChars = ' .,-~:;=!*#$@'
      const fireLines = []
      for (let y = 0; y < this.fireHeight - 1; y++) {
        let line = ''
        for (let x = 0; x < this.fireWidth; x++) {
          const heat = this.firePixels[y * this.fireWidth + x]
          line += fireChars[heat] || ' '
        }
        fireLines.push(line)
      }
      frames = [ fireLines ]
    } else if (this.animationType === 'eq') {
      const eqWidth = innerWidth
      const numBars = Math.floor(eqWidth / 2) // '▄ ' per bar
      const maxHeight = 26
      
      if (!this.eqBars || this.eqBars.length !== numBars) {
        this.eqBars = new Array(numBars).fill(0)
        this.eqPeaks = new Array(numBars).fill(0)
      }
      
      const manualIntensity = 1.0 - ((this.animationSpeed - 1) / 9.0)
      const hasAudio = this.state.audioIntensity !== undefined
      const audioPulse = hasAudio ? this.state.audioIntensity : 0
      
      // Multiply manual speed control against the raw audio pulse
      const intensity = Math.min(1.0, audioPulse * (0.5 + manualIntensity * 1.5))
      
      for (let i = 0; i < numBars; i++) {
        let target = 0
        
        // Only jump occasionally so they look distinct and not like a solid wall
        if (Math.random() > 0.4) { 
           // Skew the random height heavily towards the bottom so it doesn't overshoot
           const barRandomness = Math.pow(Math.random(), 3) // 0 to 1, heavily weighted towards the bottom
           
           // Boost the bass on the left side slightly
           const bassBoost = 1.0 + ((numBars - i) / numBars) * 0.4
           
           // Calculate target based on raw intensity and randomness
           target = intensity * barRandomness * bassBoost * maxHeight * 1.4
        }
        
        // Interpolate bar towards target
        if (this.eqBars[i] < target) {
          // Extremely fast attack
          this.eqBars[i] += (target - this.eqBars[i]) * 0.8
        } else {
          // Gravity decay
          this.eqBars[i] -= 0.6 + (i * 0.01) // High bands fall slightly faster
        }
        this.eqBars[i] = Math.max(0, Math.min(maxHeight, this.eqBars[i]))
        
        // Handle floating peaks
        if (this.eqBars[i] >= this.eqPeaks[i]) {
          this.eqPeaks[i] = this.eqBars[i]
        } else {
          this.eqPeaks[i] -= 0.15 // Slow float downwards
        }
      }
      
      const eqLines = []
      for (let y = maxHeight; y > 0; y--) {
        let line = ''
        for (let i = 0; i < numBars; i++) {
          if (this.eqBars[i] >= y) {
            line += '▄ ' // Thicker half-block bar
          } else if (Math.round(this.eqPeaks[i]) === y) {
            line += '_ ' // Peak dot sitting below the next block
          } else {
            line += '  ' // Empty space
          }
        }
        eqLines.push(line)
      }
      frames = [ eqLines ]
    }

    const currentFrame = frames[this.frameIndex % frames.length] || []
    const currentColor = CAT_COLORS[this.colorIndex]
    
    currentFrame.forEach(line => {
      console.log(centeredText(chalk[currentColor](line), line.length))
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
