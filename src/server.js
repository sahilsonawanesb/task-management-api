import dotenv from 'dotenv';
dotenv.config(); 
import mongoose from 'mongoose';
import app from './app.js';




// connecting to the database
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Mongodb is Connected')
    }).catch((error) => {
        console.log(error);
    })



// listen to Port
const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`);
});

