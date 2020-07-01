const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

// connect to db
mongoose.connect(process.env.DB_URL, { userFindAndModify: false});
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

// use passport for auth token
app.use(passport.initialize());
app.use(passport.session());

require('./passport')(passport);

// set up REST API endpoints
const repos = require('./repos');
app.use('/api', repos)

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});