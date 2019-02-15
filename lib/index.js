"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const flatten_1 = __importDefault(require("ramda/src/flatten"));
const fp_1 = require("lodash/fp");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const chalk_1 = __importDefault(require("chalk"));
function makeId() {
    let text = '';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
const createArr = ({ runs, view, urls }) => {
    const viewRuns = view === 'both' ? ['desktop', 'mobile'] :
        view === 'mobile' ? ['mobile'] : ['desktop'];
    return fp_1.pipe(fp_1.fill(0, runs, urls), flatten_1.default, fp_1.map(url => viewRuns.map(run => `${url}&strategy=${run}`)), flatten_1.default)(Array(runs));
};
async function psiApiFetch(url, waitAmount, verbose) {
    const wait = (ms) => new Promise(res => setTimeout(res, ms));
    try {
        const res = await isomorphic_fetch_1.default(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`);
        const json = await res.json();
        if (json &&
            json.lighthouseResult &&
            json.lighthouseResult.audits) {
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
                'audits.mainthread-work-breakdown| Main Thread Work Time:': null,
            };
            const result = Object.keys(auditList).reduce((auditResult, key) => ({
                ...auditResult,
                [key.split('|')[1]]: fp_1.pipe(fp_1.getOr('Data not found', key.split('|')[0]), fp_1.pick(auditConstants))(base),
            }), {});
            verbose && console.table(result);
            await wait(waitAmount);
            return result;
        }
        return 'Failed to get data';
    }
    catch (e) {
        throw Error(e);
    }
}
async function getResults(arr, waitAmount, api, verbose) {
    return arr.reduce(async (previous, curr, index) => {
        const collection = await previous;
        const apiKey = api !== '' ? `&key=${api}` : '';
        const fakeUrlChange = `${curr}${apiKey}&${makeId()}=${makeId()}`;
        verbose && console.log(chalk_1.default.red(`Test #${index + 1}`), chalk_1.default.black.bgGreen(`Currently Running: ${curr}`));
        return ({
            ...collection,
            [`${curr}-${index}`]: await psiApiFetch(fakeUrlChange, waitAmount, verbose),
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
async function lighthouseRunner({ runs = 1, wait = 2000, view = 'both', api = '', verbose = false, }, ...urls) {
    // normalize runs for later
    runs = runs * urls.length;
    verbose && console.log(`Runs: ${runs}\nWaiting: ${wait}\nTesting View: ${view}`);
    const results = await getResults(createArr({ runs, view, urls }), wait, api, verbose);
    return results;
}
module.exports = lighthouseRunner;
