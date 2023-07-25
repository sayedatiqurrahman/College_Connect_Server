const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require('dotenv').config()
// const collegeData = require('./Data/collegeData.json');
const app = express()
const port = process.env.port || 5000
// middleware
app.use(cors())
app.use(express.json());



// const uri = "mongodb+srv://college-connect:sfKxgg5VabyBDTT4@atiqurrahman.ac8ixft.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb://127.0.0.1:27017";



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
        // Collections name
        const collegeCollections = client.db("college-connect").collection("colleges");
        const TestimonialCollections = client.db("college-connect").collection("Testimonial");
        const ResearchCollections = client.db("college-connect").collection("Research");
        const applyCollection = client.db("college-connect").collection("apply")

        // routes
        app.get("/", async (req, res) => {
            const searchQuery = req.query.q;
            if (searchQuery) {
                const searchResults = await collegeCollections.find({
                    name: {
                        $regex: new RegExp(searchQuery, "i"), // "i" for case-insensitive matching
                    },
                }).toArray();

                res.send(searchResults)
                return
            } else {
                const collegeData = await collegeCollections.find({}).toArray()
                res.send(collegeData)
            }

        })
        app.get('/collegeDetails/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: new ObjectId(id) }
            const result = await collegeCollections.findOne(query);

            res.send(result)
        })
        app.get("/testimonials", async (req, res) => {
            const result = await TestimonialCollections.find({}).toArray()
            res.send(result)
        })

        app.get("/research-paper", async (req, res) => {

            const result = await ResearchCollections.find({}).toArray()
            res.send(result)
        })
        // Admission Apply
        app.get("/apply", async (req, res) => {


            res.send("I am Here")


        });
        app.post("/apply", async (req, res) => {
            try {
                const newData = req.body;
                console.log(newData);


                // Insert the newData object with the new _id field
                const result = await applyCollection.insertOne(newData);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An internal server error occurred.' });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log("app is running at port", port);
})