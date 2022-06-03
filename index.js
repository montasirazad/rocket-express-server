const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k8hkv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("rocket-express-orders");
        const clientsOrderDb = database.collection("client-order");
        const reviewDb = database.collection("user-review");
        // // create a document to insert
        console.log('db connected');

        app.post('/', async (req, res) => {
            const clientOrder = req.body;
            const result = await clientsOrderDb.insertOne(clientOrder);
            res.json(result)

        })

        // GET ALL DATA API
        app.get('/all-order', async (req, res) => {
            const cursor = clientsOrderDb.find({})
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET Single item DATA API

        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await clientsOrderDb.findOne(query)
            res.json(result);

            //console.log(query);
        })


        // Query API

        app.get('/single-order', async (req, res) => {
            const email = req.query.email;
            const query = { customerEmail: email };
            const search = clientsOrderDb.find(query);
            const result = await search.toArray()
            res.json(result)
            //console.log(search);

        })


        // update a single item
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body;
            const filter = { _id: ObjectId(id) };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: { deliveryStatus: updatedInfo.deliveryStatus }
            };
            const result = await clientsOrderDb.updateOne(filter, updateDoc, options);
            res.json(result)
            console.log(result);
        })
        // POST A REVIEW
        app.post('/user/review', async (req, res) => {
            const review = req.body;
            const result = await reviewDb.insertOne(review);
            res.send(result)
            console.log(result);
        })


        // GET all Review

        app.get('/user/review', async (req, res) => {
            const allReview = reviewDb.find({});
            const result = await allReview.toArray();
            res.send(result)
            console.log(result);
        })
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Setup done')
})



app.listen(port, () => {
    console.log('listening to port', port);
})