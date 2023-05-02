'use strict'
const fastify = require('fastify')();
const MongoClient = require('mongodb').MongoClient;

const { MONGO_HOSTNAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env

// MongoDB 접속 정보
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}`;
const dbName = 'baedal';
const collectionName = 'orders';

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, reply) {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    const result = await collection.find().toArray();
    client.close();
    
    reply.code(200).send(result);
  })
}