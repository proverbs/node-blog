const express = require('express')
const router = express.router()

const checkLogin = require('../middlewares/check').checkLogin

// GET, /signout, sign out
router.get('/', checkLogin, function (req, res, next) {
	req.session.user = null // clear session ??? what session work ?
	req.flash('success', 'Log out successfully!') // how do it run?
	req.redirect('/posts')
})


// export router for 'signout'
module.exports = router