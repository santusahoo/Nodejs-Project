const mongoose = require('mongoose');
// const mongoURI = process.env.DB_URL_LOCAL;
const mongoURI = process.env.DB_URL_LOCAL;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('connected', () => {
    console.log('connected to MongoDB server');
});

db.on('error', (err) => {
    console.log('Mongoose failed to connect',err);
});

db.on('disconnected', () => {
    console.log('Mongoose is disconnected');
});

module.exports = db; // export the variable db