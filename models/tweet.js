const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
    story: {type: String, required: true, maxLenth: 280},
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    publishingDate: {type:Date}
})

const Tweet = mongoose.model('Tweet', tweetSchema)

exports.Tweet = Tweet