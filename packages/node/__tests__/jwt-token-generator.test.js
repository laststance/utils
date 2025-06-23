import { describe, it, expect, beforeEach } from 'vitest'
import TokenGenerator from '../jwt/token-generator.js'
import jwt from 'jsonwebtoken'

describe('TokenGenerator', () => {
  let generator
  const secret = 'test-secret-key'
  const payload = { userId: 123, role: 'user', email: 'test@example.com' }

  beforeEach(() => {
    generator = new TokenGenerator(secret, secret, {
      expiresIn: '1h',
      algorithm: 'HS256'
    })
  })

  describe('constructor', () => {
    it('should create instance with provided keys and options', () => {
      expect(generator.secretOrPrivateKey).toBe(secret)
      expect(generator.secretOrPublicKey).toBe(secret)
      expect(generator.options).toEqual({
        expiresIn: '1h',
        algorithm: 'HS256'
      })
    })

    it('should handle different private and public keys', () => {
      const privateKey = 'private-key'
      const publicKey = 'public-key'
      const gen = new TokenGenerator(privateKey, publicKey, {})
      
      expect(gen.secretOrPrivateKey).toBe(privateKey)
      expect(gen.secretOrPublicKey).toBe(publicKey)
    })

    it('should handle empty options', () => {
      const gen = new TokenGenerator(secret, secret, {})
      expect(gen.options).toEqual({})
    })
  })

  describe('sign()', () => {
    it('should sign a token with provided payload', () => {
      const token = generator.sign(payload)
      
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
      
      // Verify the token contains our payload
      const decoded = jwt.verify(token, secret)
      expect(decoded.userId).toBe(payload.userId)
      expect(decoded.role).toBe(payload.role)
      expect(decoded.email).toBe(payload.email)
    })

    it('should apply default options from constructor', () => {
      const token = generator.sign(payload)
      const decoded = jwt.verify(token, secret)
      
      expect(decoded.exp).toBeDefined() // expiresIn should be applied
      expect(decoded.iat).toBeDefined() // issued at should be set
    })

    it('should override default options with signOptions', () => {
      const token = generator.sign(payload, { expiresIn: '2h', jwtid: 'custom-id' })
      const decoded = jwt.verify(token, secret)
      
      expect(decoded.jti).toBe('custom-id')
      // Check that expiration is longer (approximately 2 hours vs 1 hour)
      const expirationTime = decoded.exp - decoded.iat
      expect(expirationTime).toBeGreaterThanOrEqual(7200) // 2 hours in seconds
    })

    it('should handle empty payload', () => {
      const token = generator.sign({})
      const decoded = jwt.verify(token, secret)
      
      expect(decoded).toMatchObject({})
      expect(decoded.iat).toBeDefined()
    })

    it('should handle complex nested payload', () => {
      const complexPayload = {
        user: {
          id: 123,
          profile: { name: 'John', preferences: { theme: 'dark' } }
        },
        permissions: ['read', 'write'],
        metadata: { version: '1.0', timestamp: Date.now() }
      }
      
      const token = generator.sign(complexPayload)
      const decoded = jwt.verify(token, secret)
      
      expect(decoded.user.id).toBe(123)
      expect(decoded.user.profile.name).toBe('John')
      expect(decoded.user.profile.preferences.theme).toBe('dark')
      expect(decoded.permissions).toEqual(['read', 'write'])
      expect(decoded.metadata.version).toBe('1.0')
    })

    it('should handle different algorithms', () => {
      const genHS256 = new TokenGenerator(secret, secret, { algorithm: 'HS256' })
      const genHS512 = new TokenGenerator(secret, secret, { algorithm: 'HS512' })
      
      const tokenHS256 = genHS256.sign(payload)
      const tokenHS512 = genHS512.sign(payload)
      
      expect(jwt.verify(tokenHS256, secret, { algorithms: ['HS256'] })).toBeDefined()
      expect(jwt.verify(tokenHS512, secret, { algorithms: ['HS512'] })).toBeDefined()
      
      // Different algorithms should produce different tokens
      expect(tokenHS256).not.toBe(tokenHS512)
    })
  })

  describe('refresh()', () => {
    let originalToken

    beforeEach(() => {
      originalToken = generator.sign(payload, { jwtid: 'original-id' })
      // Wait a moment to ensure different iat timestamps
      return new Promise(resolve => setTimeout(resolve, 1000))
    })

    it('should refresh token with same payload but new timestamps', () => {
      const refreshedToken = generator.refresh(originalToken, {
        verify: { algorithms: ['HS256'] },
        jwtid: 'refreshed-id'
      })
      
      expect(typeof refreshedToken).toBe('string')
      expect(refreshedToken).not.toBe(originalToken)
      
      const originalDecoded = jwt.verify(originalToken, secret)
      const refreshedDecoded = jwt.verify(refreshedToken, secret)
      
      // Payload should be preserved
      expect(refreshedDecoded.userId).toBe(originalDecoded.userId)
      expect(refreshedDecoded.role).toBe(originalDecoded.role)
      expect(refreshedDecoded.email).toBe(originalDecoded.email)
      
      // Timestamps should be different
      expect(refreshedDecoded.iat).toBeGreaterThan(originalDecoded.iat)
      expect(refreshedDecoded.jti).toBe('refreshed-id')
      expect(refreshedDecoded.jti).not.toBe(originalDecoded.jti)
    })

    it('should remove standard JWT claims from refreshed token', () => {
      const refreshedToken = generator.refresh(originalToken, {
        verify: { algorithms: ['HS256'] }
      })
      
      const refreshedDecoded = jwt.verify(refreshedToken, secret)
      
      // Should have new iat, exp (from refresh)
      expect(refreshedDecoded.iat).toBeDefined()
      expect(refreshedDecoded.exp).toBeDefined()
      
      // Should preserve custom payload
      expect(refreshedDecoded.userId).toBe(payload.userId)
      expect(refreshedDecoded.role).toBe(payload.role)
    })

    it('should handle refresh without jwtid option', () => {
      const refreshedToken = generator.refresh(originalToken, {
        verify: { algorithms: ['HS256'] }
      })
      
      const decoded = jwt.verify(refreshedToken, secret)
      expect(decoded.jti).toBeUndefined()
    })

    it('should throw error for invalid token during refresh', () => {
      expect(() => {
        generator.refresh('invalid.token.here', {
          verify: { algorithms: ['HS256'] }
        })
      }).toThrow()
    })

    it('should throw error for expired token during refresh', async () => {
      const expiredToken = generator.sign(payload, { expiresIn: '10ms' })
      
      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(() => {
        generator.refresh(expiredToken, {
          verify: { algorithms: ['HS256'] }
        })
      }).toThrow('jwt expired')
    })

    it('should throw error for token signed with different algorithm', () => {
      const differentAlgoGenerator = new TokenGenerator(secret, secret, { algorithm: 'HS512' })
      const hs512Token = differentAlgoGenerator.sign(payload)
      
      expect(() => {
        generator.refresh(hs512Token, {
          verify: { algorithms: ['HS256'] } // Only allow HS256
        })
      }).toThrow()
    })

    it('should handle refresh with different verify options', () => {
      const refreshedToken = generator.refresh(originalToken, {
        verify: { 
          algorithms: ['HS256'],
          clockTolerance: 60,
          ignoreExpiration: false
        },
        jwtid: 'new-refresh-id'
      })
      
      const decoded = jwt.verify(refreshedToken, secret)
      expect(decoded.jti).toBe('new-refresh-id')
      expect(decoded.userId).toBe(payload.userId)
    })
  })

  describe('integration scenarios', () => {
    it('should handle multiple refresh cycles', () => {
      let currentToken = generator.sign(payload, { jwtid: 'gen-1' })
      
      for (let i = 2; i <= 5; i++) {
        currentToken = generator.refresh(currentToken, {
          verify: { algorithms: ['HS256'] },
          jwtid: `gen-${i}`
        })
        
        const decoded = jwt.verify(currentToken, secret)
        expect(decoded.jti).toBe(`gen-${i}`)
        expect(decoded.userId).toBe(payload.userId)
        expect(decoded.role).toBe(payload.role)
      }
    })

    it('should work with asymmetric keys (RS256)', () => {
      // Generate RSA key pair for testing
      const crypto = require('crypto')
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      })
      
      const rsaGenerator = new TokenGenerator(privateKey, publicKey, {
        algorithm: 'RS256',
        expiresIn: '1h'
      })
      
      const token = rsaGenerator.sign(payload)
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
      
      expect(decoded.userId).toBe(payload.userId)
      expect(decoded.role).toBe(payload.role)
      
      // Test refresh with RSA
      const refreshedToken = rsaGenerator.refresh(token, {
        verify: { algorithms: ['RS256'] },
        jwtid: 'rsa-refresh'
      })
      
      const refreshedDecoded = jwt.verify(refreshedToken, publicKey, { algorithms: ['RS256'] })
      expect(refreshedDecoded.userId).toBe(payload.userId)
      expect(refreshedDecoded.jti).toBe('rsa-refresh')
    })

    it('should preserve all custom claims during refresh', () => {
      const complexPayload = {
        userId: 123,
        roles: ['admin', 'user'],
        permissions: { read: true, write: true, delete: false },
        metadata: { version: '2.1', features: ['feature1', 'feature2'] },
        customClaim: 'custom-value'
      }
      
      const token = generator.sign(complexPayload)
      const refreshedToken = generator.refresh(token, {
        verify: { algorithms: ['HS256'] },
        jwtid: 'complex-refresh'
      })
      
      const decoded = jwt.verify(refreshedToken, secret)
      
      expect(decoded.userId).toBe(123)
      expect(decoded.roles).toEqual(['admin', 'user'])
      expect(decoded.permissions).toEqual({ read: true, write: true, delete: false })
      expect(decoded.metadata.version).toBe('2.1')
      expect(decoded.metadata.features).toEqual(['feature1', 'feature2'])
      expect(decoded.customClaim).toBe('custom-value')
      expect(decoded.jti).toBe('complex-refresh')
    })
  })

  describe('error handling', () => {
    it('should throw error for null/undefined payload', () => {
      expect(() => generator.sign(null)).toThrow('Expected "payload" to be a plain object')
      expect(() => generator.sign(undefined)).toThrow('payload is required')
    })

    it('should handle various refresh options', () => {
      const token = generator.sign(payload)
      
      // Empty verify options should work
      expect(() => {
        generator.refresh(token, { verify: {} })
      }).not.toThrow() 
      
      // null verify options are handled by jwt.verify
      const refreshedToken = generator.refresh(token, { verify: null })
      expect(typeof refreshedToken).toBe('string')
    })

    it('should handle token verification with wrong secret', () => {
      const token = generator.sign(payload)
      const wrongSecretGenerator = new TokenGenerator('wrong-secret', 'wrong-secret', {})
      
      expect(() => {
        wrongSecretGenerator.refresh(token, {
          verify: { algorithms: ['HS256'] }
        })
      }).toThrow('invalid signature')
    })
  })
})