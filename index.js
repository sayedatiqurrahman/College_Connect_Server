const express = require('express');
const cors = require("cors")
const mongodb = require('mongodb');
require('dotenv').config()
const collegeData = require('./Data/collegeData.json');
const app = express()
const port = process.env.port || 5000
// middleware
app.use(cors())
app.use(express())



// routes
app.get("/", (req, res) => {
    res.send(collegeData)
})

app.listen(port, () => {
    console.log("app is running at port", port);
})