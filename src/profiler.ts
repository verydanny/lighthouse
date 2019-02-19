#!/usr/bin/env node

import chalk from 'chalk'
import clear from 'clear'
import program from 'commander'
import figlet from 'figlet'

import profiler, { IOptions } from './index'

clear()
console.log(
  chalk.bold.blue(
    figlet.textSync('profiler-cli', { font: 'AMC 3 Line', horizontalLayout: 'full' })
  )
)

function validURL(str: string) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i')
  if(!pattern.test(str)) {
    return false
  } else {
    return true
  }
}

function isNumber(n: string | number) {
  if (typeof n === 'string') {
    return !isNaN(parseFloat(n)) && (!isNaN(parseFloat(n)) && isFinite(parseFloat(n)))
  } else {
    return isFinite(n)
  }
}

async function processUrl(url: string) {
  const options: IOptions = {
    runs: 1,
    wait: 1000,
    view: 'both',
    verbose: true,
  }

  if (!url) {
    return console.log('You must specify a url')
  } else if (!validURL(url)) {
    return console.log('Please enter a valid url')
  }

  if (program.view && /^(mobile|desktop|both)/.test(program.view)) {
    options.view = program.view
  }

  if (program.runs && isNumber(program.runs) && program.runs > 0) {
    options.runs = program.runs
  }

  if (program.api && !isNumber(program.api)) {
    options.api = program.api
  }

  await profiler(options, url)
}

program
  .version('0.1.0')
  .command('<url>', 'URL to benchmark on')
  .option('-a --api <key>', 'Google API key')
  .option('-v --view [view]', 'Which view to test', /^(mobile|desktop|both)$/i, 'both')
  .option('-r --runs <number>', 'How many times to run profiler on URL')
  .action(processUrl)

program.parse(process.argv)
