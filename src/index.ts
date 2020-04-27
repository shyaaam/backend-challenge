'use strict'

const Hapi = require('@hapi/hapi')
const jwt = require('hapi-auth-jwt2')
const fetch = require('node-fetch')
const Joi = require('@hapi/joi')
const JWT = require('jsonwebtoken')

const secret = 'sHmpTzqXMp8PpYXKwc9ShQ1UhyDe';

const validate = async (decoded: any) => {
  if (decoded !== secret) {
    return { isValid: false }
  } else {
    return { isValid: true }
  }
}

const init = async () => {
  const server = Hapi.server({
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
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: '/generate',
    handler: async (request: any) => {
      return {
        statusCode: 200,
        data: JWT.sign(secret, secret)
      }
    }
  })
  server.route({
    method: 'GET',
    config: {
      validate: {
        params: Joi.object({
          vin: Joi.string().min(17).max(17) // casual string length validation for vin, using Joi
        }),
        options: {
          allowUnknown: true
        }
      }
    },
    path: '/vin/{vin}',
    handler: async (request: any, h: any) => {
      console.log('request', request.params)
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
