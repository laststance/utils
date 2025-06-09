const isFunction = (
  functionToCheck: unknown,
): functionToCheck is Function =>
  typeof functionToCheck === 'function'

export default isFunction
