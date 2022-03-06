const express = require('express')
const expressSession = require('express-session')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const {User} = require('./models/user')
const {Tweet} = require('./models/tweet')
const dayjs = require('dayjs')

const app = express()
const port = 4000

// dictate multer where to store files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
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
app.use(expressSession({secret: "blasdkjfaöjsdf",saveUninitialized: false,resave: false}))
app.use(passport.authenticate("session"))
app.use(express.static('public'))

app.get('/', checkLogin, async(req, res)=>{
    if(!req.user) return res.redirect('/login')
    const tweets = await Tweet.find({author: req.user}).populate('author')
    res.render('index.ejs', {
        username: req.user.username,
        tweets
    })
})

app.post('/', checkLogin, async(req, res)=>{
    const tweet = Tweet({story: req.body.story, author:req.user._id, publishingDate: Date()})
    console.log(tweet);
    await tweet.save()
    res.redirect('/')
})

app.get('/register', (req, res)=>{
    res.render('register.ejs')
})

app.post('/register', async(req, res)=>{
    try {
        let user = await User.findOne({username: req.body.username})
        if (user) return res.status(400).redirect('/register')
        
        user = new User({username: req.body.username})
        await user.setPassword(req.body.password);
        await user.save()
        res.redirect('/login')
    } catch (err) {
        console.error(err);
        res.redirect('/register')
    }
})

app.get('/login', (req, res)=>{
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

app.get('/profile',checkLogin, (req, res)=>{
    
    res.render('profile.ejs', {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.emailAdress,
        profileImage: req.user.pfImage
    })
})

app.post('/profile', checkLogin, upload.single('pfImage'), async(req, res)=>{
    const {firstname, lastname, emailAdress} = req.body
    console.log(req.file);
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
})

// app.post('/logout', (req, res) => {
//     req.logout()
//     res.redirect('/login')
// })

app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})

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