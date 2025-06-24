import { describe, it, expect, afterEach, vi } from 'vitest'
import { yyyy_mm_dd } from './yyyy-mm-dd.js'

describe('yyyy_mm_dd', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return current date in YYYY-MM-DD format', () => {
    // Mock a specific date
    const mockDate = new Date('2023-12-25T10:30:45.123Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
    
    const result = yyyy_mm_dd()
    expect(result).toBe('2023-12-25')
  })

  it('should return correct format for different dates', () => {
    // Test January 1st
    const jan1 = new Date('2024-01-01T00:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(jan1)
    expect(yyyy_mm_dd()).toBe('2024-01-01')
    
    // Test December 31st
    const dec31 = new Date('2023-12-31T23:59:59.999Z')
    vi.setSystemTime(dec31)
    expect(yyyy_mm_dd()).toBe('2023-12-31')
    
    // Test leap year date
    const leapDay = new Date('2024-02-29T12:00:00.000Z')
    vi.setSystemTime(leapDay)
    expect(yyyy_mm_dd()).toBe('2024-02-29')
  })

  it('should handle single digit months and days with zero padding', () => {
    // Test early month/day
    const earlyDate = new Date('2023-01-05T15:30:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(earlyDate)
    expect(yyyy_mm_dd()).toBe('2023-01-05')
    
    // Test single digit month and day
    const singleDigits = new Date('2023-03-07T08:45:00.000Z')
    vi.setSystemTime(singleDigits)
    expect(yyyy_mm_dd()).toBe('2023-03-07')
  })

  it('should work across different time zones (returns UTC date)', () => {
    // The function uses toISOString() which always returns UTC
    const utcDate = new Date('2023-07-15T23:30:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(utcDate)
    expect(yyyy_mm_dd()).toBe('2023-07-15')
    
    // Even if the local time would be next day, ISO string is UTC
    const lateUTC = new Date('2023-07-15T23:59:59.999Z')
    vi.setSystemTime(lateUTC)
    expect(yyyy_mm_dd()).toBe('2023-07-15')
  })

  it('should return string in correct format structure', () => {
    const mockDate = new Date('2023-06-15T12:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
    
    const result = yyyy_mm_dd()
    
    // Check format structure
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result.split('-')).toHaveLength(3)
    expect(result.split('-')[0]).toHaveLength(4) // year
    expect(result.split('-')[1]).toHaveLength(2) // month
    expect(result.split('-')[2]).toHaveLength(2) // day
  })

  it('should work with various years', () => {
    // Test year 2000
    const y2k = new Date('2000-06-15T12:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(y2k)
    expect(yyyy_mm_dd()).toBe('2000-06-15')
    
    // Test year with high digits
    const future = new Date('2099-11-30T10:15:30.000Z')
    vi.setSystemTime(future)
    expect(yyyy_mm_dd()).toBe('2099-11-30')
    
    // Test early 21st century
    const early2000s = new Date('2001-02-28T16:45:00.000Z')
    vi.setSystemTime(early2000s)
    expect(yyyy_mm_dd()).toBe('2001-02-28')
  })

  it('should consistently split ISO string correctly', () => {
    // The function relies on splitting 'YYYY-MM-DDTHH:mm:ss.sssZ' on 'T'
    const testDate = new Date('2023-08-20T14:25:10.500Z')
    vi.useFakeTimers()
    vi.setSystemTime(testDate)
    
    const isoString = testDate.toISOString()
    const datePart = isoString.split('T')[0]
    
    expect(datePart).toBe('2023-08-20')
    expect(yyyy_mm_dd()).toBe(datePart)
  })

  it('should handle edge case months', () => {
    // Test all months to ensure proper zero-padding
    const testDates = [
      ['2023-01-15', '2023-01-15'],
      ['2023-02-15', '2023-02-15'],
      ['2023-03-15', '2023-03-15'],
      ['2023-04-15', '2023-04-15'],
      ['2023-05-15', '2023-05-15'],
      ['2023-06-15', '2023-06-15'],
      ['2023-07-15', '2023-07-15'],
      ['2023-08-15', '2023-08-15'],
      ['2023-09-15', '2023-09-15'],
      ['2023-10-15', '2023-10-15'],
      ['2023-11-15', '2023-11-15'],
      ['2023-12-15', '2023-12-15']
    ]
    
    vi.useFakeTimers()
    
    testDates.forEach(([input, expected]) => {
      const date = new Date(input + 'T12:00:00.000Z')
      vi.setSystemTime(date)
      expect(yyyy_mm_dd()).toBe(expected)
    })
  })
})