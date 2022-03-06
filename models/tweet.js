const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
    story: {type: String, required: true, maxLenth: 280},
    by: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
})

const Tweet = mongoose.model('Tweet', tweetSchema)

exports.Tweet = Tweet