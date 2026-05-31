#!/usr/bin/env node

import { program } from 'commander'
import chalk from 'chalk'
import { checkFirstRun } from '../src/setup.js'
import { authCommand, logoutCommand } from '../src/auth.js'
import { playCommand, listCommand } from '../src/spotify.js'
import { searchCommand } from '../src/youtube.js'

// run setup check on every command
await checkFirstRun()

program
  .name('musync')
  .description(chalk.green('Stream your Spotify playlists for free'))
  .version('1.0.0')

program
  .command('auth')
  .description('Login with your Spotify account')
  .action(authCommand)

program
  .command('logout')
  .description('Log out and clear saved tokens')
  .action(logoutCommand)

program
  .command('list')
  .description('List all your Spotify playlists')
  .action(listCommand)

program
  .command('play <playlist>')
  .description('Play a playlist by name or Spotify URL')
  .option('-s, --shuffle', 'Shuffle the playlist')
  .action(playCommand)

program
  .command('search <query...>')
  .description('Search and play a specific song')
  .action((query) => searchCommand(query.join(' ')))

program.parse()