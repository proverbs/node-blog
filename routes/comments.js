const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin


// POST, /comments, add a comment(cannot visit directly)
// pass 
// flash does not work
router.post('/', checkLogin, function (req, res, next) {
	const author = req.session.user.name
	const postId = req.fields.postId // ???
	const content = req.fields.content
	console.log('-------------------------' + author + '-' + postId + '-' + content)

	try {
	    if (!content.length) {
	    	throw new Error('Please fill out the comment')
	    }
	} catch (e) {
    	req.flash('error', e.message)
    	return res.redirect('back')
	}

	// write into database
	const comment = {
	    author: author,
	    postId: postId,
	    content: content
	}

	req.flash('success', 'Comment successfully')
	return res.redirect('back')
	// next(e)
})

// GET, /commnets/:commentId/remove
// pass
// do not have link
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
	const commentId = req.params.commentsId //get from url
	const author = req.session.name

	// delete comment from database
	try {
		// check permission and delete

		//if (!comment) {
		//	throw new Error('Comment not exists')
		//}
		//if (comment.author.toString() !== author.toString()) {
		//	throw new Error('Not have permission')
		//}
		
		req.flash('success', 'Delete successfully')
		return res.redirect('back')

	} catch (err) {
		// next(e)
	}
})


// export router for '/comments' 
module.exports = router