
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

const fs = require('fs')

// GET, /posts?author=xxx, show posts
// pass
router.get('/', function (req, res, next) {
	const author = req.query.author // from url, author may be undefined

	// query from database, get posts
	fs.readFile('posts.json', 'utf-8', function (err, allPosts) {
		if (!err) {
			var posts = []
			allPosts = JSON.parse(allPosts)
			for (let i = 0; i < allPosts.length; i ++) {
				if (author === undefined || allPosts[i].author === author) {
					posts.push(allPosts[i])
				}
			}
			try {
				return res.render('posts', {
					posts: posts
				})
			} catch (err) {
				next(err)
			}
		}
		else {
			console.log('POSTS READ ERROR')
			next(err)
		}
	})
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
		content: content,
		_id: Date.now().toString() // use timestamp as id
	}

      // write post into database
    fs.readFile('posts.json', 'utf-8', function (err, allPosts) {
      	if (!err) {
      		allPosts = JSON.parse(allPosts)
      		allPosts.push(post)
      		fs.writeFile('posts.json', JSON.stringify(allPosts), function (err) {
      			if (!err) {
      				req.flash('success', 'Post successfully')
      				return res.redirect(`/posts/${post._id}`)
      			} else {
					next(err)
      			}
      		})
      	} else {
      		next(err)
      	}
	})
})

// GET, /posts/:postId, show a posted blog
// pass
router.get('/:postId', function (req, res, next) {
	const postId = req.params.postId

	// query a post and its comments from database
	var post =  null
	var comments = []
	fs.readFile('posts.json', 'utf-8', function (err, allPosts) {
		if (!err) {
			allPosts = JSON.parse(allPosts)
			for (let i = 0; i < allPosts.length; i ++) {
				if (allPosts[i]._id === postId) {
					post = allPosts[i]
				}
			}
			fs.readFile('comments.json', 'utf-8', function (err, allComments) {
				if (!err) {
					allComments = JSON.parse(allComments)
					for (let i = 0; i < allComments.length; i ++) {
						if (allComments[i].postId === post._id) {
							comments.push(allComments[i])
						}
					}
					try {
						return res.render('post', {
							post: post,
							comments: comments
						})
					} catch (err) {
						next(err)
					}

				} else {
					next(err)
				}
			})
		} else {
			next(err)
		}
	})
})

// GET, /posts/:postId/edit, show posted-blog-edit
// pass
// do not have link in /posts/:postId(becauseof css)
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	const postId = req.params.postId
	const author = req.session.user.name

	// query
	fs.readFile('posts.json', 'utf-8', function (err, allPosts) {
		if (!err) {
			allPosts = JSON.parse(allPosts)
			for (let i = 0; i < allPosts.length; i ++) {
				if (allPosts[i]._id === postId) {
					if (allPosts[i].author !== author) {
						next(new Error('Not have permission'))
					}
					try {
						return res.render('edit', {
							post: allPosts[i]
						})
					} catch (err) {
						next(err)
					}
				}
			}
			next(new Error('Post not exists'))
		} else {
			next(err)
		}
	})
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
	} catch (err) {
		req.flash('error', err.message)
		return res.redirect('back')
	}

	// write post back to database
	fs.readFile('posts.json', 'utf-8', function (err, allPosts) {
		if (!err) {
			allPosts = JSON.parse(allPosts)
			for (let i = 0; i < allPosts.length; i ++) {
				if (allPosts[i]._id === postId) {
					allPosts[i].title = title
					allPosts[i].content = content
					fs.writeFile('posts.json', JSON.stringify(allPosts), function (err) {
						if (!err) {
							req.flash('success', 'Edit successfully')
							return res.redirect(`/posts/${postId}`)
						} else {
							next(err)
						}
					})
				}
			}
		} else {
			next(err)
		}
	})
})

// GET, /posts/:postId/remove, delete a posted blog
// pass
// do not have link
router.get('/:postId/remove', checkLogin, function (req, res, next) {
	const postId = req.params.postId
	const author = req.session.user.name

	// query post from database
	fs.readFile('posts.json', 'utf-8', function (err, allPosts) {
		if (!err) {
			allPosts = JSON.parse(allPosts)
			for (let i = 0; i < allPosts.length; i ++) {
				if (allPosts[i]._id === postId) {
					allPosts.splice(i, 1)
					fs.writeFile('posts.json', JSON.stringify(allPosts), function (err) {
						if (!err) {
							req.flash('success', 'Delete successfully')
							return res.redirect('/posts')
						} else {
							next(err)
						}
					})
				}
			}
		} else {
			next(err)
		}
	})
})

// export router component for '/post'
module.exports = router