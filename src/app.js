require('./db/database');

const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');


const { createRoles } = require('./libs/initialSetup');

const authRoutes = require('./routes/auth.routes');
const apiDescriptionRoutes = require('./routes/apiDescription.routes');


const app = express();
createRoles();



//Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use('/api/v1', apiDescriptionRoutes);
app.use('/api/v1/login', authRoutes);



//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);