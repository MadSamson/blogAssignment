const { User } = require('../models/user')

const profile_get = (req, res)=>{
    res.render('profile.ejs', {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.emailAdress,
        profileImage: req.user.pfImage
    })
}
const profile_post = async(req, res)=>{
    const {firstname, lastname, emailAdress} = req.body
    
    await User.findOneAndUpdate(
        {username: req.user.username},
        {$set:
            {firstname,
            lastname,
            emailAdress,
            pfImage: req.file.filename
            }
        }
    )
    res.redirect('/profile')
}

module.exports = {profile_get, profile_post}