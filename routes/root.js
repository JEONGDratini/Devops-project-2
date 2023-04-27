'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true, host: process.env.MONGO_URL, username: process.env.MONGO_INITDB_ROOT_USERNAME }
  })
}
