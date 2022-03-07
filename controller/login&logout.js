const login_get = (req, res)=>{
    res.render('login.ejs')
}
const logout = (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
}
module.exports = {login_get, logout}