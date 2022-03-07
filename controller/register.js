const {User} = require('../models/user')
const register_get = (req, res)=>{
    res.render('register.ejs')
}

const register_post = async (req, res)=>{
    try {
        let user = await User.findOne({username: req.body.username})
        if(user) {
            req.flash('error', 'Username already exist')
            return res.status(400).redirect('/register')
        }
        
        user = new User({username: req.body.username})
        await user.setPassword(req.body.password);
        await user.save()
        res.redirect('/login')
    } catch (err) {
        req.flash('error', 'Failed')
        res.redirect('/register')
    }
}
module.exports= {register_get, register_post}