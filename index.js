const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0lhbrs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        const categoriesCollection = client.db('TheBookShop').collection('services')

        app.get('/services', (req, res) => {
            res.send('services section')
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