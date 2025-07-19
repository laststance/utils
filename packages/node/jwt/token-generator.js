// from https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
/**
 * JWT Token Generator with refresh capability
 *
 * Example implementation for refreshing JWT tokens using the jsonwebtoken library.
 * This was requested as a feature for the main library but was kept separate
 * to avoid additional maintenance overhead.
 *
 * Features:
 * - Sign new JWT tokens
 * - Refresh existing tokens while preserving payload
 * - Configurable signing options
 * - Support for both symmetric and asymmetric keys
 *
 * @example
 * ```javascript
 * const generator = new TokenGenerator(
 *   'secret-key',      // private key for signing
 *   'secret-key',      // public key for verification (same for symmetric)
 *   { expiresIn: '1h', algorithm: 'HS256' }
 * )
 *
 * // Sign a new token
 * const token = generator.sign({ userId: 123, role: 'user' })
 *
 * // Refresh the token
 * const refreshed = generator.refresh(token, {
 *   verify: { algorithms: ['HS256'] },
 *   jwtid: 'new-jwt-id'
 * })
 * ```
 */

import jwt from 'jsonwebtoken'

/**
 * TokenGenerator constructor
 *
 * @param {string|Buffer} secretOrPrivateKey - Secret or private key for signing tokens
 * @param {string|Buffer} secretOrPublicKey - Secret or public key for verifying tokens
 * @param {object} options - Default signing options (algorithm, keyid, expiresIn, etc.)
 */
function TokenGenerator(secretOrPrivateKey, secretOrPublicKey, options) {
  this.secretOrPrivateKey = secretOrPrivateKey
  this.secretOrPublicKey = secretOrPublicKey
  this.options = options //algorithm + keyid + noTimestamp + expiresIn + notBefore
}

/**
 * Signs a new JWT token with the provided payload.
 *
 * @param {object} payload - Data to include in the token
 * @param {object} signOptions - Additional signing options (overrides defaults)
 * @returns {string} Signed JWT token
 */
TokenGenerator.prototype.sign = function (payload, signOptions) {
  const jwtSignOptions = Object.assign({}, this.options, signOptions)
  return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
}

/**
 * Refreshes an existing JWT token, creating a new token with the same payload.
 * Removes standard JWT claims (iat, exp, nbf, jti) and creates a fresh token.
 *
 * @param {string} token - Existing JWT token to refresh
 * @param {object} refreshOptions - Refresh configuration
 * @param {object} refreshOptions.verify - Options for token verification
 * @param {string} refreshOptions.jwtid - New JWT ID for the refreshed token
 * @returns {string} New JWT token with refreshed timestamps
 */
TokenGenerator.prototype.refresh = function (token, refreshOptions) {
  const payload = jwt.verify(
    token,
    this.secretOrPublicKey,
    refreshOptions.verify,
  )
  delete payload.iat
  delete payload.exp
  delete payload.nbf
  delete payload.jti //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
  const jwtSignOptions = Object.assign({}, this.options)
  if (refreshOptions.jwtid !== undefined) {
    jwtSignOptions.jwtid = refreshOptions.jwtid
  }
  // The first signing converted all needed options into claims, they are already in the payload
  return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
}

export default TokenGenerator
