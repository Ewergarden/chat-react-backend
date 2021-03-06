import mongoose  from 'mongoose';
import express  from 'express';
import createRouts from "./core/createRouts";
import createSocket from "./core/socket";
import dotenv from "dotenv";



const app = express()
const http = require('http').Server(app);
let cors = require('cors')
app.use(cors())
app.get('/', function (request:any, response:any) {
    response.end('Hello from Express!')
})

// @ts-ignore

dotenv.config();


mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/chat', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true});


const io = createSocket(http);
// @ts-ignore
createRouts(app, io)

const PORT = process.env.PORT || 3001



http.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
