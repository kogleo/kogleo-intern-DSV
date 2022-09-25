const router = require('express').Router()
const authCtrl = require('../controllers/auth.controller')

router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/logout', authCtrl.logout)

router.post('/refresh_token', authCtrl.generateAccessToken)

router.post('/fblogin', authCtrl.fblogin)


module.exports = router