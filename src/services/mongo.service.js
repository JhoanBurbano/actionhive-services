require('dotenv').config();
const mongoose = require('mongoose');

const { mongo: {user, password, database} } = require('../config');

mongoose.connect(`mongodb+srv://${user}:${password}@pruebastecnicas.sm4lf1d.mongodb.net/${database}?retryWrites=true&w=majority`)
.then((db) => console.log(`Mongo DB has been conected in: ${db.connection.name}`))
.catch(err=>console.log(`This error has been interupt: \n${err}`));