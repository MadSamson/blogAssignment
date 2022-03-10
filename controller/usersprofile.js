const {User} = require('../models/user')
const {Tweet} = require('../models/tweet')
const usersProfile = async(req, res) => {
    const userId = await req.params.id
    const user = await User.findOne({_id:userId})
    const userstweets = await Tweet.find({author: userId}).populate('author').sort({publishingDate:-1})
    res.render('usersprofile.ejs', {
        user,
        userstweets
    })
}
const usersProfile_post = async(req, res)=>{
    try {
        // if(!req.user) return res.redirect('/login')
        const usersIdToFollow = req.params.id
        if(req.user._id==usersIdToFollow) return res.redirect('/')
        if(req.user.following.indexOf(usersIdToFollow)!==-1) {
            req.flash('error', 'already following')
            return res.redirect(`/user/${usersIdToFollow}`)
        }
        await User.findByIdAndUpdate(req.user.id, { $push: { following: usersIdToFollow } })
        await User.findByIdAndUpdate(usersIdToFollow, { $push: { followers: req.user._id } })
        res.redirect(`/user/${usersIdToFollow}`)
    } catch (error) {
        console.log(error);
    }
}

const usersProfile_delete = async(req, res)=>{
    try {
        // if(!req.user) return res.redirect('/login')
        const usersIdToFollow = req.params.id
        if(req.user._id==usersIdToFollow) return res.redirect('/')
        await User.findByIdAndUpdate(req.user.id, { $pull: { following: usersIdToFollow } })
        await User.findByIdAndUpdate(usersIdToFollow, { $pull: { followers: req.user._id } })
        res.redirect(`/user/${usersIdToFollow}`)
    } catch (error) {
        console.log(error);
    }
}
module.exports = {usersProfile, usersProfile_post, usersProfile_delete}