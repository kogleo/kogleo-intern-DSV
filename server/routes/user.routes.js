const userCtrl = require('./../controllers/user.controller')
const auth = require("../middleware/auth")
const router = require('express').Router()

// module.exports = (router) => {

//     /**
//      * get a user
//      */
//     router
//         .route('/user/:id')
//         .get(usercontroller.getUser)

//     /**
//      * get a user profile
//      */
//     router
//         .route('/user/profile/:id')
//         .get(usercontroller.getUserProfile)

//     /**
//      * adds a user
//      */
//     router
//         .route('/user')
//         .post(usercontroller.addUser)

//     /**
//      * follow a user
//      */
//     router
//         .route('/user/follow')
//         .post(usercontroller.followUser)
// }

router.get('/search', userCtrl.searchUser)

router.get('/user/:username', userCtrl.getUser)

router.patch('/user', auth, userCtrl.updateUser)

router.patch('/user/:id/follow', auth, userCtrl.follow)
router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)

// router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)



module.exports = router