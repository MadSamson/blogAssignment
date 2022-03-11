const {Tweet} = require('../models/tweet')
const {User} = require('../models/user')

const index_get = async (req, res)=>{
    try {
        // if(!req.user) return res.redirect('/login')
        // if(!req.user){
        //     const tweets = await Tweet.find({}).populate('author').sort({publishingDate:-1})
        //     return res.render('tweets.ejs', {
        //     tweets
        // }) 
        // }
        let myarray = req.user.following
        myarray.push(req.user._id)
        
        const tweets = await Tweet.find({author: myarray}).populate('author').sort({publishingDate:-1}) 
        res.render('index.ejs', {
        username: req.user.username,
        tweets
    })   
    } catch (error) {
        console.log(error)
    }
    
}

const index_post = async(req, res)=>{
    try {
        const tweet = await Tweet({story: req.body.story, author:req.user._id, publishingDate: Date()})
        await tweet.save()
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {index_get, index_post}