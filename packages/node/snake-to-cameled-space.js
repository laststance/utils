#!/usr/bin/env node

/**
 * CLI utility to convert kebab-case strings to title case with spaces.
 * 
 * Takes a kebab-case string as a command line argument and converts it to
 * title case with spaces between words.
 * 
 * @example
 * ```bash
 * # Basic usage
 * node snake-to-cameled-space.js "hello-world"
 * # Output: Hello World
 * 
 * # Complex example
 * node snake-to-cameled-space.js "code-piece-of-complete-guide-to-react-client-rendering-behavior"
 * # Output: Code Piece Of Complete Guide To React Client Rendering Behavior
 * 
 * # Single word
 * node snake-to-cameled-space.js "test"
 * # Output: Test
 * ```
 */

/*
Development process log:

> 'code-piece-of-complete-guide-to-react-client-rendering-behavior'.split('-')
[
  'code',     'piece',
  'of',       'complete',
  'guide',    'to',
  'react-client',    'rendering',
  'behavior'
]
> 'code-piece-of-complete-guide-to-react-client-rendering-behavior'.split('-').map(s => s.charAt(0).toUpperCase())
[
  'C', 'P', 'O',
  'C', 'G', 'T',
  'R', 'R', 'B'
]
> 'code-piece-of-complete-guide-to-react-client-rendering-behavior'.split('-').map(s => (s.charAt(0).toUpperCase() + s.slice(1)))
[
  'Code',     'Piece',
  'Of',       'Complete',
  'Guide',    'To',
  'React',    'Rendering',
  'Behavior'
]
> 'code-piece-of-complete-guide-to-react-client-rendering-behavior'.split('-').map(s => (s.charAt(0).toUpperCase() + s.slice(1))).join(' ')
'Code Piece Of Complete Guide To React Client Rendering Behavior'
*/

const str = process.argv[2]

console.log(
  str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' '),
)
