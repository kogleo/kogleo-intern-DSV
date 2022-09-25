const user = require('./user.routes')
const article = require('./article.routes')
const comment = require('./comment.routes')
const notify = require('./notify.routes')
module.exports = (router) => {
    user(router)
    article(router)
    comment(router)
    notify(router)
}