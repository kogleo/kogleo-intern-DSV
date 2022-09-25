const router = require('express').Router()
const commentCtrl = require('../controllers/comment.controller')
const auth = require('../middleware/auth')


router.post('/comment', auth, commentCtrl.createComment)

router.patch('/comment/:id', auth, commentCtrl.updateComment)

router.patch('/comment/:id/favourite', auth, commentCtrl.favouriteComment)

router.patch('/comment/:id/unfavourite', auth, commentCtrl.unFavouriteComment)

router.delete('/comment/:id', auth, commentCtrl.deleteComment)



module.exports = router