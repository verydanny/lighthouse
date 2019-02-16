interface IOptions {
    runs: number;
    wait: number;
    view: 'mobile' | 'both' | 'desktop';
    api?: string;
    verbose?: boolean;
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
declare function lighthouseRunner<T extends any[]>({ runs, wait, view, api, verbose, }: IOptions, ...urls: T): Promise<{}>;
export default lighthouseRunner;
