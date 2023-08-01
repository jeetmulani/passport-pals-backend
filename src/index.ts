/**
 * @author Jeet Mulani
 * @description Server and REST API config
 */
import express from 'express';
import cors from 'cors'
import http from 'http';
import { mongooseConnection } from './database'
import { router } from './routes'

const app = express();
import config from 'config';



console.log(process.env.NODE_ENV || 'localhost');
// let stripeid:any = config.get('stripe')
// export const stripe = require('stripe')(stripeid.secret);
app.use(mongooseConnection)
app.use(cors())
app.use(express.json())
const health = (req, res) => {
    return res.status(200).json({
        message: "PassportPals backend server is running",
    })
}
const bad_gateway = (req, res) => { return res.status(502).json({ status: 502, message: "PassportPals Backend API Bad Gateway" }) }
app.get('/', health);
app.get('/health', health);
app.get('/isServerUp', (req, res) => {
    res.send('Server is running ');
});
app.use(router)
app.use('*', bad_gateway);

let server = new http.Server(app);
export default server;