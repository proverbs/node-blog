
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET, /posts?author=xxx, show posts
router.get('/', function (req, res, next) {
	const author = req.query.author // from url

	// query from database, get posts
	posts = [{
		author: 'proverbs',
		title: 'title-1',
		content: 'content-1'
	}, {
		author: 'proverbs',
		title: 'title-2',
		content: 'content-2'
	}]

	try {
		res.render('posts', {
			posts: posts
		})
	} catch(err) {
		next(err)
	}
})

// GET, /posts/create, show blog-post
router.get('/create', checkLogin, function (req, res, next) {
	res.render('create') // render views/create.ejs
})

// POST, /posts/create, post a blog
router.post('/create', checkLogin, function (req, res, next) {
	const author = req.session.user.name
	const title = req.fields.title // fields from form
	const content = req.fields.content

	try {
		if (!title.length) {
			throw new Error('请填写标题')
		}
		if (!content.length) {
			throw new Error('请填写内容')
		}
	} catch (e) {
		req.flash('error', e.message)
		return res.redirect('back')
	}

	let post = {
		author: author,
		title: title,
		content: content
	}

	try {
      // write post into database
      /*...*/
      req.flash('success', '发表成功')
      /*
      res.redirect(`/posts/${post._id}`)
      */
      res.redirect('/posts')
	} catch(err) {
		next(err)
	}	
})

// GET, /posts/:postId, show a posted blog
router.get('/:postId', checkLogin, function (req, res, next) {
	const postId = req.params.postId

	// query a post and its comments from database
	try {
		const post = {
			author: 'proverbs',
			title: postId,
			content: 'post content'
		}
		const comments = [{
			author: 'proverbs',
			postId: postId,
			content: 'comment content'
		}]

		if (!post) {
			throw new Error('Post not exists')
		}
		res.render('edit', {
			post: post,
			comments: comments
		})
	} catch (err) {
		next(err)
	}

})

// GET, /posts/:postId/edit, show posted-blog-edit
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	const postId = req.params.postId
	const author = req.session.user.name

	// query post from database

	try {
		/*
		if (!post) {
			throw new Error('该文章不存在')
		}
		if (author.toString() !== post.author._id.toString()) {
			throw new Error('权限不足')
		}
		*/
		res.render('edit', {
			post: post
		})
	} catch(err) {
		next(err)
	}
})

// POST, /posts/:postId/edit, modified a posted blog
router.post('/:postId/edit', checkLogin, function (req, res, next) {
	const postId = req.params.postId
	const author = req.session.user.name
	const title = req.fields.title
	const content = req.fields.content

	try {
		if (!title.length) {
			throw new Error('Please fill out title')
		}
		if (!content.length) {
			throw new Error('Please fill out content')
		}
	} catch (e) {
		req.flash('error', e.message)
		return res.redirect('back')
	}

	// query post from database
	try {
		/*
		if (!post) {
			throw new Error('Post not exists')
		}
		if (post.author.name.toString() !== author.toString()) {
			throw new Error('Not have permission')
		}
		*/
		req.flash('success', 'Edit successfully')
		res.redirect(`/posts/${postId}`)
	} catch (err) {
		next(err)
	}
})

// GET, /posts/:postId/remove, delete a posted blog
router.get('/:postId/remove', checkLogin, function (req, res, next) {
	const postId = req.params.postId
	const author = req.session.user.name

	// query post from database
	try {
		/*
		if (!post) {
			throw new Error('Post not exists')
		}
		if (post.author._id.toString() !== author.toString()) {
			throw new Error('Not have permission')
		}
		*/
		req.flash('success', 'Delete successfully')
		res.redirect('/posts')
	} catch (err) {
		next(err)
	}
})

// export router component for '/post'
module.exports = router