const Users = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const authCtrl = {
    register: async (req, res) => {
        try {
            const { username, fullname ,email, password} = req.body
            let newUserName = username.toLowerCase().replace(/ /g, '')

            const user_name = await Users.findOne({username: newUserName})
            if(user_name) return res.status(400).json({msg: "This user name already exists."})

            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                username: newUserName, fullname: fullname, email, password: passwordHash
            })


            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
            })

            await newUser.save()

            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({email})
            .populate("followers following", "image username followers following")

            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refresh_token)

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    fblogin: async (req, res) => {
        try{
            const {userID, accessToken} = req.body
            
            let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture.width(720).height(720)&access_token=${accessToken} `
            fetch(urlGraphFacebook,{
                method: 'GET'
            })
            .then(response => response.json())
            .then(async response=> {
                const {email, name, picture} = response
                let password = email+process.env.ACCESS_TOKEN_SECRET
                const passwordHash = await bcrypt.hash(password, 12)
                const username = name.normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/đ/g, 'd').replace(/Đ/g, 'D') //Bo dau tieng viet
                const fullname = name
                const image = picture.data.url
                
                Users.findOne({email})
                .populate("followers following", "image username followers following")
                .exec((err, user) => {
                    if (err) {
                        return res.status(400).json({msg: "Something went wrong..."})
                    }
                    else {
                        if(user){
                            const access_token = createAccessToken({id: user._id})
                            const refresh_token = createRefreshToken({id: user._id})
                            res.cookie('refreshtoken', refresh_token)
                            res.json({
                                msg: 'Login Success!',
                                access_token,
                                user: {
                                    ...user._doc,
                                    password: ''
                                }
                            })
                        }
                        else{
                            
                            let newUserName = username.toLowerCase().replace(/ /g, '')
                            let newUser = new Users({
                                username: newUserName, fullname: fullname, email, password: passwordHash, image: image
                            })
                            newUser.save((err, data)=>{
                                if(err){
                                    return res.status(400).json({msg: "Login with facebook failed"})
                                }
                                const access_token = createAccessToken({id: data._id})
                                const refresh_token = createRefreshToken({id: data._id})
                                res.cookie('refreshtoken', refresh_token)
                                // const {_id, username, email} = user
                                res.json({
                                    msg: 'Login Success!',
                                    access_token,
                                    user: {
                                        ...newUser._doc,
                                        password: ''
                                    }
                                })
                            })
                            
                        }
                    }
                }
                )
            })
        } catch (err){
            return res.status(500).json({msg: err.message})
        }
        
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/api/refresh_token'})
            return res.json({msg: "Logged out!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) {
                return res.status(400).json({msg: ""})
            }
            
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                if(err) {
                    return res.status(400).json({msg: "Please login now."})
                }
                const user = await Users.findById(result.id).select("-password")
                .populate('followers following', 'image username followers following')
                if(!user) return res.status(400).json({msg: "This does not exist."})

                const access_token = createAccessToken({id: result.id})

                res.json({
                    access_token,
                    user
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

module.exports = authCtrl