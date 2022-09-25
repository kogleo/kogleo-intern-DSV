const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    parent: {type: mongoose.Types.ObjectId, ref: 'comment'},
    reply: {type: mongoose.Types.ObjectId, ref: 'comment'},
    likes: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    articleId: mongoose.Types.ObjectId,
    articleUserId: mongoose.Types.ObjectId
}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentSchema)