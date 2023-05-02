'use strict'
const fastify = require('fastify')();
const { MongoClient, ObjectId } = require('mongodb');

const { MONGO_HOSTNAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env

// MongoDB 접속 정보
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}`;
const dbName = 'baedal';
const collectionName = 'order';

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, reply) {
    try{
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.find({}).toArray();
        client.close();

        reply.code(200).send(result);
    }catch{
        reply.code(500).send("something wrong");
    }
  })

//   fastify.get('/:orderid', async function (req, reply) {

//     const client = await MongoClient.connect(url, { useUnifiedTopology: true });
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     const query = {_id: new ObjectId(req.params.orderid)};


//     const result = await collection.findOne(query);

//     client.close();
    
//     reply.code(200).send(result);
//   })

//   fastify.post('/', async function (req, reply) {
//     const { restaurantId, menu } = req.body;
//     console.log(restaurantId);
//     const client = await MongoClient.connect(url, { useUnifiedTopology: true });
//     const db = client.db(dbName);

//     //배달부 정보 받아오기
//     const courier_collection = db.collection('courier');

//     const courier_query={ available: false }
//     const courier = await courier_collection.findOne(courier_query)
//     console.log(courier);
//     //식당 정보 받아오기
//     const restaurant_collection = db.collection('restaurants');
//     const restaurant_query = {_id: `${restaurantId}`};

//     const restaurant = await restaurant_collection.findOne(restaurant_query);
//     console.log(restaurant);

//     //주문정보 insert하기
//     const order_collection = db.collection(collectionName);
//     const order_query ={
//         deliveryInfo: {
//             status: 'preparing',
//             assignedCourier: '박배송',
//             estimatedDeleveryTime: 40
//         },
//         consumer_id: new ObjectId('64504e3a6890c3c570872978'),
//         restaurant: restaurant,
//         orderedMenu: menu
        
        
//     }

//     const result = await order_collection.insertOne(order_query)

//     client.close();
    
//     reply.code(201).send(result);
//   })

  fastify.post('/', async function (req, reply) {
    try {
      const { restaurantId, menu } = req.body
      console.log(req.body)

      const restaurants = await this.mongo.db.collection('restaurants')
      const findRestaurant = await restaurants.findOne({_id: new ObjectId(restaurantId)});
      console.log('findRestaurant : ', findRestaurant)

      const response = {
        restaurant: {
          _id: restaurantId,
          name: findRestaurant.name,
          menu: findRestaurant.menu,
          address: findRestaurant.address,
          rating: findRestaurant.rating
        },
        orderedMenu: menu,
        deliveryInfo: {
          status: 'PREPARING',
          assignedCourier: 'Kim Baedal',
          estimatedDeleveryTime: 40
        }
      }
      console.log('response : ', response)
      const order = await this.mongo.db.collection('order')
      const one = await order.insertOne(response);
      console.log(`one :`, one);

      const findOrder = await order.findOne({_id: new ObjectId(one.insertedId)});
      
      return findOrder;
    } catch (err) {
      return `FAIDED HI ${err}`
    }
  })

}