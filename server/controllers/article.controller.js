/** */
const Articles = require('../models/article.model')
const User = require('../models/user.model')
const Comments = require('../models/comment.model')
const Notifies = require('../models/notify.model')
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const articleCtrl = {
    createArticle: async (req, res) => {
        try {
            const { title, description, body, taglist, cloudImage } = req.body

            const newArticle = new Articles({
                title, description, body, taglist, author: req.user._id, image: cloudImage
            })
            await newArticle.save()

            res.json({
                msg: 'Successfully Created Article!',
                newArticle: {
                    ...newArticle._doc,
                    author: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getArticles: async (req, res, next) => {
        try {
            var query = {};
            var limit = 5;
            var offset = 0;
            if(typeof req.query.limit !== 'undefined'){
                limit = req.query.limit;
            }

            if(typeof req.query.offset !== 'undefined'){
                offset = req.query.offset;
            }

            if( typeof req.query.tag !== 'undefined' ){
                query.taglist = {"$in" : [req.query.tag]};
            }
            Promise.all([
                req.query.author ? User.findOne({username: req.query.author}) : null,
                req.query.favourited ? User.findOne({username: req.query.favourited}) : null
              ]).then(function(results){
                var author = results[0];
                var favoriter = results[1];

                if(author){
                  query.author = author._id;
                }
            
                if(favoriter){
                  query._id = {$in: favoriter.favourites};
                } else if(req.query.favourited){
                  query._id = {$in: []};
                }
                return Promise.all([
                  Articles.find(query)
                    .limit(Number(limit))
                    .skip(Number(offset))
                    .sort({createdAt: 'desc'})
                    .populate('author favourites')
                    .exec(),
                  Articles.count(query).exec(),
                  req.payload ? User.findById(req.payload.id) : null,
                ]).then(function(results){
                  var articles = results[0];
                  var articlesCount = results[1];
                  var user = results[2];
            
                  return res.json({
                    articles,
                    articlesCount: articlesCount
                  });
                });
              }).catch(next);

        } catch (err) {
            return res.status(500).json({msg: err.message} + req.user)
        }
    },
    getFeedArticles: async (req, res, next) => {
        try {
            var limit = 5;
            var offset = 0;
            if(typeof req.query.limit !== 'undefined'){
                limit = req.query.limit;
              }
            
            if(typeof req.query.offset !== 'undefined'){
                offset = req.query.offset;
            }
            // const following = req.user.following
            // const articles = await Articles.find({author: {$in: following}}).sort('-createdAt')
            // .populate("author favourites", "image username followers")
            // res.json({
            //     msg: "Get Article Completely!",
            //     articles
            // })
            User.findById(req.user._id).then(function(user){
                if (!user) { return res.sendStatus(401); }
            
                Promise.all([
                  Articles.find({ author: {$in: user.following}})
                    .limit(Number(limit))
                    .skip(Number(offset))
                    .sort({createdAt: 'desc'})
                    .populate("author favourites", "image username followers")
                    .exec(),
                  Articles.count({ author: {$in: user.following}})
                ]).then(function(results){
                  var articles = results[0];
                  var articlesCount = results[1];
            
                  return res.json({
                    msg: "Get Article Completely!",
                    articles,
                    articlesCount: articlesCount
                  });
                }).catch(next);
            });
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateArticle: async (req, res) => {
        try {
            const { title, description, body, taglist, cloudImage } = req.body
            const article = await Articles.findOneAndUpdate({slug: req.params.slug}, {
                title, description, body, taglist, image: cloudImage
            }, {new: true}).populate("author favourites", "image username")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            const notify = await Notifies.findOneAndUpdate({url: `/article/${req.params.slug}`},{
                url: `/article/${article.slug}`
            })

            res.json({
                msg: "Updated Post!",
                newArticle: {
                    ...article._doc,
                    title, description, body, taglist
                },
                newNotify: notify
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    favouriteArticle: async (req, res) => {
        try {
            const article = await Articles.find({slug: req.params.slug, favourites: req.user._id})
            if(article.length > 0) return res.status(400).json({msg: "You liked this article."})

            const favedArticle = await Articles.findOne({slug: req.params.slug})

            const favourite = await Articles.findOneAndUpdate({slug: req.params.slug}, {
                $push: {favourites: req.user._id}
            }, {new: true})

            if (favedArticle.author._id != req.user._id){
                const user = await User.findOneAndUpdate({_id: req.user._id}, {
                    $push: {favourites: favedArticle._id}
                }, {new: true})
                if(!user) return res.status(400).json({msg: 'This user does not exist.'})
            }

            if(!favourite) return res.status(400).json({msg: 'This article does not exist.'})

            res.json({msg: 'Liked Article!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unFavouriteArticle: async (req, res) => {
        try {

            const favourite = await Articles.findOneAndUpdate({slug: req.params.slug}, {
                $pull: {favourites: req.user._id}
            }, {new: true})

            const favedArticle = await Articles.findOne({slug: req.params.slug})
            if (favedArticle.author._id != req.user._id){
                const user = await User.findOneAndUpdate({_id: req.user._id}, {
                    $pull: {favourites: favedArticle._id}
                }, {new: true})
                if(!user) return res.status(400).json({msg: 'This article does not exist.'})
            }

            if(!favourite) return res.status(400).json({msg: 'This Article does not exist.'})

            res.json({msg: 'UnLiked Article!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserArticles: async (req, res) => {
        try {
            const features = new APIfeatures(Articles.find({author: req.params.id}), req.query)
            .paginating()
            const articles = await features.query.sort("-createdAt")
            .populate("author favourites", "image username followers")
            res.json({
                articles,
                result: articles.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getArticle: async (req, res) => {
        try {
            const article = await Articles.findOne({slug: req.params.slug})
            .populate("author favourites", "image username followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    // select: "-password"
                },
                // options: {sort: { 'createdAt': -1 }}
            })
            
            if(!article) return res.status(400).json({msg: 'This article does not exist.'})

            res.json({
                article
            })

        } catch (err) {
            
            return res.status(500).json({msg: err.message})
        }
    },
    deleteArticle: async (req, res) => {
        try {

            const article = await Articles.findOneAndDelete({slug: req.params.slug, user: req.user._id})
            await Comments.deleteMany({_id: {$in: article.comments }})
            
            res.json({
                msg: 'Deleted Article!',
                newArticle: {
                    ...article,
                    author: req.user
                }
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getTagList: async (req, res) => {
        try {
            // const tagList = await Articles.find().distinct('taglist')
            const tagList = await Articles.aggregate([
                {
                    "$unwind": "$taglist"
                  },
                  {
                    "$group": {
                      "_id": "$taglist",
                      "Count": {
                        "$sum": 1
                      },
                      
                    }
                  },
                  {
                    "$match": {
                      "Count": {
                        "$gt": 0
                      }
                    }
                  },
                  {
                    "$project": {
                      "_id": 0,
                      "Name": "$_id",
                      "Count": 1
                    }
                  }
            ]).sort({Count: 'desc'})
            res.json({
                msg: 'Get TagList Successfully!',
                tags: tagList,
                // tempTags: tempTagList
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    searchArticle: async (req, res) => {
        try {
            const articles = await Articles.find({title: {$regex: req.query.title}})
            .limit(10)
            
            res.json({articles})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = articleCtrl