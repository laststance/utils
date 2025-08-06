import { describe, it, expect } from 'vitest'

import { difference, intersection, union } from './setOperations.js'

describe('difference', () => {
  describe('basic functionality', () => {
    it('should return elements in first array but not in second', () => {
      const result = difference([1, 2, 3, 4], [2, 3, 5])
      expect(result).toEqual([1, 4])
    })

    it('should work with strings', () => {
      const result = difference(['a', 'b', 'c'], ['b', 'd'])
      expect(result).toEqual(['a', 'c'])
    })

    it('should preserve order from first array', () => {
      const result = difference([5, 3, 1, 4, 2], [2, 4])
      expect(result).toEqual([5, 3, 1])
    })

    it('should handle duplicates in first array', () => {
      const result = difference([1, 2, 2, 3, 3], [2])
      expect(result).toEqual([1, 3, 3])
    })
  })

  describe('edge cases', () => {
    it('should handle empty first array', () => {
      const result = difference([], [1, 2, 3])
      expect(result).toEqual([])
    })

    it('should handle empty second array', () => {
      const result = difference([1, 2, 3], [])
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle both arrays empty', () => {
      const result = difference([], [])
      expect(result).toEqual([])
    })

    it('should handle no common elements', () => {
      const result = difference([1, 2, 3], [4, 5, 6])
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle all elements in common', () => {
      const result = difference([1, 2, 3], [1, 2, 3, 4])
      expect(result).toEqual([])
    })
  })

  describe('special values', () => {
    it('should handle null and undefined', () => {
      const result = difference([null, undefined, 1], [null, 2])
      expect(result).toEqual([undefined, 1])
    })

    it('should handle NaN correctly', () => {
      const result = difference([NaN, 1, 2], [NaN, 3])
      expect(result).toEqual([1, 2])
    })

    it('should handle objects by reference', () => {
      const obj1 = { id: 1 }
      const obj2 = { id: 2 }
      const obj3 = { id: 1 } // Different reference than obj1

      const result = difference([obj1, obj2], [obj1, obj3])
      expect(result).toEqual([obj2])
    })
  })
})

describe('intersection', () => {
  describe('basic functionality', () => {
    it('should return common elements', () => {
      const result = intersection([1, 2, 3, 4], [2, 3, 5])
      expect(result).toEqual([2, 3])
    })

    it('should work with strings', () => {
      const result = intersection(['a', 'b', 'c'], ['b', 'c', 'd'])
      expect(result).toEqual(['b', 'c'])
    })

    it('should preserve order from first array', () => {
      const result = intersection([3, 1, 4, 2], [2, 3, 5])
      expect(result).toEqual([3, 2])
    })

    it('should remove duplicates from result', () => {
      const result = intersection([1, 2, 2, 3], [2, 2, 4])
      expect(result).toEqual([2])
    })

    it('should handle duplicates in both arrays', () => {
      const result = intersection([1, 2, 2, 3, 3], [2, 3, 3, 4])
      expect(result).toEqual([2, 3])
    })
  })

  describe('edge cases', () => {
    it('should handle empty first array', () => {
      const result = intersection([], [1, 2, 3])
      expect(result).toEqual([])
    })

    it('should handle empty second array', () => {
      const result = intersection([1, 2, 3], [])
      expect(result).toEqual([])
    })

    it('should handle both arrays empty', () => {
      const result = intersection([], [])
      expect(result).toEqual([])
    })

    it('should handle no common elements', () => {
      const result = intersection([1, 2, 3], [4, 5, 6])
      expect(result).toEqual([])
    })

    it('should handle identical arrays', () => {
      const result = intersection([1, 2, 3], [1, 2, 3])
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('special values', () => {
    it('should handle null and undefined', () => {
      const result = intersection([null, undefined, 1], [null, 2])
      expect(result).toEqual([null])
    })

    it('should handle NaN correctly', () => {
      const result = intersection([NaN, 1, 2], [NaN, 3])
      expect(result).toEqual([NaN])
    })

    it('should handle objects by reference', () => {
      const obj1 = { id: 1 }
      const obj2 = { id: 2 }
      const obj3 = { id: 1 } // Different reference than obj1

      const result = intersection([obj1, obj2, obj3], [obj1, obj3])
      expect(result).toEqual([obj1, obj3])
    })
  })
})

describe('union', () => {
  describe('basic functionality', () => {
    it('should combine unique elements from multiple arrays', () => {
      const result = union([1, 2], [2, 3], [3, 4])
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should work with strings', () => {
      const result = union(['a', 'b'], ['b', 'c'], ['c', 'd'])
      expect(result).toEqual(['a', 'b', 'c', 'd'])
    })

    it('should preserve order of first occurrence', () => {
      const result = union([3, 1], [1, 4], [4, 2])
      expect(result).toEqual([3, 1, 4, 2])
    })

    it('should work with single array', () => {
      const result = union([1, 2, 2, 3])
      expect(result).toEqual([1, 2, 3])
    })

    it('should work with two arrays', () => {
      const result = union([1, 2, 3], [3, 4, 5])
      expect(result).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = union([], [1, 2], [], [3])
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle all empty arrays', () => {
      const result = union([], [], [])
      expect(result).toEqual([])
    })

    it('should handle no arguments', () => {
      const result = union()
      expect(result).toEqual([])
    })

    it('should handle single empty array', () => {
      const result = union([])
      expect(result).toEqual([])
    })

    it('should handle arrays with duplicates', () => {
      const result = union([1, 1, 2], [2, 2, 3], [3, 3, 1])
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('special values', () => {
    it('should handle null and undefined', () => {
      const result = union([null, 1], [undefined, 1], [null])
      expect(result).toEqual([null, 1, undefined])
    })

    it('should handle NaN correctly', () => {
      const result = union([NaN, 1], [NaN, 2])
      expect(result).toEqual([NaN, 1, 2])
    })

    it('should handle objects by reference', () => {
      const obj1 = { id: 1 }
      const obj2 = { id: 2 }
      const obj3 = { id: 1 } // Different reference than obj1

      const result = union([obj1, obj2], [obj1, obj3])
      expect(result).toEqual([obj1, obj2, obj3])
    })
  })

  describe('many arrays', () => {
    it('should handle many small arrays', () => {
      const result = union([1], [2], [3], [4], [5])
      expect(result).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle array with overlapping elements', () => {
      const result = union([1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6])
      expect(result).toEqual([1, 2, 3, 4, 5, 6])
    })
  })
})

describe('set operations immutability', () => {
  it('should not modify input arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [2, 3, 4]
    const arr1Copy = [...arr1]
    const arr2Copy = [...arr2]

    difference(arr1, arr2)
    intersection(arr1, arr2)
    union(arr1, arr2)

    expect(arr1).toEqual(arr1Copy)
    expect(arr2).toEqual(arr2Copy)
  })

  it('should return new arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [2, 3, 4]

    const diff = difference(arr1, arr2)
    const inter = intersection(arr1, arr2)
    const uni = union(arr1, arr2)

    expect(diff).not.toBe(arr1)
    expect(diff).not.toBe(arr2)
    expect(inter).not.toBe(arr1)
    expect(inter).not.toBe(arr2)
    expect(uni).not.toBe(arr1)
    expect(uni).not.toBe(arr2)
  })
})

describe('set operations performance', () => {
  it('should handle large arrays efficiently', () => {
    const largeArray1 = Array.from({ length: 5000 }, (_, i) => i)
    const largeArray2 = Array.from({ length: 5000 }, (_, i) => i + 2500)

    const startTime = performance.now()
    const diff = difference(largeArray1, largeArray2)
    const inter = intersection(largeArray1, largeArray2)
    const uni = union(largeArray1, largeArray2)
    const endTime = performance.now()

    expect(diff).toHaveLength(2500)
    expect(inter).toHaveLength(2500)
    expect(uni).toHaveLength(7500)
    expect(endTime - startTime).toBeLessThan(100) // Should be reasonably fast
  })
})

describe('set operations type safety', () => {
  it('should work with complex objects', () => {
    interface User {
      id: number
      name: string
    }

    const user1 = { id: 1, name: 'Alice' }
    const user2 = { id: 2, name: 'Bob' }
    const user3 = { id: 3, name: 'Charlie' }

    const users1: User[] = [user1, user2]
    const users2: User[] = [user2, user3] // Same user2 reference

    const diff = difference(users1, users2)
    const inter = intersection(users1, users2)
    const uni = union(users1, users2)

    // TypeScript should preserve User[] type
    expect(diff).toHaveLength(1)
    expect(diff[0]?.name).toBe('Alice')
    expect(inter).toHaveLength(1)
    expect(inter[0]?.name).toBe('Bob')
    expect(uni).toHaveLength(3)
  })

  it('should work with readonly arrays', () => {
    const readonly1: readonly number[] = [1, 2, 3]
    const readonly2: readonly number[] = [2, 3, 4]

    const diff = difference(readonly1, readonly2)
    const inter = intersection(readonly1, readonly2)
    const uni = union(readonly1, readonly2)

    expect(diff).toEqual([1])
    expect(inter).toEqual([2, 3])
    expect(uni).toEqual([1, 2, 3, 4])
  })
})

describe('practical use cases', () => {
  it('should work for permission management', () => {
    const userPermissions = ['read', 'write', 'delete']
    const rolePermissions = ['read', 'write', 'admin']
    const requiredPermissions = ['read', 'admin']

    const extraPermissions = difference(userPermissions, rolePermissions)
    const commonPermissions = intersection(userPermissions, rolePermissions)
    const allPermissions = union(
      userPermissions,
      rolePermissions,
      requiredPermissions,
    )

    expect(extraPermissions).toEqual(['delete'])
    expect(commonPermissions).toEqual(['read', 'write'])
    expect(allPermissions).toEqual(['read', 'write', 'delete', 'admin'])
  })

  it('should work for tag management', () => {
    const post1Tags = ['javascript', 'react', 'frontend']
    const post2Tags = ['react', 'typescript', 'backend']
    const post3Tags = ['javascript', 'nodejs', 'backend']

    const uniqueToPost1 = difference(post1Tags, [...post2Tags, ...post3Tags])
    const commonTags = intersection(post1Tags, post2Tags)
    const allTags = union(post1Tags, post2Tags, post3Tags)

    expect(uniqueToPost1).toEqual(['frontend'])
    expect(commonTags).toEqual(['react'])
    expect(allTags).toEqual([
      'javascript',
      'react',
      'frontend',
      'typescript',
      'backend',
      'nodejs',
    ])
  })
})
