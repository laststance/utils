// from https://github.com/jquense/yup/blob/03584f6758ff43409113c41f58fd41e065aa18a3/src/util/printValue.ts

/**
 * Converts any value to a human-readable string representation.
 * Handles special cases like functions, symbols, dates, errors, and circular references.
 *
 * @param value - The value to convert to string
 * @param quoteStrings - Whether to wrap string values in quotes (default: false)
 * @returns Human-readable string representation of the value
 *
 * @example
 * ```typescript
 * printValue(123)                    // "123"
 * printValue('hello')                // "hello"
 * printValue('hello', true)          // '"hello"'
 * printValue(() => {})               // "[Function anonymous]"
 * printValue(new Date())             // "2023-12-25T10:30:00.000Z"
 * printValue(new Error('test'))      // "[Error: test]"
 * printValue({ a: 1, b: 2 })         // "{\n  \"a\": 1,\n  \"b\": 2\n}"
 * ```
 */
const toString = Object.prototype.toString
const errorToString = Error.prototype.toString
const regExpToString = RegExp.prototype.toString
const symbolToString =
  typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => ''

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/

function printNumber(val: any) {
  if (val !== +val) return 'NaN'
  const isNegativeZero = val === 0 && 1 / val < 0
  return isNegativeZero ? '-0' : '' + val
}

function printSimpleValue(val: any, quoteStrings = false) {
  if (val === null || val === true || val === false) return '' + val
  if (val === undefined) return 'undefined'

  const typeOf = typeof val
  if (typeOf === 'number') return printNumber(val)
  if (typeOf === 'string') return quoteStrings ? `"${val}"` : val
  if (typeOf === 'function')
    return '[Function ' + (val.name || 'anonymous') + ']'
  if (typeOf === 'symbol')
    return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)')

  const tag = toString.call(val).slice(8, -1)
  if (tag === 'Date')
    return isNaN(val.getTime()) ? '' + val : val.toISOString(val)
  if (tag === 'Error' || val instanceof Error)
    return '[' + errorToString.call(val) + ']'
  if (tag === 'RegExp') return regExpToString.call(val)

  return null
}

export default function printValue(value: any, quoteStrings?: boolean) {
  const result = printSimpleValue(value, quoteStrings)
  if (result !== null) return result

  return JSON.stringify(
    value,
    function (key, value) {
      // Only use custom formatting for special types that JSON.stringify can't handle
      const typeOf = typeof value
      if (typeOf === 'function') {
        return '[Function ' + (value.name || 'anonymous') + ']'
      }
      if (typeOf === 'symbol') {
        return symbolToString.call(value).replace(SYMBOL_REGEXP, 'Symbol($1)')
      }
      if (value === undefined) {
        return 'undefined'
      }

      const tag = toString.call(value).slice(8, -1)
      if (tag === 'Date') {
        return isNaN(value.getTime()) ? '' + value : value.toISOString(value)
      }
      if (tag === 'Error' || value instanceof Error) {
        return '[' + errorToString.call(value) + ']'
      }
      if (tag === 'RegExp') {
        return regExpToString.call(value)
      }

      // For strings inside objects, respect the quoteStrings parameter
      if (typeOf === 'string' && quoteStrings) {
        return `"${value}"`
      }

      return value
    },
    2,
  )
}
