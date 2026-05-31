import { execSync, exec } from 'child_process'
import { platform } from 'os'
import { promisify } from 'util'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { createWriteStream, mkdirSync } from 'fs'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import { isSetupComplete, markSetupComplete } from './config.js'

const execAsync = promisify(exec)
const OS = platform() // 'darwin', 'linux', 'win32'

function isInstalled(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function getLocalBinDir() {
  // store binaries locally in user home to avoid needing sudo on Windows
  const home = process.env.HOME || process.env.USERPROFILE
  const dir = path.join(home, '.musync', 'bin')
  mkdirSync(dir, { recursive: true })
  return dir
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    const request = (targetUrl) => {
      https.get(targetUrl, (res) => {
        // follow redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.destroy()
          return request(res.headers.location)
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      }).on('error', reject)
    }
    request(url)
  })
}

async function installYtDlp() {
  switch (OS) {
    case 'darwin':
      if (isInstalled('brew')) {
        execSync('brew install yt-dlp', { stdio: 'inherit' })
      } else {
        execSync(
          'curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp',
          { stdio: 'inherit' }
        )
      }
      break

    case 'linux':
      execSync(
        'sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp',
        { stdio: 'inherit' }
      )
      break

    case 'win32': {
      const dir  = getLocalBinDir()
      const dest = path.join(dir, 'yt-dlp.exe')
      await downloadFile(
        'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe',
        dest
      )
      // add to PATH for this session
      process.env.PATH = `${dir};${process.env.PATH}`
      break
    }
  }
}

async function installFfmpeg() {
  switch (OS) {
    case 'darwin':
      if (isInstalled('brew')) {
        execSync('brew install ffmpeg', { stdio: 'inherit' })
      } else {
        throw new Error('Please install ffmpeg manually: https://ffmpeg.org/download.html')
      }
      break

    case 'linux':
      try {
        execSync('sudo apt-get install -y ffmpeg', { stdio: 'inherit' })
      } catch {
        try {
          execSync('sudo dnf install -y ffmpeg', { stdio: 'inherit' })
        } catch {
          throw new Error('Could not auto-install ffmpeg. Please run: sudo apt install ffmpeg')
        }
      }
      break

    case 'win32':
      throw new Error(
        'ffmpeg on Windows needs manual install. Download from: https://www.gyan.dev/ffmpeg/builds/ Then add it to your PATH.'
      )
  }
}

export async function checkFirstRun() {
  if (isSetupComplete()) return

  console.log(chalk.bold.green('\n  🎵 Welcome to Musync!\n'))
  console.log(chalk.gray('  Checking for required dependencies...\n'))

  const missing = []
  if (!isInstalled('yt-dlp'))          missing.push('yt-dlp')
  if (!isInstalled('ffplay') && !isInstalled('ffmpeg')) missing.push('ffmpeg')

  if (missing.length === 0) {
    console.log(chalk.green('  ✅ All dependencies found!\n'))
    markSetupComplete()
    return
  }

  console.log(chalk.yellow(`  Missing: ${missing.join(', ')}\n`))

  const { confirm } = await inquirer.prompt([{
    type:    'confirm',
    name:    'confirm',
    message: `Install ${missing.join(' and ')} automatically?`,
    default: true,
  }])

  if (!confirm) {
    console.log(chalk.red('\n  Setup skipped. Some features may not work.\n'))
    markSetupComplete()
    return
  }

  for (const dep of missing) {
    const spinner = ora(`  Installing ${dep}...`).start()
    try {
      if (dep === 'yt-dlp')  await installYtDlp()
      if (dep === 'ffmpeg')  await installFfmpeg()
      spinner.succeed(chalk.green(`  ${dep} installed`))
    } catch (err) {
      spinner.fail(chalk.red(`  Failed to install ${dep}: ${err.message}`))
    }
  }

  // Spotify Auth Wizard
  await checkSpotifyCredentials()

  markSetupComplete()
  console.log()
}

async function checkSpotifyCredentials() {
  const envPath = path.join(process.cwd(), '.env');
  let envExists = false;
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('SPOTIFY_CLIENT_ID') && envContent.includes('SPOTIFY_CLIENT_SECRET')) {
      return; // Already setup
    }
  } catch (e) {
    // env doesn't exist
  }

  console.log(chalk.bold.cyan('\n  🎧 Optional: Connect your Spotify Account\n'));
  console.log(chalk.white('  If you connect Spotify, you can browse and play your private playlists.'));
  console.log(chalk.white('  If you skip this, you can still play public playlist URLs directly! (e.g. musync play <url>)\n'));

  const { wantAuth } = await inquirer.prompt([{
    type: 'confirm',
    name: 'wantAuth',
    message: 'Do you want to connect your Spotify account? (Takes 2 minutes)',
    default: true
  }]);

  if (!wantAuth) {
    console.log(chalk.green('\n  ✅ Skipped Spotify login. You can still use: musync play <playlist_url>\n'));
    return;
  }

  console.log(chalk.bold('\n  Follow these steps to get your credentials:\n'));
  console.log(chalk.gray('  1.') + ' Go to ' + chalk.cyan('https://developer.spotify.com/dashboard'));
  console.log(chalk.gray('  2.') + ' Log in and click ' + chalk.bold('"Create app"'));
  console.log(chalk.gray('  3.') + ' App Name: ' + chalk.white('Musync CLI') + ' (or anything)');
  console.log(chalk.gray('  4.') + ' App Description: ' + chalk.white('Local CLI player'));
  console.log(chalk.gray('  5.') + ' Redirect URI: ' + chalk.cyan.bold('http://127.0.0.1:8888'));
  console.log(chalk.gray('  6.') + ' APIs used: ' + chalk.white('Web API'));
  console.log(chalk.gray('  7.') + ' Save, then click ' + chalk.bold('"Settings"') + ' in your new app.\n');

  const { clientId, clientSecret } = await inquirer.prompt([
    {
      type: 'input',
      name: 'clientId',
      message: 'Paste your Client ID:',
      validate: i => i.length > 20 || 'Invalid Client ID'
    },
    {
      type: 'input',
      name: 'clientSecret',
      message: 'Paste your Client Secret:',
      validate: i => i.length > 20 || 'Invalid Client Secret'
    }
  ]);

  const envData = `SPOTIFY_CLIENT_ID=${clientId.trim()}\nSPOTIFY_CLIENT_SECRET=${clientSecret.trim()}\nSPOTIFY_REDIRECT_URI=http://127.0.0.1:8888\n`;
  
  let existingEnv = '';
  try { existingEnv = fs.readFileSync(envPath, 'utf8') + '\n'; } catch (e) {}
  
  fs.writeFileSync(envPath, existingEnv + envData);
  console.log(chalk.green('\n  ✅ Credentials saved to .env!\n'));
}