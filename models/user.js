const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    firstname: { type: String, defoult:'-' },
    lastname: { type: String, defoult:'-' },
    emailAdress: { type: String, defoult:'-' },
    pfImage: { type: String, default: "PeterGriffin.jpeg"},
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: 0 }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: 0 }]
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

exports.User = User