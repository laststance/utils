// from https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
/**
 * Just few lines to test the behavior.
 */

import jwt from 'jsonwebtoken'

import TokenGenerator from './token-generator.js'

const tokenGenerator = new TokenGenerator('a', 'a', {
  algorithm: 'HS256',
  expiresIn: '2m',
  keyid: '1',
  notBefore: '2s',
  noTimestamp: false,
})
const token = tokenGenerator.sign(
  { myclaim: 'something' },
  { audience: 'myaud', issuer: 'myissuer', jwtid: '1', subject: 'user' },
)
setTimeout(function () {
  const token2 = tokenGenerator.refresh(token, {
    jwtid: '2',
    verify: { audience: 'myaud', issuer: 'myissuer' },
  })

  console.log(jwt.decode(token, { complete: true }))

  console.log(jwt.decode(token2, { complete: true }))
}, 3000)
