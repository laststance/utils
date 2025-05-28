// from https://x.com/colinhacks/status/1927640989696688277
export function betterTypeof(data: unknown) {
  if (typeof data === 'number') {
    if (Number.isNaN(data)) return 'NaN'
    if (Number.isInteger(data)) return 'integer'
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) return 'array'
    if (data === null) return 'null'
    if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
      return data.constructor.name as string & {} // assert (string & {}) to help IDE autocomplete
    }
  }

  return typeof data
}
