const express = require('express')
const expressSession = require('express-session')
const multer = require('multer')
const flash = require('express-flash');
const passport = require('passport')
const mongoose = require('mongoose')
const {User} = require('./models/user')
const {Tweet} = require('./models/tweet')
const aboutController = require('./controller/about')
const registerController = require('./controller/register')
const profileController = require('./controller/profile')
const loginANDlogout = require('./controller/login&logout')
const indexController = require('./controller/index')
const tweetsController = require('./controller/tweets')
const uspfController = require('./controller/usersprofile')

const app = express()
const port = 4000

// dictate multer where to store files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.urlencoded({extended: true}))
app.use(expressSession({secret: "mySecretIs:lalalalala",saveUninitialized: false,resave: false}))
app.use(passport.authenticate("session"))
app.use(express.static('public'))
app.use(flash())


app.get('/', checkLogin, indexController.index_get)
app.post('/', checkLogin, indexController.index_post)
app.get('/tweets', tweetsController.tweetslist)
app.get('/user/:id', uspfController.usersProfile)
app.post('/user/:id/follow', checkLogin, uspfController.usersProfile_post)
app.post('/user/:id/unfollow', checkLogin, uspfController.usersProfile_delete)
app.get('/register', registerController.register_get)
app.post('/register', registerController.register_post)
app.get('/login', loginANDlogout.login_get)
app.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    successRedirect: '/'
}))
app.get('/profile', checkLogin, profileController.profile_get)
app.post('/profile', checkLogin, upload.single('pfImage'), profileController.profile_post)
app.get('/logout', loginANDlogout.logout)
app.get('/about', aboutController.about)

function checkLogin(req, res, next) {
    if(req.user){
        return next()
    }
    res.redirect('/login')
}

mongoose.connect('mongodb://localhost/backend2')
app.listen(port, ()=> console.log(`listening on port ${port}`))

// referance
// https://medium.com/swlh/how-to-upload-image-using-multer-in-node-js-f3aeffb90657