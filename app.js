const express = require('express')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const {User} = require('./models/user')
const {Tweet} = require('./models/tweet')
const dayjs = require('dayjs')

const app = express()
const port = 4000

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.urlencoded({extended: true}))
app.use(expressSession({secret: "blasdkjfaöjsdf",saveUninitialized: false,resave: false}))
app.use(passport.authenticate("session"))

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
