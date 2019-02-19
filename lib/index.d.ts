export interface IOptions {
    runs: number;
    wait: number;
    view: 'mobile' | 'both' | 'desktop';
    api?: string;
    verbose?: boolean;
}
export declare function psiApiFetch(url: string, waitAmount: number, verbose: boolean): Promise<{}>;
/**
 * @param {Object} options - `Object { runs, wait, view, api, verbose }`
 * @param {number} options.runs - How many times to run PSI test on list of urls...
 * @param {number} options.wait - How many ms to wait before running next test...
 * @param {string} [options.view=both] - Which view to run tests for: `mobile, desktop, both`...
 * @param {string} [options.api=''] - Google API key
 * @param {boolean} [options.verbose] - Output console.log after every test...
 * @param {array} urls - List of urls to provide the runner...
 */
export default function profiler<T extends any[]>({ runs, wait, view, api, verbose, }: IOptions, ...urls: T): Promise<{}>;
