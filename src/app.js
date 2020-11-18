const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

//Variables
const authRoutes = require('./routes/auth.routes');
const apiDescription = require('./routes/apiDescription.routes');

//Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use('/api/v1', apiDescription)



//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);