const mongoose = require('mongoose');
const config =  require('config');

/**
 * Get mongo credentials
 */

const db = config.get('mongoURI');

/**
 * Connect to mongo
 */

const connectDB = async () => {
  try{
     await mongoose.connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
     })
     console.log('Connected to mongoDB');
  }catch(error){
      console.error(error.message);
      process.exit(1);
  }
}

module.exports = connectDB;


