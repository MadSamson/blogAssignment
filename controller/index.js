const {Tweet} = require('../models/tweet')
const {User} = require('../models/user')

const index_get = async (req, res)=>{
    if(!req.user) return res.redirect('/login')
    let myarray = req.user.following
    myarray.push(req.user._id)
    
    const tweets = await Tweet.find({author: myarray}).populate('author').sort({publishingDate:-1}) 
    res.render('index.ejs', {
        username: req.user.username,
        tweets
    })   
}

const index_post = async(req, res)=>{

    const tweet = await Tweet({story: req.body.story, author:req.user._id, publishingDate: Date()})
    await tweet.save()

    res.redirect('/')
}

module.exports = {index_get, index_post}