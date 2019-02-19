<div align="center">
  <h1>PSI Profile Tool</h1>
</div>

<p>Profiles list of sites according to Google PSI (lighthouse)</p>

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Api](#Api)  
3. [Cli](#Cli)

<h2 align="center">Basic Usage</h2>

#### Running in node
```js
const profiler = require('psi-profiler-tool')

profiler({
  runs: 1,
  wait: 2000,
  view: 'mobile',
  verbose: true, // Console logs individual test runs
}, [
  'https://facebook.com',
  'https://google.com'
])
```

#### Saving the report object
```js
import profiler from 'psi-profiler-tool'

async function getReport() {
  const options = { runs: 1, wait: 2000, view: 'mobile' }
  const urls = [ 'https://facebook.com', 'https://google.com' ]

  const result = await profiler(options, urls)
  // do something with result
}

```

<h2 align="center">API</h2>

#### profiler([options], urls)

Returns a `Promise` for the response data

#### options
---
#### runs
Type: `number`

How many times to run profiler on each url

#### wait
Type: `number`

How much time in ms. to wait before running again. **Recommended: 0**  
**Important: get a Google API key to run with no stoppage**

#### view
Type: `'mobile' | 'desktop' | 'both'`   
Default: `'both'`

Which view you want to test on. It defaults to both.

#### api
Type: `string`

Google API key. You can register for one in the Google Dev Console. Make sure you
limit the key to PSI metrics only.

#### verbose
Type: `boolean`

Output the console every time a test is complete. Useful if you're not testing on node.

#### url
Type: `string | string[]`

Single string, parameters of string, or array of strings to test on.

<h2 align="center">CLI</h2>

Available commands:

```bash
Usage: profiler [options] [command]

Options:
  -V, --version       output the version number
  -a --api <key>      Google API key
  -v --view [view]    Which view to test (default: "both")
  -r --runs <number>  How many times to run profiler on URL
  -h, --help          output usage information

Commands:
  <url>               URL to benchmark on
  help [cmd]          display help for [cmd]
```

Example:

`yarn psi-profiler https://facebook.com --view desktop --runs 2`

