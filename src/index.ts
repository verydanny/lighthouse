import chalk from 'chalk'
import { stripIndents } from 'common-tags'
import fetch from 'isomorphic-fetch'
import { fill, getOr, map, pick, pipe } from 'lodash/fp'
import flatten from 'ramda/src/flatten'

export interface IOptions {
  runs: number,
  wait: number,
  view: 'mobile' | 'both' | 'desktop',
  api?: string,
  verbose?: boolean,
}

interface ICreateArr<T> {
  runs: number,
  view: IOptions['view'],
  urls: T[],
}

function makeId() {
  let text: string = ''
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(
      Math.floor(
        Math.random() * possible.length
      )
    )
  }

  return text
}

const createArr = <T extends any[]>({ runs, view, urls }: ICreateArr<T>) => {
  const viewRuns =
    view === 'both' ? ['desktop', 'mobile']
    : view === 'mobile' ? ['mobile'] : ['desktop']

  return pipe(
    fill(0, runs, urls),
    flatten,
    map(url => viewRuns.map(run => `${url}&strategy=${run}`)),
    flatten
  )(Array(runs))
}

export async function psiApiFetch(url: string, waitAmount: number, verbose: boolean) {
  const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

  return new Promise(async (res, rej) => {
    try {
      const resolve = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`)
      const json = await resolve.json()

      if (
        json &&
        json.lighthouseResult &&
        json.lighthouseResult.audits
      ) {
        const base = json.lighthouseResult
        const auditConstants = ['score', 'displayValue']
        const auditList = {
          'categories.performance| Final Score:': null,
          'audits.interactive| TTI:': null,
          'audits.speed-index| Speed Index:': null,
          'audits.first-contentful-paint| First Contentful Paint:': null,
          'audits.first-cpu-idle| CPU Idle:': null,
          'audits.first-meaningful-paint| Meaningful Paint:': null,
          'audits.time-to-first-byte| Time To First Byte (TTFB):': null,
          'audits.uses-long-cache-ttl| Uses Long Cache TTL:': null,
          'audits.estimated-input-latency| Estimated Input Latency:': null,
          'audits.bootup-time| JS Bootup Time:': null,
          'audits.total-byte-weight| Total Byte Weight:': null,
          'audits.mainthread-work-breakdown| Main Thread Work Time:': null,
        }
  
        const result = Object.keys(auditList).reduce((auditResult, key) => ({
          ...auditResult,
          [key.split('|')[1]]: pipe(
            getOr('Data not found', key.split('|')[0]),
            pick(auditConstants),
          )(base),
        }), {})
  
        if (verbose) {
          console.table(result)
        }
  
        await wait(waitAmount)
  
        res(result)
      } else if (json.error && json.error.message) {
        console.log(
          chalk.bold.red('ERROR:'),
          json.error.message
        )
      } else {
        console.log(
          chalk.bold.yellow('WARNING:'),
          'Something went wrong, try using a different URL, or add more repeat runs.'
        )
      }
    } catch(e) {
      rej(e)
    }
  })
}

async function getResults<T extends string[]>(arr: T, waitAmount: number, api: string, verbose: boolean) {
  return arr.reduce(async (previous, curr, index) => {
    const collection = await previous
    const apiKey = api !== '' ? `&key=${api}` : ''
    const fakeUrlChange = `${curr}${apiKey}&${makeId()}=${makeId()}`

    if (verbose) {
      console.log(
        chalk.bold.green(`Test #${index + 1}`),
        `${curr}`
      )
    }

    return ({
      ...collection,
      [`${curr}-${index}`]: await psiApiFetch(fakeUrlChange, waitAmount, verbose),
    })
  }, {})
}

/**
 * @param {Object} options - `Object { runs, wait, view, api, verbose }`
 * @param {number} options.runs - How many times to run PSI test on list of urls...
 * @param {number} options.wait - How many ms to wait before running next test...
 * @param {string} [options.view=both] - Which view to run tests for: `mobile, desktop, both`...
 * @param {string} [options.api=''] - Google API key
 * @param {boolean} [options.verbose] - Output console.log after every test...
 * @param {array} urls - List of urls to provide the runner...
 */
export default async function profiler<T extends any[]>({
  runs = 1,
  wait = 2000,
  view = 'both',
  api = '',
  verbose = false,
}: IOptions, ...urls: T) {
  // normalize runs for later
  runs = runs * urls.length

  if (verbose) {
    console.log(stripIndents`
      Runs: ${chalk.bold.yellow(runs.toString())}
      Waiting: ${chalk.bold.yellow(wait.toString())}
      Testing View: ${chalk.bold.yellow(view)}
    `)
  }

  const results = await getResults(
    createArr({ runs, view, urls }),
    wait,
    api,
    verbose
  )

  return results
}

// I want CommonJS primary import to be profiler
module.exports = profiler
