# Node.js Utilities

Node.js-specific utility functions including CLI tools, file system operations, JWT handling, and server utilities. These utilities are designed to work exclusively in Node.js environments.

## 📦 Installation

This package is part of the monorepo workspace. Install dependencies from the root:

```bash
pnpm install
```

## 🚀 Usage

```typescript
import { 
  readFileAsJson, 
  writeJson, 
  colorfulTerminalMessage,
  exec,
  serve,
  TokenGenerator
} from 'node'
```

## 📚 Available Utilities

### File System Operations

#### `readFileAsJson<T>(filePath: string): Promise<T>`
Reads a JSON file and parses it with type safety.

```typescript
import { readFileAsJson } from 'node'

interface Config {
  apiUrl: string
  timeout: number
}

const config = await readFileAsJson<Config>('./config.json')
console.log(config.apiUrl)
```

#### `writeJson(filePath: string, data: any): Promise<void>`
Writes an object to a JSON file with proper formatting.

```typescript
import { writeJson } from 'node'

const data = { name: 'John', age: 30 }
await writeJson('./output.json', data)
```

### CLI Utilities

#### `colorfulTerminalMessage(message: string, color?: string)`
Displays colorful messages in the terminal using chalk.

```typescript
import { colorfulTerminalMessage } from 'node'

colorfulTerminalMessage('Success!', 'green')
colorfulTerminalMessage('Warning!', 'yellow')
colorfulTerminalMessage('Error!', 'red')
```

#### `snakeToCameledSpace(kebabString: string): string`
CLI utility to convert kebab-case strings to title case.

```bash
# Command line usage
node snake-to-cameled-space.js "hello-world"
# Output: Hello World
```

```typescript
// Programmatic usage
import { snakeToCameledSpace } from 'node'

const result = snakeToCameledSpace('hello-world')
console.log(result) // "Hello World"
```

### Process Utilities

#### `exec(command: string, options?: ExecOptions)`
Enhanced command execution with better error handling.

```typescript
import { exec } from 'node'

try {
  const { stdout } = await exec('ls -la')
  console.log(stdout)
} catch (error) {
  console.error('Command failed:', error.message)
}
```

### Git Utilities

Collection of Git-related utilities for repository operations.

```typescript
import { getCurrentBranch, getCommitHash } from 'node'

const branch = await getCurrentBranch()
const commit = await getCommitHash()
console.log(`On branch ${branch} at commit ${commit}`)
```

### Server Utilities

#### `serve(options?: ServeOptions)`
Simple HTTP server for development and testing.

```typescript
import serve from 'node'

const server = serve({
  port: 3000,
  directory: './public'
})

console.log('Server running on http://localhost:3000')
```

### JWT Utilities

#### `TokenGenerator`
JWT token generation and validation utilities.

```typescript
import TokenGenerator from 'node'

const generator = new TokenGenerator('your-secret-key')

// Generate token
const token = generator.generate({ userId: 123, role: 'user' })

// Verify token
try {
  const payload = generator.verify(token)
  console.log('User ID:', payload.userId)
} catch (error) {
  console.error('Invalid token')
}
```

### Code Transformation

#### `eqeqeqCodemod(code: string): string`
Codemod that converts `==` and `!=` to `===` and `!==`.

```typescript
import { eqeqeqCodemod } from 'node'

const original = 'if (x == y) { return x != z }'
const transformed = eqeqeqCodemod(original)
// Result: 'if (x === y) { return x !== z }'
```

## 🧪 Testing

Run tests for the node package:

```bash
cd packages/node
pnpm test
```

Run tests with coverage:

```bash
pnpm test --coverage
```

## 🔧 Development

### Type Checking
```bash
pnpm typecheck
```

### Linting
```bash
pnpm lint
pnpm lint:fix
```

## 📋 Dependencies

- `chalk`: Terminal string styling
- `zod`: TypeScript-first schema validation

### Dev Dependencies

- `jsonwebtoken`: JWT implementation for testing
- `tsx`: TypeScript execution engine

## 🛠 CLI Tools

This package includes several CLI tools available in the `cli/` directory:

### `snake-to-cameled-space.js`
Convert kebab-case strings to title case:

```bash
#!/usr/bin/env node
node packages/node/snake-to-cameled-space.js "my-awesome-project"
# Output: My Awesome Project
```

## 🚨 Important Notes

- These utilities are **Node.js-only** - they will not work in browser environments
- Some utilities require specific Node.js versions (check package.json engines)
- File operations use modern async/await patterns
- JWT utilities are for development - use production-ready solutions for real applications
- Always validate file paths to prevent security vulnerabilities

## 🔒 Security Considerations

- File path validation prevents directory traversal attacks
- JWT secret keys should be stored securely
- Command execution utilities should sanitize inputs
- Never expose sensitive information in error messages

## 🎯 Node.js Version Support

- Requires Node.js 18+ (ES modules support)
- Uses modern Node.js APIs and patterns
- Built with TypeScript for type safety

## 🔗 Related Packages

- [`browser`](../browser/) - Browser-specific utilities
- [`universal`](../universal/) - Platform-agnostic utilities
- [`types`](../types/) - TypeScript type definitions