/**
 * Simple HTTP server that responds with "Hello World" to all requests.
 * Basic demonstration of Node.js HTTP server functionality.
 * 
 * Server configuration:
 * - Host: 127.0.0.1 (localhost)
 * - Port: 3000
 * - Response: Plain text "Hello World"
 * 
 * @example
 * ```bash
 * # Run the server
 * node simpleServer.js
 * 
 * # Test in browser or with curl
 * curl http://localhost:3000
 * # Response: Hello World
 * ```
 */
import http from 'http'

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
