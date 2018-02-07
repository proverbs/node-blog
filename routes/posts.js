
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin




// GET, /posts, show posts
router.get('/', function (req, res, next) {
	const author = req.query.author // ???

})

// GET, /posts/create, show blog-post
router.get('/create', checkLogin, function (req, res, next) {
	res.render('create') // render views/create.ejs
})

// POST, /posts/create, post a blog
router.post('/create', checkLogin, function (req, res, next) {
	const author = req.session.user._id
	const title = req.fields.title
	const content = req.fields.content	
})

// GET, /posts/:postId, show a posted blog
router.get('/:postId', checkLogin, function (req, res, next) {
	const postId = req.params.postId

})

// GET, /posts/:postId/edit, show posted-blog-edit
router.get('/:postId/edit', checkLogin, function (req, res, next) {

})

// POST, /posts/:postId/edit, modified a posted blog
router.post('/:postId/edit', checkLogin, function (req, res, next) {

})

// GET, /posts/:postId/remove, delete a posted blog
router.get('/:postId/remove', checkLogin, function (req, res, next) {
	
})

// export router component for '/post'
modules.exports = router