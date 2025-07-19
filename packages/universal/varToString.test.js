import { describe, it, expect } from 'vitest'

// The function is currently defined inline in the file, so we'll copy it for testing
const varToString = (varObj) => Object.keys(varObj)[0]

describe('varToString', () => {
  it('should extract variable name from object with single property', () => {
    const testVar = 42
    const result = varToString({ testVar })
    expect(result).toBe('testVar')
  })

  it('should return first property name when multiple properties exist', () => {
    const firstVar = 1
    const secondVar = 2
    const result = varToString({ firstVar, secondVar })
    expect(result).toBe('firstVar')
  })

  it('should work with different variable types', () => {
    const stringVar = 'hello'
    expect(varToString({ stringVar })).toBe('stringVar')

    const numberVar = 123
    expect(varToString({ numberVar })).toBe('numberVar')

    const booleanVar = true
    expect(varToString({ booleanVar })).toBe('booleanVar')

    const arrayVar = [1, 2, 3]
    expect(varToString({ arrayVar })).toBe('arrayVar')

    const objectVar = { key: 'value' }
    expect(varToString({ objectVar })).toBe('objectVar')
  })

  it('should work with function variables', () => {
    const myFunction = () => {}
    expect(varToString({ myFunction })).toBe('myFunction')

    function namedFunction() {}
    expect(varToString({ namedFunction })).toBe('namedFunction')
  })

  it('should work with complex variable names', () => {
    const camelCaseVar = 'test'
    expect(varToString({ camelCaseVar })).toBe('camelCaseVar')

    const snake_case_var = 'test'
    expect(varToString({ snake_case_var })).toBe('snake_case_var')

    const $dollarVar = 'test'
    expect(varToString({ $dollarVar })).toBe('$dollarVar')

    const _underscoreVar = 'test'
    expect(varToString({ _underscoreVar })).toBe('_underscoreVar')
  })

  it('should handle empty object gracefully', () => {
    const result = varToString({})
    expect(result).toBeUndefined()
  })

  it('should work with literal property values', () => {
    const result1 = varToString({ literalString: 'value' })
    expect(result1).toBe('literalString')

    const result2 = varToString({ literalNumber: 42 })
    expect(result2).toBe('literalNumber')
  })

  it('should preserve variable name regardless of value', () => {
    const myVar = null
    expect(varToString({ myVar })).toBe('myVar')

    const undefinedVar = undefined
    expect(varToString({ undefinedVar })).toBe('undefinedVar')

    const zeroVar = 0
    expect(varToString({ zeroVar })).toBe('zeroVar')

    const emptyStringVar = ''
    expect(varToString({ emptyStringVar })).toBe('emptyStringVar')
  })

  it('should work in practical debugging scenarios', () => {
    // Simulating the use case shown in the original file
    const someVar = 42
    const displayName = varToString({ someVar })
    expect(displayName).toBe('someVar')

    // Multiple variables scenario
    const userName = 'Alice'
    const userAge = 30
    const userActive = true

    expect(varToString({ userName })).toBe('userName')
    expect(varToString({ userAge })).toBe('userAge')
    expect(varToString({ userActive })).toBe('userActive')
  })

  it('should work with destructured assignments', () => {
    const obj = { prop1: 'value1', prop2: 'value2' }
    const { prop1, prop2 } = obj

    expect(varToString({ prop1 })).toBe('prop1')
    expect(varToString({ prop2 })).toBe('prop2')
  })
})
