require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');


// listen to Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});

