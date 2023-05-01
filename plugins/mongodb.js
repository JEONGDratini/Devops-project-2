'use strict'

const fp = require('fastify-plugin')

const { MONGO_HOSTNAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env

console.log(MONGO_HOSTNAME, MONGO_USERNAME, MONGO_PASSWORD)

module.exports = fp(async function (fastify, opts) {
  const url = `mongodb://localhost:27017`
  console.log(url)

  fastify.register(require('@fastify/mongodb'), {
    forceClose: true,
    url: url
  })
})