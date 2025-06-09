// from https://github.com/mui-org/material-ui/tree/20f6450209de399917e40e36468e97d056dc0c1d/modules/waterfall
// Inspired by https://github.com/zeit/async-retry
// Without the retry dependency (1 kB gzipped +)
async function retry(tryFunction, options = {}) {
  const { retries = 3 } = options

  let tries = 0
  let output = null
  let exitErr = null

  const bail = (err) => {
    exitErr = err
  }

  while (tries < retries) {
    tries += 1
    try {
      output = await tryFunction({ bail, tries })
      break
    } catch (err) {
      if (tries >= retries) {
        throw err
      }
    }
  }

  if (exitErr) {
    throw exitErr
  }

  return output
}

export default retry
