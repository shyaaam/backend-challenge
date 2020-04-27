'use strict'

const Server = require('./server')

async function start () {
  try {
    const server = await Server.init()
    console.log('Server running at:', server.info.uri)
    server.start()
    return server
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

start()
