import fs from 'fs'
import os from 'os'

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { writeJson } from './writeJson.js'

// Mock fs and os modules
vi.mock('fs', () => ({
  default: {
    writeFileSync: vi.fn(),
  },
}))

vi.mock('os', () => ({
  default: {
    EOL: '\n',
  },
}))

describe('writeJson', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset RegExp prototype before each test
    delete RegExp.prototype.toJSON
  })

  afterEach(() => {
    // Clean up RegExp prototype after each test
    delete RegExp.prototype.toJSON
  })

  describe('object handling', () => {
    it('should write object to JSON file with correct formatting', () => {
      const testObject = { name: 'test', value: 42 }
      const fileName = 'testObject'

      writeJson(fileName, testObject)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'testObject.json',
        '{\n  "name": "test",\n  "value": 42\n}\n',
      )
    })

    it('should handle complex objects', () => {
      const complexObject = {
        string: 'hello',
        number: 123,
        boolean: true,
        null: null,
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
      }
      const fileName = 'complex'

      writeJson(fileName, complexObject)

      const expectedContent =
        JSON.stringify(complexObject, null, 2).replace(/\n/g, os.EOL) + os.EOL
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'complex.json',
        expectedContent,
      )
    })

    it('should handle empty objects', () => {
      const emptyObject = {}
      const fileName = 'empty'

      writeJson(fileName, emptyObject)

      expect(fs.writeFileSync).toHaveBeenCalledWith('empty.json', '{}\n')
    })

    it('should add RegExp toJSON serialization for objects', () => {
      const objectWithRegex = {
        pattern: /test/gi,
        name: 'regex test',
      }
      const fileName = 'regex'

      writeJson(fileName, objectWithRegex)

      // Verify RegExp.prototype.toJSON was set
      expect(RegExp.prototype.toJSON).toBe(RegExp.prototype.toString)

      // Verify the file was written (exact content depends on RegExp serialization)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'regex.json',
        expect.stringContaining('"pattern"'),
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'regex.json',
        expect.stringContaining('"name": "regex test"'),
      )
    })
  })

  describe('array handling', () => {
    it('should wrap arrays in object with fileName as key', () => {
      const testArray = ['item1', 'item2', 'item3']
      const fileName = 'testArray'

      writeJson(fileName, testArray)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'testArray.json',
        '{\n  "testArray": [\n    "item1",\n    "item2",\n    "item3"\n  ]\n}\n',
      )
    })

    it('should handle empty arrays', () => {
      const emptyArray = []
      const fileName = 'emptyArray'

      writeJson(fileName, emptyArray)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'emptyArray.json',
        '{\n  "emptyArray": []\n}\n',
      )
    })

    it('should handle arrays with mixed types', () => {
      const mixedArray = ['string', 42, true, null, { key: 'value' }]
      const fileName = 'mixed'

      writeJson(fileName, mixedArray)

      const expectedObject = { mixed: mixedArray }
      const expectedContent =
        JSON.stringify(expectedObject, null, 2).replace(/\n/g, os.EOL) + os.EOL

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'mixed.json',
        expectedContent,
      )
    })

    it('should handle nested arrays', () => {
      const nestedArray = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      const fileName = 'nested'

      writeJson(fileName, nestedArray)

      const expectedObject = { nested: nestedArray }
      const expectedContent =
        JSON.stringify(expectedObject, null, 2).replace(/\n/g, os.EOL) + os.EOL

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'nested.json',
        expectedContent,
      )
    })
  })

  describe('file naming', () => {
    it('should add .json extension to filename', () => {
      const data = { test: true }

      writeJson('filename', data)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'filename.json',
        expect.any(String),
      )

      writeJson('another-file', data)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'another-file.json',
        expect.any(String),
      )
    })

    it('should work with filenames containing special characters', () => {
      const data = { test: true }

      writeJson('file_with_underscores', data)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'file_with_underscores.json',
        expect.any(String),
      )

      writeJson('file-with-dashes', data)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'file-with-dashes.json',
        expect.any(String),
      )
    })
  })

  describe('line ending handling', () => {
    it('should use platform-specific line endings for objects', () => {
      // Mock different EOL values
      const windowsEOL = '\r\n'
      const unixEOL = '\n'

      const testObject = { key: 'value' }

      // Test Windows EOL
      os.EOL = windowsEOL
      writeJson('test', testObject)

      let expectedContent =
        JSON.stringify(testObject, null, 2).replace(/\n/g, windowsEOL) +
        windowsEOL
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test.json',
        expectedContent,
      )

      // Reset mock
      fs.writeFileSync.mockClear()

      // Test Unix EOL
      os.EOL = unixEOL
      writeJson('test', testObject)

      expectedContent =
        JSON.stringify(testObject, null, 2).replace(/\n/g, unixEOL) + unixEOL
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test.json',
        expectedContent,
      )
    })

    it('should use platform-specific line endings for arrays', () => {
      const windowsEOL = '\r\n'
      const testArray = ['item1', 'item2']

      os.EOL = windowsEOL
      writeJson('test', testArray)

      const expectedObject = { test: testArray }
      const expectedContent =
        JSON.stringify(expectedObject, null, 2).replace(/\n/g, windowsEOL) +
        windowsEOL
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test.json',
        expectedContent,
      )
    })
  })

  describe('RegExp serialization', () => {
    it('should set RegExp.prototype.toJSON to RegExp.prototype.toString', () => {
      const objectWithRegex = { pattern: /test/g }

      expect(RegExp.prototype.toJSON).toBeUndefined()

      writeJson('test', objectWithRegex)

      expect(RegExp.prototype.toJSON).toBe(RegExp.prototype.toString)
    })

    it('should serialize RegExp objects correctly', () => {
      const regex = /test pattern/gi
      const objectWithRegex = { regex: regex }

      writeJson('regex-test', objectWithRegex)

      // The exact serialization depends on the RegExp toString implementation
      // but we can verify the structure is maintained
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'regex-test.json',
        expect.stringContaining('"regex"'),
      )
    })

    it('should not affect array processing RegExp handling', () => {
      const arrayWithRegex = [/pattern1/g, 'string', /pattern2/i]

      writeJson('array-regex', arrayWithRegex)

      // Arrays wrap in object, so RegExp.toJSON should still be set
      expect(RegExp.prototype.toJSON).toBe(RegExp.prototype.toString)
    })
  })

  describe('edge cases', () => {
    it('should handle null values', () => {
      writeJson('null-test', null)

      // Check that writeFileSync was called
      expect(fs.writeFileSync).toHaveBeenCalled()

      // Get the actual arguments
      const [filename, content] = fs.writeFileSync.mock.calls[0]

      // Check filename
      expect(filename).toBe('null-test.json')

      // Check content - the function should write "null" followed by EOL
      expect(content).toBe('null' + os.EOL)
    })

    it('should handle undefined values', () => {
      writeJson('undefined-test', undefined)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'undefined-test.json',
        expect.any(String),
      )
    })

    it('should handle objects with circular references gracefully', () => {
      const circular = { a: 1 }
      circular.self = circular

      // This should throw during JSON.stringify, which is expected behavior
      expect(() => writeJson('circular', circular)).toThrow()
    })

    it('should handle very large objects', () => {
      const largeObject = {}
      for (let i = 0; i < 1000; i++) {
        largeObject[`key${i}`] = `value${i}`
      }

      writeJson('large', largeObject)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'large.json',
        expect.stringContaining('"key0": "value0"'),
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'large.json',
        expect.stringContaining('"key999": "value999"'),
      )
    })
  })

  describe('integration scenarios', () => {
    it('should handle real-world configuration objects', () => {
      const config = {
        name: 'MyApp',
        version: '1.0.0',
        dependencies: ['react', 'vue'],
        settings: {
          debug: true,
          api: {
            url: 'https://api.example.com',
            timeout: 5000,
          },
        },
        patterns: [/\\.js$/, /\\.ts$/],
      }

      writeJson('config', config)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'config.json',
        expect.stringContaining('"name": "MyApp"'),
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'config.json',
        expect.stringContaining('"debug": true'),
      )
    })

    it('should handle data export scenarios', () => {
      const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ]

      writeJson('users', users)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'users.json',
        expect.stringContaining('"users": ['),
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'users.json',
        expect.stringContaining('"name": "Alice"'),
      )
    })
  })
})
