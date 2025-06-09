/**
 * 'code-piece-of-complete-guide-to-react-client-rendering-behavior' -> 'Code Piece Of Complete Guide To React Rendering Behavior'
 */

const snakeToCameledSpace = (str: string): string =>
  str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')

export default snakeToCameledSpace
