// from https://github.com/mui-org/material-ui/tree/20f6450209de399917e40e36468e97d056dc0c1d/modules/waterfall

/**
 * A concurrent task queue that processes tasks with configurable concurrency.
 * Uses event-based waiting instead of polling for better performance.
 * Allows you to add tasks and process them with a limited number of concurrent executions.
 *
 * @example
 * ```javascript
 * // Create a queue with 3 concurrent workers
 * const queue = new Queue(async (task) => {
 *   console.log('Processing:', task)
 *   await fetch(`/api/process/${task.id}`)
 * }, { concurrency: 3 })
 *
 * // Add tasks to the queue
 * queue.push([
 *   { id: 1, data: 'task1' },
 *   { id: 2, data: 'task2' },
 *   { id: 3, data: 'task3' }
 * ])
 *
 * // Wait for all tasks to complete
 * await queue.wait({ empty: true })
 * ```
 */
class Queue {
  /**
   * Creates a new Queue instance.
   *
   * @param {Function} worker - Function that processes each task
   * @param {Object} options - Configuration options
   * @param {number} [options.concurrency=1] - Maximum number of concurrent tasks
   */
  constructor(worker, options = {}) {
    this.worker = worker
    this.concurrency = options.concurrency || 1
    this.pendingEntries = []
    this.inFlight = 0
    this.err = null
    
    // Event-based waiting system
    this.waiters = []
  }

  /**
   * Adds tasks to the queue for processing.
   *
   * @param {Array} entries - Array of tasks to add to the queue
   */
  push(entries) {
    this.pendingEntries = this.pendingEntries.concat(entries)
    this.process()
  }

  /**
   * Processes pending tasks up to the concurrency limit.
   * Called automatically when tasks are added.
   */
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
        // Notify waiters after task completion
        this._notifyWaiters()
      }

      if (this.pendingEntries.length > 0) {
        this.process()
      }
    })
    
    // Also notify waiters immediately in case conditions are already met
    this._notifyWaiters()
  }

  /**
   * Waits for queue conditions to be met using event-based approach.
   *
   * @param {Object} [options={}] - Wait options
   * @param {boolean} [options.empty=false] - If true, waits for queue to be completely empty
   * @returns {Promise<void>} Promise that resolves when condition is met
   */
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
      // Check immediately if condition is already met
      try {
        if (checkCondition()) {
          resolve()
          return
        }
      } catch (err) {
        reject(err)
        return
      }

      // Register waiter to be notified when conditions change
      const waiter = { checkCondition, resolve, reject, options }
      this.waiters.push(waiter)
    })
  }

  /**
   * Notifies all waiting promises when queue state changes.
   * This replaces the inefficient polling approach.
   * @private
   */
  _notifyWaiters() {
    // Process all waiters and remove those that can be resolved
    this.waiters = this.waiters.filter((waiter) => {
      try {
        if (waiter.checkCondition()) {
          waiter.resolve()
          return false // Remove this waiter
        }
        return true // Keep this waiter
      } catch (err) {
        waiter.reject(err)
        return false // Remove this waiter
      }
    })
  }
}

export default Queue
