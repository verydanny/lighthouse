import flatten from 'ramda/src/flatten'
import { pipe, map, fill, pick, getOr } from 'lodash/fp'
import fetch from 'isomorphic-fetch'
import chalk from 'chalk'

interface IOptions {
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
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

const createArr = <T extends any[]>({ runs, view, urls }: ICreateArr<T>) => {
  const viewRuns =
    view === 'both' ? ['desktop', 'mobile'] :
      view === 'mobile' ? ['mobile'] : ['desktop']

  return pipe(
    fill(0, runs, urls),
    flatten,
    map(url => viewRuns.map(run => `${url}&strategy=${run}`)),
    flatten
  )(Array(runs))
}

async function psiApiFetch(url: string, waitAmount: number, verbose: boolean) {
  const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`)
    const json = await res.json()

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

      verbose && console.table(result)

      await wait(waitAmount)

      return result
    }

    return 'Failed to get data'
  } catch (e) {
    throw Error(e)
  }
}

async function getResults<T extends string[]>(arr: T, waitAmount: number, api: string, verbose: boolean) {
  return arr.reduce(async (previous, curr, index) => {
    const collection = await previous
    const apiKey = api !== '' ? `&key=${api}` : ''
    const fakeUrlChange = `${curr}${apiKey}&${makeId()}=${makeId()}`

    verbose && console.log(
      chalk.red(`Test #${index + 1}`),
      chalk.black.bgGreen(`Currently Running: ${curr}`)
    )

    return ({
      ...collection,
      [`${curr}-${index}`]: await psiApiFetch(fakeUrlChange, waitAmount, verbose),
    })
  }, {})
}

/**
 * @param {Object} options
 * @param {number} options.runs - How many times to run PSI test on list of urls...
 * @param {number} options.wait - How many ms to wait before running next test...
 * @param {string} [options.view=both] - Which view to run tests for: `mobile, desktop, both`...
 * @param {string} [options.api=''] - Google API key
 * @param {boolean} [options.verbose] - Output console.log after every test...
 * @param {array} urls - List of urls to provide the runner...
 */
async function lighthouseRunner<T extends any[]>({
  runs = 1,
  wait = 2000,
  view = 'both',
  api = '',
  verbose = false,
}: IOptions, ...urls: T) {
  // normalize runs for later
  runs = runs * urls.length

  verbose && console.log(`Runs: ${runs}\nWaiting: ${wait}\nTesting View: ${view}`)
  const results = await getResults(
    createArr({ runs, view, urls }),
    wait,
    api,
    verbose
  )

  return results
}

export = lighthouseRunner
