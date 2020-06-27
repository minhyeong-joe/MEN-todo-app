const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// API repos
const users = require('./repos/users');
const todos = require('./repos/todos');

// connect to db
mongoose.connect(process.env.DB_URL);
mongoose.connection.on('connected', () => console.log("Connected to Database"));
mongoose.connection.on('error', err => console.log("DB Connection Error: " + err));

const app = express();

app.use(cors());

const PORT = process.env.PORT || 80;

// specify no icon (204: No Content)
app.get('/favicon.ico', (req, res) => res.status(204));

// set up static webpage route
app.use(express.static(path.join(__dirname, 'public')));

// use body-parser json for api calls
app.use(bodyParser.json());

// set up REST API endpoints
app.use('/api/users', users)
app.use('/api/todos', todos);

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});