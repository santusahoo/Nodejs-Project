const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');

const passport = require('./auth');
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// middleware function
const logger = (req, res, next) => {
    console.log(`[${new Date()}] Request made to: ${req.originalUrl}`);
    next();
}

// use the middleware
app.use(logger);

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false})

// get method to test the connection
app.get('/', passport.authenticate('local', {session: false}), (req, res) => {
    res.send('Hello World');
});

const personRouter = require('./routes/person');
app.use('/person', personRouter);

const menuRouter = require('./routes/menu');
app.use('/menu',menuRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});