const express = require("express");
const cors = require("cors");
require("dotenv").config();

// port defined
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json())

// username: practice-crud
// password: bZlL0XuZaXDHCvsf

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.55jtswj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productsCollection = client.db("practiceCrud").collection("practiceCrud1");

        // get product
        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get("/products/:id", async (req, res) => {
            const _id = req.params.id;
            const query = { _id: new ObjectId(_id) };
            console.log(query);
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        //post product
        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            console.log("new product: ", newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        });

        //update product
        app.put('/products/:id', async (req, res) => {
            const _id = req.params.id;
            console.log(_id);
            const product = req.body;
            const filter = { _id: new ObjectId(_id) };
            const options = { upsert: true };
            const updatedProduct = {
                $set: {
                    productName: product.productName,
                    productPrice: product.productPrice,
                }
            }
            const result = await productsCollection.updateOne(filter, updatedProduct, options);
            res.send(result);
        });

        // delete product
        app.delete("/products/:id", async (req, res) => {
            const _id = req.params.id;
            const query = { _id: new ObjectId(_id) };
            console.log(query);
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Practice crud server connected successfully.")
})

app.listen(port, () => {
    console.log("Practice crud server connected successfully.");
});