const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

//volunteerDb
//dbPass = jkfXpmJ7i1rULLBa


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.vtqt6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
  
//   // perform actions on the collection object
// //   client.close();
// });


async function run() {
    try{
        await client.connect();
        const serviceCollection = client.db("volunteer").collection("services");
        const eventCollection = client.db("volunteerEvent").collection("event");
        // console.log('Hello')

        app.get('/addevent' , async(req,res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })
        app.post('/addevent', async (req,res) =>{
            const addEvent = req.body;
            const result = await serviceCollection.insertOne(addEvent);
            res.send(result);
        })
          // get one id details
          app.get('/event/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
          })


          //get event booked
          app.post('/eventbooked', async(req,res) => {
            const booked = req.body;
            const result = await eventCollection.insertOne(booked);
            res.send(result);
          })
          app.get('/eventbooked', async(req,res) => {
            const email = req.query.email;
            // console.log(email);
            const query = {email: email};
            // const query = {}
            const cursor = eventCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
          })

          // Delete from databease
          app.delete('/eventbooked/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await eventCollection.deleteOne(query);
            res.send(result);
          })
    }
    finally{

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})