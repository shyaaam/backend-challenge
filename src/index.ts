'use strict'

const Hapi = require('@hapi/hapi')
const jwt = require('hapi-auth-jwt2')
const fetch = require('node-fetch')
const Joi = require('@hapi/joi')
const JWT = require('jsonwebtoken')

const secret = 'sHmpTzqXMp8PpYXKwc9ShQ1UhyDe';

const validate = async (decoded: string) => ({ isValid: decoded === secret })
let server
const init = async () => {
  server = Hapi.server({
    port: 3000,
    host: 'localhost'
  })
  await server.register(jwt)
  server.auth.strategy('jwt', 'jwt',
      {
        key: secret,
        verifyOptions: {
          algorithms: [ 'HS256' ],
        },
        validate
      })
  server.auth.default('jwt')
  // Just for demonstration of api security, we will enclose the 'vin' api route with jwt authentication, to simulate real-world environment where the api is exposed only to authenticated users
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: '/generate-token',
    handler: async () => {
      return {
        statusCode: 200,
        data: {
          token: JWT.sign(secret, secret) // Just for demonstration! Usually the first param should be a random string
        }
      }
    }
  })
  server.route({
    method: 'GET',
    config: {
      validate: {
        params: Joi.object({
          vin: Joi.string().min(17).max(17) // just a basic string length validation for vin, using Joi
        })
      }
    },
    path: '/vin/{vin}',
    handler: async (request: any, h: any) => {
      try {
        const data = await fetch('https://static.gapless.app/backend-coding-challenge/vins.json').then((res: any) => res.json())
        return {
          statusCode: 200,
          data: data.filter((d:any) => d.vin === request.params.vin)[0] || {}
        }
      }
      catch (e) {
        throw h.internal('Server Error', e)
      }
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

module.exports = server // for testing
