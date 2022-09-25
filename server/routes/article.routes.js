const router = require('express').Router()
const articleCtrl = require('../controllers/article.controller')
const auth = require('../middleware/auth')

// module.exports = (router) => {

//     /**
//      * get all articles
//      */
//     router
//         .route('/articles')
//         .get(articlecontroller.getAll)

//     /**
//      * add an article
//      */
//     router
//         .route('/article')
//         .article(multipartWare, articlecontroller.addArticle)

//     /**
//      * clap on an article
//      */
//     router
//         .route('/article/clap')
//         .article(articlecontroller.clapArticle)

//     /**
//      * comment on an article
//      */
//     router
//         .route('/article/comment')
//         .article(articlecontroller.commentArticle)

//     /**
//      * get a particlular article to view
//      */
//     router
//         .route('/article/:id')
//         .get(articlecontroller.getArticle)
// }

router.get('/articles/search', articleCtrl.searchArticle)
router.route('/articles')
    .post(auth, articleCtrl.createArticle)
    .get(articleCtrl.getArticles)

router.route('/article/:slug')
    .patch(auth, articleCtrl.updateArticle)
    .get(articleCtrl.getArticle)
    .delete(auth, articleCtrl.deleteArticle)

router.route('/articles/feed')
    .get(auth, articleCtrl.getFeedArticles)

router.patch('/article/:slug/favourite', auth, articleCtrl.favouriteArticle)

router.patch('/article/:slug/unfavourite', auth, articleCtrl.unFavouriteArticle)

router.get('/user_articles/:slug', auth, articleCtrl.getUserArticles)

router.get('/tags', articleCtrl.getTagList)

// router.get('/article_discover', auth, articleCtrl.getArticlesDicover)

// router.patch('/saveArticle/:id', auth, articleCtrl.saveArticle)

// router.patch('/unSaveArticle/:id', auth, articleCtrl.unSaveArticle)

// router.get('/getSaveArticles', auth, articleCtrl.getSaveArticles)

module.exports = router