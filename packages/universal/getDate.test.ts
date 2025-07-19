import { getDate } from './getDate.js'

describe('getDate function', () => {
  it('should return a string', () => {
    const result = getDate()
    expect(typeof result).toBe('string')
  })

  it('should return a date in the format YYYY-MM-DD', () => {
    const result = getDate()
    const datePattern = /\d{4}-\d{2}-\d{2}/
    expect(datePattern.test(result)).toBe(true)
  })

  it("should return today's date", () => {
    const result = getDate()
    const today = new Date().toISOString().split('T')[0]
    expect(result).toBe(today)
  })
})
