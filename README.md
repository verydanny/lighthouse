## Basic Usage

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

## Saving the report object

```js
import profiler from 'psi-profiler-tool'

async function getReport() {
  const options = { runs: 1, wait: 2000, view: 'mobile' }
  const urls = [ 'https://facebook.com', 'https://google.com' ]

  const result = await profiler(options, urls)
  // do something with result
}

```
