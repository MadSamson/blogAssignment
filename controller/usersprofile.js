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
module.exports = {usersProfile}