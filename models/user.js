const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    emailAdress: { type: String },
    pfImage: { type: String, default: "PeterGriffin.jpeg"}
})
userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

exports.User = User