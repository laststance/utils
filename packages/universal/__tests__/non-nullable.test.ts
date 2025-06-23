import { describe, it, expect } from 'vitest'
import { nonNullable } from '../non-nullable'

describe('nonNullable', () => {
  it('should return true for truthy values', () => {
    expect(nonNullable(1)).toBe(true)
    expect(nonNullable('hello')).toBe(true)
    expect(nonNullable(true)).toBe(true)
    expect(nonNullable([])).toBe(true)
    expect(nonNullable({})).toBe(true)
    expect(nonNullable(new Date())).toBe(true)
    expect(nonNullable(Symbol('test'))).toBe(true)
  })

  it('should return true for falsy values that are not null or undefined', () => {
    expect(nonNullable(0)).toBe(true)
    expect(nonNullable('')).toBe(true)
    expect(nonNullable(false)).toBe(true)
    expect(nonNullable(NaN)).toBe(true)
  })

  it('should return false for null', () => {
    expect(nonNullable(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(nonNullable(undefined)).toBe(false)
  })

  it('should work as array filter', () => {
    const mixed = [1, null, 'hello', undefined, true, 0, '', false]
    const filtered = mixed.filter(nonNullable)
    
    expect(filtered).toEqual([1, 'hello', true, 0, '', false])
    expect(filtered).not.toContain(null)
    expect(filtered).not.toContain(undefined)
  })

  it('should work with complex array filtering', () => {
    const users = [
      { name: 'Alice', age: 30 },
      null,
      { name: 'Bob', age: 25 },
      undefined,
      { name: 'Charlie', age: 35 }
    ]
    
    const validUsers = users.filter(nonNullable)
    
    expect(validUsers).toHaveLength(3)
    expect(validUsers.every(user => user.name && typeof user.age === 'number')).toBe(true)
  })

  it('should handle edge cases with objects', () => {
    const objWithNull = { value: null }
    const objWithUndefined = { value: undefined }
    const objWithValue = { value: 'test' }
    
    expect(nonNullable(objWithNull)).toBe(true) // object itself is not null
    expect(nonNullable(objWithUndefined)).toBe(true) // object itself is not undefined
    expect(nonNullable(objWithValue)).toBe(true)
  })

  it('should work with function return values', () => {
    const maybeGetValue = (flag: boolean): string | null => {
      return flag ? 'value' : null
    }
    
    const maybeGetValue2 = (flag: boolean): string | undefined => {
      return flag ? 'value' : undefined
    }
    
    expect(nonNullable(maybeGetValue(true))).toBe(true)
    expect(nonNullable(maybeGetValue(false))).toBe(false)
    expect(nonNullable(maybeGetValue2(true))).toBe(true)
    expect(nonNullable(maybeGetValue2(false))).toBe(false)
  })

  it('should preserve type information when used as type guard', () => {
    const value: string | null = 'test'
    
    if (nonNullable(value)) {
      // TypeScript should know value is string here, not string | null
      expect(typeof value).toBe('string')
      expect(value.toUpperCase()).toBe('TEST') // Should compile without error
    }
  })

  it('should work with union types in arrays', () => {
    const mixedValues: (number | string | null | undefined | boolean)[] = [
      1, null, 'hello', undefined, true, 0, '', false, 42, 'world'
    ]
    
    const definedValues = mixedValues.filter(nonNullable)
    
    expect(definedValues).toEqual([1, 'hello', true, 0, '', false, 42, 'world'])
    expect(definedValues).toHaveLength(8)
  })
})