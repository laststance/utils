# Project Guidelines for Junie

## Project Overview
This repository, `react-node-utils`, is a collection of useful code fragments and utilities, particularly from open-source libraries. It's organized as a monorepo using pnpm workspaces with the following package structure:

- **universal**: General JavaScript/TypeScript code without specific platform API dependencies
- **browser**: TypeScript/JavaScript code that depends on Browser API
- **node**: JavaScript/TypeScript code that depends on Node.js API
- **types**: Custom utility types
- **next-react**: Next.js React application
- **docs**: Documentation files

## Development Guidelines

### Testing
- Run tests to verify your changes: `pnpm test`
- Tests are written using Vitest

### Code Quality
- Ensure code passes linting: `pnpm lint`
- Fix linting issues automatically: `pnpm lint:fix`
- Verify TypeScript type checking: `pnpm typecheck`
- Format code with Prettier: `pnpm prettier`

### Building
- Build the project before submitting: `pnpm build`
- This will build all packages in the monorepo

### Code Style
- Follow the existing code style in each package
- Use TypeScript for new code when possible
- Ensure proper JSDoc comments for exported functions
- Follow ESLint rules configured in the project

### Workflow
1. Understand the issue or feature request
2. Make minimal necessary changes to address the issue
3. Run tests to verify your changes
4. Run linting and type checking
5. Build the project to ensure it compiles correctly
6. Submit your solution
