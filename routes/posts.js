
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET, /posts?author=xxx, show posts
// pass
router.get('/', function (req, res, next) {
	const author = req.query.author // from url, author may be undefined

	// query from database, get posts
	posts = [{
		author: 'proverbs',
		title: 'title-1',
		content: 'content-1',
		_id: 'post-id1'
	}, {
		author: 'proverbs',
		title: 'title-2',
		content: 'content-2',
		_id: 'post-id2'
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
// pass
router.get('/create', checkLogin, function (req, res, next) {
	res.render('create') // render views/create.ejs
})

// POST, /posts/create, post a blog
// pass
router.post('/create', checkLogin, function (req, res, next) {
	const author = req.session.user.name
	const title = req.fields.title // fields from form
	const content = req.fields.content

	console.log('------------------------' + author + '-' + title + '-' + content)
	try {
		if (!title.length) {
			throw new Error('Please fill out title.')
		}
		if (!content.length) {
			throw new Error('Please fill out content')
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
      req.flash('success', 'Post successfully')
      /*
      res.redirect(`/posts/${post._id}`)
      */
      return res.redirect('/posts')
	} catch(err) {
		//next(err)
		console.log('----------------------------------' + 'catch error')
	}	
})

// GET, /posts/:postId, show a posted blog
// pass
router.get('/:postId', function (req, res, next) {
	const postId = req.params.postId

	// query a post and its comments from database
	try {
		// query...
		const post = {
			author: 'proverbs',
			title: postId,
			content: 'post content',
			_id: postId
		}
		const comments = [{
			author: 'proverbs',
			postId: postId,
			content: 'comment content',
			_id: 'post-id1'
		}]

		if (!post) {
			throw new Error('Post not exists')
		}
		return res.render('post', {
			post: post,
			comments: comments
		})
	} catch (err) {
		//next(err)
	}

})

// GET, /posts/:postId/edit, show posted-blog-edit
// pass
// do not have link in /posts/:postId
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	const postId = req.params.postId
	const author = req.session.user.name

	// query post from database

	try {
		// query
		const post = {
			author: 'proverbs',
			title: postId,
			content: 'post content',
			_id: postId
		}
		/*
		if (!post) {
			throw new Error('该文章不存在')
		}
		if (author.toString() !== post.author._id.toString()) {
			throw new Error('权限不足')
		}
		*/
		return res.render('edit', {
			post: post
		})
	} catch(err) {
		//next(err)
	}
})

// POST, /posts/:postId/edit, modified a posted blog
// pass
// do not have link
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

	// write post back to database
	try {
		// write back
		/*
		if (!post) {
			throw new Error('Post not exists')
		}
		if (post.author.name.toString() !== author.toString()) {
			throw new Error('Not have permission')
		}
		*/
		req.flash('success', 'Edit successfully')
		return res.redirect(`/posts/${postId}`)
	} catch (err) {
		//next(err)
	}
})

// GET, /posts/:postId/remove, delete a posted blog
// pass
// do not have link
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
		return res.redirect('/posts')
	} catch (err) {
		//next(err)
	}
})

// export router component for '/post'
module.exports = router