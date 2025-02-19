const express = require('express');
const cors = require('cors');


// created app here..

const app = express();


// middlewares
app.use(cors());

module.exports(app);