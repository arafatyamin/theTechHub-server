const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0lhbrs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() => {
    try{
        const servicesCollection = client.db('TheBookShop').collection('services');
        
        const usersCollection = client.db('TheBookShop').collection('users');
        const reviewsCollection = client.db('TheBookShop').collection('reviews');
        

        // get all services to db
        app.get('/services', async(req, res) => {   
            const query = {}
            const service = await servicesCollection.find(query).toArray();
            res.send(service)
        })
        
        // services with id
        app.get('/services/:id', async(req, res) => {  
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.send(service)
        })

        // add new service to db
        app.post('/new/services', async (req, res) => {
            const user = req.body;
            const result = await servicesCollection.insertOne(user);
            res.send(result);
        });

        // add user db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // get user
        app.get('/users', async (req, res) =>{
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })

        // Post Review db
        app.post('/review', async (req, res) => {
            const user = req.body;
            const result = await reviewsCollection.insertOne(user);
            res.send(result);
        });
        // get Reviews to db 
        app.get('/reviews', async (req, res) => {
            const query = {};
            const result = await reviewsCollection.find(query).sort({time: -1}).toArray();
            res.send(result);
        });
        // get Reviews to db 
        app.get('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await reviewsCollection.findOne(query);
            res.send(result);
        });
        // get Reviews to db with service id
        app.get('/service/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {serviceId:id};
            const result = await reviewsCollection.find(query).sort({time: -1}).toArray();
            res.send(result);
        });

        // get Reviews to db with user email
        app.get('/user/reviews/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email};
            const result = await reviewsCollection.find(query).sort({time: -1}).toArray();
            res.send(result);
        });

        // delete Reviews to db with id
        app.delete('/delete/reviews/:id',  async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = {_id: new ObjectId(id)}
            const result = await reviewsCollection.deleteOne(filter);
            res.send(result);
        })
        
        // reviews updated to db with id
        app.put('/update/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = {_id: new ObjectId(id)};
            const info = req.body;
            console.log(info)
            const option = {upsert: true};
            const update = {
                $set: {
                    comment:info.comment,
                }
            }
            const result = await reviewsCollection.updateOne(filter, update,option)
            res.send(result)
            
        })

    }


    finally{}
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('start server')
})




app.listen(port, () => {
    console.log(`listening on port ${port}`)
})