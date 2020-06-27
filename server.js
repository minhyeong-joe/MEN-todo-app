const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const dbUrl = process.env.DB_URL;
const DB = process.env.DB_NAME;
const client = new MongoClient(dbUrl, { useNewUrlParser: true });

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 80;

// specify no icon (204: No Content)
app.get('/favicon.ico', (req, res) => res.status(204));

// temporary test for db connection
app.get('/', (req, res) => {
    res.send("Hello World");
    client.connect(err => {
        console.log("Connected to Database");
        
        const collection = client.db(DB).collection("todos");
        collection.find({}).toArray((err, docs) => {
            console.log("Successfully retrieved data");
            console.log(docs);
        });
        client.close();
    });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});