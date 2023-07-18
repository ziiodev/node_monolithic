const mongoose = require('mongoose');
const { DB_URL } = require('../config')

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      //useUnifiedToplogy: true,
      //useCreateIndex: true,
    });
    console.log('DB connection established')
  } catch (err) {
    console.error('Error ==========')
    console.log(err)
    process.exit(1)
  }
}