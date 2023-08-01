import config from 'config'
const dotenv = require('dotenv');
import mongoose from 'mongoose'
import express from 'express'
import autoIncrement from 'mongoose-auto-increment'
const mongooseConnection = express()
dotenv.config({
    path: './.env',
});
let dbUrl: any
// if (process.env.NODE_ENV) dbUrl = config.get('local_db_url')
// if (!process.env.NODE_ENV) dbUrl = config.get('db_url')
// else dbUrl = config.get('clear')


mongoose.connect(
    "mongodb+srv://jeetsemicolon:jeet@0407@cluster0.u8l7t8f.mongodb.net/instructAi",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
).then(result => console.log('Database successfully connected')).catch(err => console.log(err))

export { mongooseConnection, autoIncrement }
