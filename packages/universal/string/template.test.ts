import { describe, it, expect } from 'vitest'

import { template, templateAdvanced } from './template.js'

describe('template', () => {
  describe('template', () => {
    describe('basic functionality', () => {
      it('should replace simple placeholders', () => {
        expect(template('Hello {name}!', { name: 'World' })).toBe('Hello World!')
        expect(template('Hi {firstName} {lastName}', { firstName: 'John', lastName: 'Doe' })).toBe('Hi John Doe')
        expect(template('Count: {count}', { count: 42 })).toBe('Count: 42')
      })

      it('should handle nested object properties', () => {
        const data = {
          user: { name: 'John', id: 123 },
          config: { theme: 'dark', version: '1.0.0' }
        }
        
        expect(template('User: {user.name} ({user.id})', data)).toBe('User: John (123)')
        expect(template('Theme: {config.theme} v{config.version}', data)).toBe('Theme: dark v1.0.0')
      })

      it('should handle array access', () => {
        const data = {
          users: [{ name: 'John' }, { name: 'Jane' }],
          colors: ['red', 'green', 'blue']
        }
        
        expect(template('First user: {users.0.name}', data)).toBe('First user: John')
        expect(template('Second user: {users.1.name}', data)).toBe('Second user: Jane')
        expect(template('First color: {colors.0}', data)).toBe('First color: red')
      })

      it('should handle different data types', () => {
        const data = {
          string: 'hello',
          number: 42,
          boolean: true,
          zero: 0,
          empty: '',
          array: [1, 2, 3]
        }
        
        expect(template('{string}', data)).toBe('hello')
        expect(template('{number}', data)).toBe('42')
        expect(template('{boolean}', data)).toBe('true')
        expect(template('{zero}', data)).toBe('0')
        expect(template('{empty}', data)).toBe('')
        expect(template('{array}', data)).toBe('1,2,3')
      })
    })

    describe('edge cases', () => {
      it('should handle missing keys with fallback', () => {
        expect(template('Hello {missing}', {}, { fallback: '[not found]' })).toBe('Hello [not found]')
        expect(template('Hi {name}', {}, { fallback: 'Guest' })).toBe('Hi Guest')
        expect(template('Count: {count}', {}, { fallback: '0' })).toBe('Count: 0')
      })

      it('should handle missing keys without fallback', () => {
        expect(template('Hello {missing}', {})).toBe('Hello ')
        expect(template('Hi {name}', {})).toBe('Hi ')
        expect(template('Count: {count}', {})).toBe('Count: ')
      })

      it('should handle null and undefined values', () => {
        const data = { nullValue: null, undefinedValue: undefined, emptyString: '' }
        
        expect(template('Null: {nullValue}', data)).toBe('Null: ')
        expect(template('Undefined: {undefinedValue}', data)).toBe('Undefined: ')
        expect(template('Empty: {emptyString}', data)).toBe('Empty: ')
        
        // With fallback
        expect(template('Null: {nullValue}', data, { fallback: 'N/A' })).toBe('Null: N/A')
        expect(template('Undefined: {undefinedValue}', data, { fallback: 'N/A' })).toBe('Undefined: N/A')
        expect(template('Empty: {emptyString}', data, { fallback: 'N/A' })).toBe('Empty: ')
      })

      it('should handle empty template strings', () => {
        expect(template('', { name: 'World' })).toBe('')
        expect(template('   ', { name: 'World' })).toBe('   ')
      })

      it('should handle templates with no placeholders', () => {
        expect(template('Hello World', { name: 'Test' })).toBe('Hello World')
        expect(template('No placeholders here!', {})).toBe('No placeholders here!')
      })

      it('should handle malformed placeholders', () => {
        expect(template('Hello {', { name: 'World' })).toBe('Hello {')
        expect(template('Hello }', { name: 'World' })).toBe('Hello }')
        expect(template('Hello {}', { name: 'World' })).toBe('Hello ')
        expect(template('Hello {  }', { name: 'World' })).toBe('Hello ')
      })

      it('should handle nested placeholders (should not evaluate)', () => {
        expect(template('Hello {{name}}', { name: 'World' })).toBe('Hello {World}')
        expect(template('Value: {{{count}}}', { count: 42 })).toBe('Value: {42}')
      })
    })

    describe('options', () => {
      describe('prefix and suffix', () => {
        it('should add prefix and suffix to values', () => {
          expect(template('Price: {price}', { price: '99.99' }, { prefix: '$' })).toBe('Price: $99.99')
          expect(template('Name: {name}', { name: 'John' }, { suffix: '!' })).toBe('Name: John!')
          expect(template('Value: {value}', { value: 42 }, { prefix: '(', suffix: ')' })).toBe('Value: (42)')
        })

        it('should not add prefix/suffix to fallback values', () => {
          expect(template('Price: {missing}', {}, { prefix: '$', fallback: 'N/A' })).toBe('Price: N/A')
          expect(template('Name: {missing}', {}, { suffix: '!', fallback: 'Unknown' })).toBe('Name: Unknown')
        })
      })

      describe('escapeHtml', () => {
        it('should escape HTML when enabled', () => {
          const data = { html: '<script>alert("xss")</script>' }
          expect(template('Content: {html}', data, { escapeHtml: true })).toBe('Content: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
          expect(template('Text: {html}', data, { escapeHtml: false })).toBe('Text: <script>alert("xss")</script>')
          expect(template('Text: {html}', data)).toBe('Text: <script>alert("xss")</script>')
        })

        it('should escape various HTML characters', () => {
          const data = { text: 'Hello & "World" <tag>' }
          expect(template('{text}', data, { escapeHtml: true })).toBe('Hello &amp; &quot;World&quot; &lt;tag&gt;')
        })

        it('should not escape fallback values', () => {
          expect(template('{missing}', {}, { escapeHtml: true, fallback: '<default>' })).toBe('<default>')
        })
      })

      describe('combined options', () => {
        it('should apply all options together', () => {
          const data = { price: '99.99', html: '<b>Bold</b>' }
          const options = { prefix: '$', suffix: ' USD', escapeHtml: true, fallback: 'N/A' }
          
          expect(template('Price: {price}', data, options)).toBe('Price: $99.99 USD')
          expect(template('HTML: {html}', data, options)).toBe('HTML: $&lt;b&gt;Bold&lt;/b&gt; USD')
          expect(template('Missing: {missing}', data, options)).toBe('Missing: N/A')
        })
      })
    })

    describe('complex nested data', () => {
      it('should handle deeply nested objects', () => {
        const data = {
          level1: {
            level2: {
              level3: {
                level4: {
                  value: 'deep value'
                }
              }
            }
          }
        }
        
        expect(template('Deep: {level1.level2.level3.level4.value}', data)).toBe('Deep: deep value')
      })

      it('should handle mixed arrays and objects', () => {
        const data = {
          company: {
            departments: [
              {
                name: 'Engineering',
                employees: [
                  { name: 'John', role: 'Developer' },
                  { name: 'Jane', role: 'Designer' }
                ]
              }
            ]
          }
        }
        
        expect(template('Dept: {company.departments.0.name}', data)).toBe('Dept: Engineering')
        expect(template('Employee: {company.departments.0.employees.0.name}', data)).toBe('Employee: John')
        expect(template('Role: {company.departments.0.employees.1.role}', data)).toBe('Role: Designer')
      })

      it('should handle invalid nested paths gracefully', () => {
        const data = { user: { name: 'John' } }
        
        expect(template('Missing: {user.missing.path}', data)).toBe('Missing: ')
        expect(template('Invalid: {missing.user.name}', data)).toBe('Invalid: ')
        expect(template('Array: {user.name.0}', data)).toBe('Array: ')
      })
    })

    describe('performance', () => {
      it('should handle large templates efficiently', () => {
        const data = { name: 'World', count: 42 }
        const largeTemplate = 'Hello {name}! Count: {count}. '.repeat(1000)
        
        const startTime = performance.now()
        const result = template(largeTemplate, data)
        const endTime = performance.now()
        
        expect(result).toContain('Hello World! Count: 42.')
        expect(result.match(/Hello World!/g)).toHaveLength(1000)
        expect(endTime - startTime).toBeLessThan(100)
      })

      it('should handle large data objects efficiently', () => {
        const data: Record<string, any> = {}
        for (let i = 0; i < 1000; i++) {
          data[`key${i}`] = `value${i}`
        }
        
        const startTime = performance.now()
        const result = template('Hello {key500}!', data)
        const endTime = performance.now()
        
        expect(result).toBe('Hello value500!')
        expect(endTime - startTime).toBeLessThan(10)
      })
    })

    describe('real-world examples', () => {
      it('should handle email templates', () => {
        const data = {
          user: { name: 'John Doe', email: 'john@example.com' },
          order: { id: '12345', total: 99.99, items: 3 }
        }
        
        const emailTemplate = `
          Hello {user.name},
          
          Thank you for your order #{order.id}.
          Total: {order.total} ({order.items} items)
          
          We'll send updates to {user.email}.
        `.trim()
        
        const result = template(emailTemplate, data, { prefix: '$' })
        expect(result).toContain('Hello John Doe')
        expect(result).toContain('order #12345')
        expect(result).toContain('Total: $99.99 ($3 items)')
        expect(result).toContain('john@example.com')
      })

      it('should handle configuration templates', () => {
        const config = {
          server: { host: 'localhost', port: 3000 },
          database: { url: 'mongodb://localhost:27017/myapp' },
          features: { auth: true, logging: false }
        }
        
        const configTemplate = 'Server: {server.host}:{server.port}, DB: {database.url}, Auth: {features.auth}'
        const result = template(configTemplate, config)
        
        expect(result).toBe('Server: localhost:3000, DB: mongodb://localhost:27017/myapp, Auth: true')
      })

      it('should handle internationalization templates', () => {
        const i18n = {
          messages: {
            welcome: 'Welcome',
            goodbye: 'Goodbye'
          },
          user: { name: 'María' }
        }
        
        expect(template('{messages.welcome} {user.name}!', i18n)).toBe('Welcome María!')
        expect(template('{messages.goodbye} {user.name}!', i18n)).toBe('Goodbye María!')
      })
    })
  })

  describe('templateAdvanced', () => {
    describe('conditional logic', () => {
      it('should handle ternary-like conditionals', () => {
        expect(templateAdvanced('Hello {user.name ? user.name : "Guest"}', { user: { name: 'John' } })).toBe('Hello John')
        expect(templateAdvanced('Hello {user.name ? user.name : "Guest"}', { user: {} })).toBe('Hello Guest')
        expect(templateAdvanced('Hello {missing ? "Found" : "Missing"}', {})).toBe('Hello Missing')
      })

      it('should handle equality checks', () => {
        expect(templateAdvanced('{count} item{count === 1 ? "" : "s"}', { count: 1 })).toBe('1 item')
        expect(templateAdvanced('{count} item{count === 1 ? "" : "s"}', { count: 5 })).toBe('5 items')
        expect(templateAdvanced('{count} item{count === 1 ? "" : "s"}', { count: 0 })).toBe('0 items')
      })

      it('should handle string equality checks', () => {
        expect(templateAdvanced('Status: {status === "active" ? "Online" : "Offline"}', { status: 'active' })).toBe('Status: Online')
        expect(templateAdvanced('Status: {status === "active" ? "Online" : "Offline"}', { status: 'inactive' })).toBe('Status: Offline')
      })

      it('should handle inequality checks', () => {
        expect(templateAdvanced('Role: {role !== "admin" ? "User" : "Administrator"}', { role: 'user' })).toBe('Role: User')
        expect(templateAdvanced('Role: {role !== "admin" ? "User" : "Administrator"}', { role: 'admin' })).toBe('Role: Administrator')
      })

      it('should handle nested property conditions', () => {
        const data = { user: { role: 'admin', active: true } }
        expect(templateAdvanced('Access: {user.role === "admin" ? "Full" : "Limited"}', data)).toBe('Access: Full')
        expect(templateAdvanced('Status: {user.active ? "Active" : "Inactive"}', data)).toBe('Status: Active')
      })
    })

    describe('edge cases', () => {
      it('should handle missing properties in conditions', () => {
        expect(templateAdvanced('Hello {missing ? "Found" : "Guest"}', {})).toBe('Hello Guest')
        expect(templateAdvanced('Count: {missing === 1 ? "One" : "Other"}', {})).toBe('Count: Other')
      })

      it('should handle complex nested conditionals', () => {
        const data = { user: { permissions: { canEdit: true } } }
        expect(templateAdvanced('Edit: {user.permissions.canEdit ? "Allowed" : "Denied"}', data)).toBe('Edit: Allowed')
      })

      it('should handle literal strings with spaces', () => {
        expect(templateAdvanced('Message: {user.name ? user.name : "Anonymous User"}', {})).toBe('Message: Anonymous User')
        expect(templateAdvanced('Status: {active ? "Currently Active" : "Not Active"}', { active: false })).toBe('Status: Not Active')
      })

      it('should fall back to regular template for non-conditional placeholders', () => {
        expect(templateAdvanced('Hello {name}! {count} items.', { name: 'John', count: 5 })).toBe('Hello John! 5 items.')
      })
    })

    describe('mixed usage', () => {
      it('should handle both conditional and regular placeholders', () => {
        const data = { user: { name: 'John', isAdmin: true }, count: 3 }
        const template = 'User: {user.name} ({user.isAdmin ? "Admin" : "User"}) - {count} item{count === 1 ? "" : "s"}'
        
        expect(templateAdvanced(template, data)).toBe('User: John (Admin) - 3 items')
      })

      it('should handle multiple conditionals in one template', () => {
        const data = { count: 0, user: { premium: false } }
        const template = '{count === 0 ? "No" : count} item{count === 1 ? "" : "s"} for {user.premium ? "premium" : "free"} user'
        
        expect(templateAdvanced(template, data)).toBe('No items for free user')
      })
    })

    describe('performance', () => {
      it('should handle complex templates efficiently', () => {
        const data = { items: [], user: { role: 'admin' }, count: 0 }
        const complexTemplate = 'Status: {user.role === "admin" ? "Administrator" : "User"} with {count === 0 ? "no" : count} item{count === 1 ? "" : "s"}'
        
        const startTime = performance.now()
        const result = templateAdvanced(complexTemplate, data)
        const endTime = performance.now()
        
        expect(result).toBe('Status: Administrator with no items')
        expect(endTime - startTime).toBeLessThan(10)
      })
    })
  })

  describe('integration tests', () => {
    it('should handle complex real-world scenarios', () => {
      const data = {
        user: {
          name: 'John Doe',
          role: 'developer',
          active: true,
          projects: [
            { name: 'Project A', status: 'active' },
            { name: 'Project B', status: 'completed' }
          ]
        },
        stats: { totalProjects: 2, activeProjects: 1 }
      }
      
      const complexTemplate = `
        Welcome {user.name}!
        Role: {user.role}
        Status: {user.active ? "Active" : "Inactive"}
        Current project: {user.projects.0.name} ({user.projects.0.status})
        Projects: {stats.activeProjects}/{stats.totalProjects} active
      `.trim()
      
      const result = templateAdvanced(complexTemplate, data)
      
      expect(result).toContain('Welcome John Doe!')
      expect(result).toContain('Role: developer')
      expect(result).toContain('Status: Active')
      expect(result).toContain('Current project: Project A (active)')
      expect(result).toContain('Projects: 1/2 active')
    })

    it('should maintain string immutability', () => {
      const original = 'Hello {name}!'
      const originalCopy = original
      const data = { name: 'World' }
      
      template(original, data)
      templateAdvanced(original, data)
      
      expect(original).toBe(originalCopy)
    })
  })
})