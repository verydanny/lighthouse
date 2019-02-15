## psi-profiler-tool

Profiles list of sites according to Google PSI (lighthouse)

### Basic Usage

```js
import profiler from 'psi-profiler-tool'

// Console logs individual test runs
profiler({
  runs: 1,
  wait: 2000,
  view: 'mobile',
  verbose: true,
}, [
  'https://facebook.com',
  'https://google.com'
])
```

### Saving the report object

```js
import profiler from 'psi-profiler-tool'

async function getReport() {
  const options = { runs: 1, wait: 2000, view: 'mobile' }
  const urls = [ 'https://facebook.com', 'https://google.com' ]

  const result = await profiler(options, urls)
  // do something with result
}

```

### API
---
### profiler([options], urls)

Returns a `Promise` for the response data

### options
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

### url
Type: `string | string[]`

Single string, parameters of string, or array of strings to test on.

