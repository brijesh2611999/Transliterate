const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.log('Issue in DB connection');
        console.error(error.message);
        process.exit(1);
    });
};
