const express = require('express')
const config = require('config')
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const auth = require('./routes/auth');
dotenv.config()

if (!config.get('privateKey')) {
    process.exit(1)
}

const connectDB = require('./config/db');

/**
 * Connect to Mongo db
 */
connectDB()

const app = express();
const server = http.createServer(app);

const PORT =  5000;

/**
 * Parse incoming requests
 */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(cors({
    origin: 'http://localhost:4200'
}))

/**
 * call user routes
 */

app.use('/api/users', users)
app.use('/api/auth', auth)


server.listen(PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});