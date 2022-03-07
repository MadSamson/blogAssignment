const {Tweet} = require('../models/tweet')

const index_get = async (req, res)=>{
    if(!req.user) return res.redirect('/login')
    const tweets = await Tweet.find({author: req.user}).populate('author')
    res.render('index.ejs', {
        username: req.user.username,
        tweets
    })   
}

const index_post = async(req, res)=>{
    const tweet = Tweet({story: req.body.story, author:req.user._id, publishingDate: Date()})
    await tweet.save()
    res.redirect('/')
}

module.exports = {index_get, index_post}