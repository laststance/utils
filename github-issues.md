# GitHub Issues to Create for Utils Monorepo

## Issue 1: Security Vulnerability - Update on-headers dependency
**Priority: High**
**Labels: security, dependencies**

### Description
The project has a low-severity security vulnerability in the `on-headers` package (version < 1.1.0) used by the `serve` dependency in the next-react package.

### Details
- **Package**: on-headers
- **Path**: packages/next-react > serve > compression > on-headers
- **Current version**: < 1.1.0
- **Fixed version**: >= 1.1.0
- **Advisory**: https://github.com/advisories/GHSA-76c9-3jph-rj3q

### Action Required
Update the `serve` package to a version that uses on-headers >= 1.1.0

---

## Issue 2: Add Missing Documentation Files
**Priority: High**
**Labels: documentation, good first issue**

### Description
The repository is missing several important documentation files that are standard for open-source projects.

### Missing Files
- [ ] CONTRIBUTING.md - Guidelines for contributors
- [ ] SECURITY.md - Security policy for reporting vulnerabilities
- [ ] CHANGELOG.md - Version history and changes
- [ ] CODE_OF_CONDUCT.md - Community guidelines

### Action Required
Create these documentation files with appropriate content for the project.

---

## Issue 3: Add README files for all packages
**Priority: Medium**
**Labels: documentation, good first issue**

### Description
Most packages in the monorepo lack README files explaining their purpose and usage.

### Missing READMEs
- [ ] /packages/browser/README.md
- [ ] /packages/universal/README.md
- [ ] /packages/node/README.md
- [ ] /packages/types/README.md

Only `/packages/next-react/` has proper documentation.

### Action Required
Create README files for each package explaining:
- Package purpose
- Installation instructions
- Usage examples
- API documentation

---

## Issue 4: Implement Scoped Package Names
**Priority: Medium**
**Labels: breaking change, enhancement**

### Description
Package names in `package.json` files don't follow a consistent naming convention. Generic names like `browser`, `node`, `types` should be scoped.

### Current State
- browser
- node
- types
- universal
- next-react

### Proposed Change
- @laststance/browser
- @laststance/node
- @laststance/types
- @laststance/universal
- @laststance/next-react

### Action Required
Update all package.json files with scoped names and update all internal references.

---

## Issue 5: Add Build Scripts to Individual Packages
**Priority: High**
**Labels: build, enhancement**

### Description
Individual packages don't have build scripts defined, which Turbo expects for proper caching and dependency management.

### Affected Packages
- browser
- node
- types
- universal

### Action Required
Add appropriate build scripts to each package's package.json that:
- Compile TypeScript to JavaScript
- Generate type definitions
- Output to a dist/ or lib/ directory

---

## Issue 6: Remove Coverage Folders from Repository
**Priority: Low**
**Labels: cleanup, good first issue**

### Description
Coverage folders are present in the repository but should be gitignored. While `.gitignore` has coverage entries, coverage folders still exist in packages.

### Action Required
- Remove all coverage folders from the repository
- Ensure .gitignore properly excludes them

---

## Issue 7: Code Duplication - Consolidate snake-to-camel Implementations
**Priority: Medium**
**Labels: refactoring, code quality**

### Description
There are two different implementations of snake-to-camel case conversion:
- `/packages/node/snake-to-cameled-space.js` (CLI version)
- `/packages/universal/string/snakeToCameledSpace.ts` (function version)

### Action Required
- Move the core logic to the universal package
- Have the node CLI import and use the universal implementation
- Ensure consistent behavior between both versions

---

## Issue 8: Refactor Queue.js to Use Event-Based Waiting
**Priority: Medium**
**Labels: performance, refactoring**

### Description
The Queue class in `/packages/browser/Queue.js` uses inefficient polling with setTimeout every 50ms.

### Current Issues
- Polling every 50ms wastes CPU cycles
- Hardcoded 50ms interval
- Basic error handling

### Proposed Solution
- Implement proper Promise-based event handling
- Use event emitters or callbacks instead of polling
- Make polling interval configurable if polling is necessary
- Improve error propagation

---

## Issue 9: Replace `any` Types in Test Files
**Priority: Low**
**Labels: typescript, code quality, good first issue**

### Description
Several test files use `any` types which reduces type safety.

### Affected Files
- `/packages/browser/sizeof/sizeof.test.ts` (line 63)
- `/packages/browser/getImageRect.test.ts` (multiple lines)
- `/packages/browser/openInNewTab.test.ts` (line 6)

### Action Required
Replace `any` types with proper type definitions or testing utilities.

---

## Issue 10: Move Universal Utilities to Appropriate Package
**Priority: Medium**
**Labels: refactoring, architecture**

### Description
Several utilities in the browser package are not browser-specific and should be moved to the universal package.

### Utilities to Move
- `sleep.ts` - Useful in Node.js too
- `debounce.ts` - Not browser-specific
- `probability.js` - Random number generation is universal

### Action Required
- Move these utilities to the universal package
- Update imports in all dependent code
- Add re-exports from browser package for backward compatibility

---

## Issue 11: Add Package Export Configurations
**Priority: High**
**Labels: enhancement, developer experience**

### Description
None of the packages have proper export configurations in `package.json` or index files, making it difficult to import utilities.

### Action Required
For each package:
- Create an index.ts/js file that exports all public utilities
- Add "exports" field to package.json with proper export mappings
- Consider adding "main", "module", and "types" fields

---

## Issue 12: Create Shared TypeScript Configuration
**Priority: Medium**
**Labels: typescript, developer experience**

### Description
Each package has its own `tsconfig.json` but there's no shared base configuration, leading to potential inconsistencies.

### Action Required
- Create a root `tsconfig.base.json` with common settings
- Update each package's tsconfig.json to extend from the base
- Ensure consistent TypeScript settings across all packages

---

## Issue 13: Add Missing CI/CD Workflows
**Priority: Medium**
**Labels: ci/cd, enhancement**

### Description
The GitHub Actions pipeline is limited to basic checks. Missing important workflows.

### Missing Workflows
- [ ] Coverage reporting
- [ ] Release/publish workflow
- [ ] Security scanning beyond Dependabot
- [ ] Automated dependency updates

### Action Required
Create GitHub Actions workflows for comprehensive CI/CD pipeline.

---

## Issue 14: Optimize Turbo Configuration
**Priority: Low**
**Labels: performance, build**

### Description
The Turbo configuration could be optimized for better performance.

### Improvements
- Configure remote caching
- Optimize task dependencies
- Add better cache configuration
- Ensure validate task runs in parallel

---

## Issue 15: Add License Field to Package.json Files
**Priority: Low**
**Labels: legal, good first issue**

### Description
Individual packages don't specify licenses in their package.json files, though the root has an MIT license.

### Action Required
Add `"license": "MIT"` to all package.json files to ensure proper licensing.

---

## Issue 16: Remove Test Code from Production Files
**Priority: High**
**Labels: bug, code quality**

### Description
The file `/packages/browser/probability.js` includes test code (a for loop) that runs on import.

### Action Required
- Remove the test loop from probability.js
- Move any test code to proper test files
- Ensure no other production files contain test code

---

## Issue 17: Standardize Module Formats
**Priority: Medium**
**Labels: refactoring, consistency**

### Description
The codebase mixes CommonJS (`module.exports`) and ES modules, causing inconsistency.

### Action Required
- Standardize on ES modules across all packages
- Update any remaining CommonJS exports/imports
- Ensure all packages have `"type": "module"` in package.json

---

## Issue 18: Improve Error Handling Consistency
**Priority: Medium**
**Labels: error handling, code quality**

### Description
Error handling patterns are inconsistent across the codebase.

### Examples
- `getBase64Image.js`: Only validates null/undefined URLs
- `readFileAsJson.ts`: Good error handling with cause chain
- `Queue.js`: Stores errors but doesn't always throw them

### Action Required
- Define a consistent error handling pattern
- Document the pattern in contributing guidelines
- Update all utilities to follow the pattern

---

## Issue 19: Extract Magic Numbers to Constants
**Priority: Low**
**Labels: code quality, good first issue**

### Description
Several hardcoded values should be extracted to named constants.

### Examples
- Port 3000 and hostname '127.0.0.1' in simpleServer.js
- Polling interval 50ms in Queue.js
- Range 0-100 in probability.js

### Action Required
Extract these values to well-named constants at the top of each file.

---

## Issue 20: Add JSDoc/TSDoc to Undocumented Functions
**Priority: Low**
**Labels: documentation, good first issue**

### Description
While many files have good documentation, some utilities lack proper JSDoc/TSDoc comments.

### Action Required
- Audit all exported functions for documentation
- Add JSDoc/TSDoc comments with parameter descriptions and return types
- Include usage examples where appropriate