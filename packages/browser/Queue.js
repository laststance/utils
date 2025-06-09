// from https://github.com/mui-org/material-ui/tree/20f6450209de399917e40e36468e97d056dc0c1d/modules/waterfall

class Queue {
  constructor(worker, options = {}) {
    this.worker = worker
    this.concurrency = options.concurrency || 1
    this.pendingEntries = []
    this.inFlight = 0
    this.err = null
  }

  push(entries) {
    this.pendingEntries = this.pendingEntries.concat(entries)
    this.process()
  }

  process() {
    const scheduled = this.pendingEntries.splice(
      0,
      this.concurrency - this.inFlight,
    )
    this.inFlight += scheduled.length
    scheduled.forEach(async (task) => {
      try {
        await this.worker(task)
      } catch (err) {
        this.err = err
      } finally {
        this.inFlight -= 1
      }

      if (this.pendingEntries.length > 0) {
        this.process()
      }
    })
  }

  async wait(options = {}) {
    const checkCondition = () => {
      if (this.err) {
        this.pendingEntries = []
        throw this.err
      }

      return options.empty
        ? this.inFlight === 0 && this.pendingEntries.length === 0
        : this.concurrency > this.pendingEntries.length
    }

    return new Promise((resolve, reject) => {
      const poll = () => {
        try {
          if (checkCondition()) {
            resolve()
          } else {
            setTimeout(poll, 50)
          }
        } catch (err) {
          reject(err)
        }
      }
      poll()
    })
  }
}

export default Queue
