"use strict";

exports.__esModule = true;
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _isomorphicFetch = _interopRequireDefault(require("isomorphic-fetch"));

var _fp = require("lodash/fp");

var _flatten = _interopRequireDefault(require("ramda/src/flatten"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function makeId() {
  let text = '';
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const createArr = ({
  runs,
  view,
  urls
}) => {
  const viewRuns = view === 'both' ? ['desktop', 'mobile'] : view === 'mobile' ? ['mobile'] : ['desktop'];
  return (0, _fp.pipe)((0, _fp.fill)(0, runs, urls), _flatten.default, (0, _fp.map)(url => viewRuns.map(run => `${url}&strategy=${run}`)), _flatten.default)(Array(runs));
};

async function psiApiFetch(url, waitAmount, verbose) {
  const wait = ms => new Promise(res => setTimeout(res, ms));

  try {
    const res = await (0, _isomorphicFetch.default)(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`);
    const json = await res.json();

    if (json && json.lighthouseResult && json.lighthouseResult.audits) {
      const base = json.lighthouseResult;
      const auditConstants = ['score', 'displayValue'];
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
        'audits.mainthread-work-breakdown| Main Thread Work Time:': null
      };
      const result = Object.keys(auditList).reduce((auditResult, key) => _objectSpread({}, auditResult, {
        [key.split('|')[1]]: (0, _fp.pipe)((0, _fp.getOr)('Data not found', key.split('|')[0]), (0, _fp.pick)(auditConstants))(base)
      }), {});

      if (verbose) {
        console.table(result);
      }

      await wait(waitAmount);
      return result;
    }

    return 'Failed to get data';
  } catch (e) {
    throw Error(e);
  }
}

async function getResults(arr, waitAmount, api, verbose) {
  return arr.reduce(async (previous, curr, index) => {
    const collection = await previous;
    const apiKey = api !== '' ? `&key=${api}` : '';
    const fakeUrlChange = `${curr}${apiKey}&${makeId()}=${makeId()}`;

    if (verbose) {
      console.log(_chalk.default.red(`Test #${index + 1}`), _chalk.default.black.bgGreen(`Currently Running: ${curr}`));
    }

    return _objectSpread({}, collection, {
      [`${curr}-${index}`]: await psiApiFetch(fakeUrlChange, waitAmount, verbose)
    });
  }, {});
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


async function lighthouseRunner({
  runs = 1,
  wait = 2000,
  view = 'both',
  api = '',
  verbose = false
}, ...urls) {
  // normalize runs for later
  runs = runs * urls.length;

  if (verbose) {
    console.log(`Runs: ${runs}\nWaiting: ${wait}\nTesting View: ${view}`);
  }

  const results = await getResults(createArr({
    runs,
    view,
    urls
  }), wait, api, verbose);
  return results;
}

var _default = lighthouseRunner;
exports.default = _default;
//# sourceMappingURL=index.js.map