var mongoose = require('mongoose');

let usertwit = new mongoose.Schema({
    username: String,
    twit:[{"twitt":String,"createdAT":Date}],
  })
  
  module.exports = mongoose.model('usertwit', usertwit)