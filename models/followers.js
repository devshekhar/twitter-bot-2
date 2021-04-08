var mongoose = require('mongoose');

let followers = new mongoose.Schema({
    username: String,
    followerslist:[String]
  })
  
  module.exports = mongoose.model('followers', followers)