'use strict'
export {} // Typescript feature to fix global environment variable name collisions
const Hapi = require('@hapi/hapi')
const jwt = require('hapi-auth-jwt2')
const routes = require('./routes')
const { secret, port, host }  = require('./config.js')

module.exports.init = async () => {
    const server = Hapi.server({
        host,
        port,
        routes: {
            cors: {
                origin: ["*"] // Do not do in the real-world!
            }
        }
    })

    /*
    Just for demonstration of api security, we will enclose the api endpoint with jwt authentication, to simulate real-world environment where the api is exposed only to authenticated users
    */
    await server.register(jwt)
    server.auth.strategy('jwt', 'jwt',
        {
            key: secret,
            verifyOptions: {
                algorithms: [ 'HS256' ],
            },
            validate: async (decoded: string) => ({ isValid: decoded === secret })
        })
    server.auth.default('jwt')

    server.route(routes)
    return server
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})
