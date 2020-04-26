'use strict'

const Hapi = require('@hapi/hapi')
const jwt = require('hapi-auth-jwt2')
const fetch = require('node-fetch')

const validate = async (decoded: any) => {
  console.log('decoded', decoded)
  if (!decoded.id) {
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
        key: 'sHmpTzqXMp8PpYXKwc9ShQ1UhyDe',
        verifyOptions: {
          algorithms: [ 'HS256' ],
        },
        validate  // validate function defined above
      })
  server.auth.default('jwt')
  server.route({
    method: 'GET',
    config: { auth: false },
    path: '/',
    handler: async (request: any) => {
      const data = await fetch('https://static.gapless.app/backend-coding-challenge/vins.json').then((res: any) => res.json())
      return {
        statusCode: 200,
        data: data.filter((d:any) => d.vin === request.query.vin)[0] || {}
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
