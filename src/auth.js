import SpotifyWebApi from 'spotify-web-api-node'
import http from 'http'
import { createRequire } from 'module'
import chalk from 'chalk'
import ora from 'ora'
import open from 'open'
import 'dotenv/config'
import {
  getTokens, saveTokens, saveUserInfo, clearAll,
  isLoggedIn, getUserInfo
} from './config.js'

// open is an ESM package — handle gracefully
let openBrowser
try {
  const mod = await import('open')
  openBrowser = mod.default
} catch {
  openBrowser = null
}

function createSpotifyClient() {
  return new SpotifyWebApi({
    clientId:     process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri:  process.env.SPOTIFY_REDIRECT_URI,
  })
}

export function getSpotifyClient() {
  return createSpotifyClient()
}

export async function authCommand() {
  if (isLoggedIn()) {
    const { displayName } = getUserInfo()
    console.log(chalk.green(`\n  ✅ Already logged in as ${chalk.bold(displayName)}`))
    console.log(chalk.gray('  Run "musync logout" to switch accounts.\n'))
    return
  }

  const spotify = createSpotifyClient()

  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-read-private',
    'user-read-email',
  ]

  const authURL = spotify.createAuthorizeURL(scopes, 'musync-state')

  console.log(chalk.bold('\n  🔐 Spotify Login\n'))
  console.log(chalk.gray('  Opening browser for Spotify login...'))
  console.log(chalk.gray(`  If browser doesn't open, visit:\n  ${chalk.cyan(authURL)}\n`))

  if (openBrowser) {
    await openBrowser(authURL)
  } else {
    console.log(chalk.yellow('  Install "open" package for auto browser launch: npm install open'))
  }

  // start local server to catch the OAuth callback
  const code = await waitForCallback()

  const spinner = ora('  Authenticating with Spotify...').start()

  try {
    const data = await spotify.authorizationCodeGrant(code)
    const { access_token, refresh_token, expires_in } = data.body

    saveTokens({
      accessToken:  access_token,
      refreshToken: refresh_token,
      expiresIn:    expires_in,
    })

    spotify.setAccessToken(access_token)
    const me = await spotify.getMe()
    saveUserInfo({ id: me.body.id, displayName: me.body.display_name })

    spinner.succeed(chalk.green(`  Logged in as ${chalk.bold(me.body.display_name)} ✅\n`))
  } catch (err) {
    spinner.fail(chalk.red(`  Auth failed: ${err.message}\n`))
  }
}

function waitForCallback() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url  = new URL(req.url, 'http://127.0.0.1:8888')
      const code = url.searchParams.get('code')

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:60px">
            <h2>✅ Musync logged in!</h2>
            <p>You can close this tab and go back to your terminal.</p>
          </body></html>
        `)
        server.close()
        resolve(code)
      } else {
        res.writeHead(400)
        res.end('No code received')
        server.close()
        reject(new Error('No auth code received'))
      }
    })

    server.listen(8888, '127.0.0.1', () => {
      // listening on 127.0.0.1 explicitly
    })

    setTimeout(() => {
      server.close()
      reject(new Error('Auth timed out after 2 minutes'))
    }, 120_000)
  })
}

export async function logoutCommand() {
  clearAll()
  console.log(chalk.green('\n  ✅ Logged out successfully.\n'))
}

export async function getAuthenticatedClient() {
  if (!isLoggedIn()) {
    console.log(chalk.red('\n  ❌ Not logged in. Run: musync auth\n'))
    process.exit(1)
  }

  const spotify = createSpotifyClient()
  const { accessToken, refreshToken } = getTokens()

  spotify.setAccessToken(accessToken)
  spotify.setRefreshToken(refreshToken)

  // auto refresh if expired
  try {
    const data = await spotify.refreshAccessToken()
    spotify.setAccessToken(data.body.access_token)
    saveTokens({
      accessToken:  data.body.access_token,
      refreshToken: refreshToken,
      expiresIn:    data.body.expires_in,
    })
  } catch {
    // token still valid, continue
  }

  return spotify
}