import { describe, it, expect } from 'vitest'

import { partition } from './partition.js'

describe('partition', () => {
  describe('basic functionality', () => {
    it('should separate numbers into even and odd', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const [evens, odds] = partition(numbers, (n) => n % 2 === 0)

      expect(evens).toEqual([2, 4, 6, 8, 10])
      expect(odds).toEqual([1, 3, 5, 7, 9])
    })

    it('should separate objects by property', () => {
      const users = [
        { name: 'Alice', active: true, age: 30 },
        { name: 'Bob', active: false, age: 25 },
        { name: 'Charlie', active: true, age: 35 },
        { name: 'Diana', active: false, age: 28 },
      ]

      const [activeUsers, inactiveUsers] = partition(
        users,
        (user) => user.active,
      )

      expect(activeUsers).toEqual([
        { name: 'Alice', active: true, age: 30 },
        { name: 'Charlie', active: true, age: 35 },
      ])
      expect(inactiveUsers).toEqual([
        { name: 'Bob', active: false, age: 25 },
        { name: 'Diana', active: false, age: 28 },
      ])
    })

    it('should use index parameter in predicate', () => {
      const items = ['a', 'b', 'c', 'd', 'e', 'f']
      const [evenIndices, oddIndices] = partition(
        items,
        (_, index) => index % 2 === 0,
      )

      expect(evenIndices).toEqual(['a', 'c', 'e']) // Indices 0, 2, 4
      expect(oddIndices).toEqual(['b', 'd', 'f']) // Indices 1, 3, 5
    })

    it('should work with string predicates', () => {
      const emails = [
        'valid@email.com',
        'invalid-email',
        'another@valid.com',
        'also-invalid',
      ]
      const [validEmails, invalidEmails] = partition(emails, (email) =>
        email.includes('@'),
      )

      expect(validEmails).toEqual(['valid@email.com', 'another@valid.com'])
      expect(invalidEmails).toEqual(['invalid-email', 'also-invalid'])
    })

    it('should work with complex predicates', () => {
      const products = [
        { name: 'Laptop', price: 1000, category: 'electronics' },
        { name: 'Book', price: 15, category: 'books' },
        { name: 'Phone', price: 500, category: 'electronics' },
        { name: 'Magazine', price: 5, category: 'books' },
      ]

      const [expensiveElectronics, others] = partition(
        products,
        (p) => p.category === 'electronics' && p.price > 600,
      )

      expect(expensiveElectronics).toEqual([
        { name: 'Laptop', price: 1000, category: 'electronics' },
      ])
      expect(others).toEqual([
        { name: 'Book', price: 15, category: 'books' },
        { name: 'Phone', price: 500, category: 'electronics' },
        { name: 'Magazine', price: 5, category: 'books' },
      ])
    })
  })

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const [truthy, falsy] = partition([], () => true)
      expect(truthy).toEqual([])
      expect(falsy).toEqual([])
    })

    it('should handle single element arrays', () => {
      const [truthy, falsy] = partition([42], (n) => n > 40)
      expect(truthy).toEqual([42])
      expect(falsy).toEqual([])

      const [truthy2, falsy2] = partition([5], (n) => n > 40)
      expect(truthy2).toEqual([])
      expect(falsy2).toEqual([5])
    })

    it('should handle all elements matching predicate', () => {
      const [truthy, falsy] = partition([2, 4, 6, 8], (n) => n % 2 === 0)
      expect(truthy).toEqual([2, 4, 6, 8])
      expect(falsy).toEqual([])
    })

    it('should handle no elements matching predicate', () => {
      const [truthy, falsy] = partition([1, 3, 5, 7], (n) => n % 2 === 0)
      expect(truthy).toEqual([])
      expect(falsy).toEqual([1, 3, 5, 7])
    })

    it('should handle null and undefined values', () => {
      const values = [1, null, 2, undefined, 3, null]
      const [nullish, nonNullish] = partition(
        values,
        (v) => v === null || v === undefined,
      )

      expect(nullish).toEqual([null, undefined, null])
      expect(nonNullish).toEqual([1, 2, 3])
    })
  })

  describe('type safety', () => {
    it('should work with different data types', () => {
      const mixed = [1, 'two', 3, 'four', 5]
      const [numbers, strings] = partition(
        mixed,
        (item) => typeof item === 'number',
      )

      expect(numbers).toEqual([1, 3, 5])
      expect(strings).toEqual(['two', 'four'])
    })

    it('should preserve object types', () => {
      interface User {
        id: number
        name: string
        admin: boolean
      }

      const users: User[] = [
        { id: 1, name: 'Alice', admin: true },
        { id: 2, name: 'Bob', admin: false },
        { id: 3, name: 'Charlie', admin: true },
      ]

      const [admins, regularUsers] = partition(users, (user) => user.admin)

      // TypeScript should infer User[] for both arrays
      expect(admins[0]?.id).toBe(1)
      expect(regularUsers[0]?.name).toBe('Bob')
    })

    it('should work with union types', () => {
      type Item = { type: 'A'; valueA: number } | { type: 'B'; valueB: string }

      const items: Item[] = [
        { type: 'A', valueA: 1 },
        { type: 'B', valueB: 'hello' },
        { type: 'A', valueA: 2 },
      ]

      const [typeA, typeB] = partition(items, (item) => item.type === 'A')

      expect(typeA).toHaveLength(2)
      expect(typeB).toHaveLength(1)
    })
  })

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const originalCopy = [...original]

      partition(original, (n) => n % 2 === 0)

      expect(original).toEqual(originalCopy)
    })

    it('should not modify original objects', () => {
      const users = [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
      ]
      const usersCopy = JSON.parse(JSON.stringify(users))

      const [activeUsers, inactiveUsers] = partition(users, (u) => u.active)

      expect(users).toEqual(usersCopy)
      expect(activeUsers[0]).toBe(users[0]) // Should reference same object
      expect(inactiveUsers[0]).toBe(users[1])
    })
  })

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i)

      const startTime = performance.now()
      const [evens, odds] = partition(largeArray, (n) => n % 2 === 0)
      const endTime = performance.now()

      expect(evens).toHaveLength(5000)
      expect(odds).toHaveLength(5000)
      expect(endTime - startTime).toBeLessThan(50) // Should be reasonably fast
    })

    it('should only iterate through the array once', () => {
      let callCount = 0
      const items = [1, 2, 3, 4, 5]

      partition(items, (n) => {
        callCount++
        return n % 2 === 0
      })

      expect(callCount).toBe(5) // Should call predicate exactly once per item
    })
  })

  describe('error handling', () => {
    it('should handle predicate function throwing errors', () => {
      const items = [1, 2, 3]
      const predicate = (n: number) => {
        if (n === 2) throw new Error('Predicate error')
        return n % 2 === 0
      }

      expect(() => partition(items, predicate)).toThrow('Predicate error')
    })

    it('should handle boolean coercion correctly', () => {
      const values = [0, 1, '', 'hello', false, true, null, undefined, [], {}]
      const [truthy, falsy] = partition(values, Boolean)

      expect(truthy).toEqual([1, 'hello', true, [], {}])
      expect(falsy).toEqual([0, '', false, null, undefined])
    })
  })

  describe('practical use cases', () => {
    it('should separate valid and invalid data', () => {
      const data = [
        { email: 'valid@example.com', age: 25 },
        { email: 'invalid-email', age: 30 },
        { email: 'another@valid.com', age: -5 }, // Invalid age
        { email: 'valid@test.com', age: 35 },
      ]

      const [validRecords, invalidRecords] = partition(
        data,
        (record) => record.email.includes('@') && record.age > 0,
      )

      expect(validRecords).toEqual([
        { email: 'valid@example.com', age: 25 },
        { email: 'valid@test.com', age: 35 },
      ])
      expect(invalidRecords).toEqual([
        { email: 'invalid-email', age: 30 },
        { email: 'another@valid.com', age: -5 },
      ])
    })

    it('should separate files by type', () => {
      const files = [
        'document.pdf',
        'image.jpg',
        'spreadsheet.xlsx',
        'photo.png',
        'presentation.pptx',
        'video.mp4',
      ]

      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
      const [images, others] = partition(files, (file) =>
        imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
      )

      expect(images).toEqual(['image.jpg', 'photo.png'])
      expect(others).toEqual([
        'document.pdf',
        'spreadsheet.xlsx',
        'presentation.pptx',
        'video.mp4',
      ])
    })

    it('should separate tasks by priority', () => {
      const tasks = [
        { id: 1, title: 'Fix bug', priority: 'high', completed: false },
        { id: 2, title: 'Write tests', priority: 'medium', completed: true },
        { id: 3, title: 'Update docs', priority: 'low', completed: false },
        { id: 4, title: 'Review PR', priority: 'high', completed: false },
      ]

      const [highPriority] = partition(
        tasks,
        (task) => task.priority === 'high' && !task.completed,
      )

      expect(highPriority).toEqual([
        { id: 1, title: 'Fix bug', priority: 'high', completed: false },
        { id: 4, title: 'Review PR', priority: 'high', completed: false },
      ])
    })
  })

  describe('readonly arrays', () => {
    it('should work with readonly arrays', () => {
      const readonlyArray: readonly number[] = [1, 2, 3, 4, 5]
      const [evens, odds] = partition(readonlyArray, (n) => n % 2 === 0)

      expect(evens).toEqual([2, 4])
      expect(odds).toEqual([1, 3, 5])
    })
  })
})
