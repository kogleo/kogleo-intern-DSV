const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            maxlength: 16,
            unique: true
        },
        fullname: {
            type: String,
            maxlength: 25,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        bio: String,
        token: String,
        image: {
            type: String,
            default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        favourites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Article'
            }
        ],
    }
)

module.exports = mongoose.model('User', UserSchema)