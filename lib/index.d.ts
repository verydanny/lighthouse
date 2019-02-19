export interface IOptions {
    runs?: number;
    wait?: number;
    view?: 'mobile' | 'both' | 'desktop';
    api?: string;
    verbose?: boolean;
}
export declare function psiApiFetch(url: string, waitAmount: number, verbose: boolean): Promise<{}>;
/**
 *
 * @typedef {Object} Options
 * @property {number} runs - How many times to run PSI test on list of urls...
 * @property {number} wait - How many ms to wait before running next test (useful if no api key)...
 * @property {('mobile'|'desktop'|'both')} view - Which view to run tests for...
 * @property {string} api - Google API key
 * @property {boolean} verbose - Output console.log after every test...
 */
/**
 * @param {...Options} options - `Object { runs, wait, view, api, verbose }`
 * @param {array} urls - List of urls to provide the runner...
 * @returns {Promise} promise
 */
export default function profiler<T extends any[]>({ runs, wait, view, api, verbose, }: IOptions, ...urls: T): Promise<{}>;
