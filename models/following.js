var mongoose = require('mongoose');

let following = new mongoose.Schema({
    username: String,
    followinglist:[String]
  })
  
  module.exports = mongoose.model('following', following)