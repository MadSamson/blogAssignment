const {Tweet} = require('../models/tweet')
const tweetslist = async(req, res)=>{
    const tweets = await Tweet.find({}).populate('author').sort({publishingDate:-1})
    res.render('tweets.ejs', {
        tweets
    }) 
}
module.exports = {tweetslist}