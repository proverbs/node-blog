const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET, /signout, sign out
// pass
// session cannot be cleared
router.get('/', checkNotLogin, function (req, res, next) { // 2 callbacks(middlewares/components) cascade
	req.session.user = null // clear session ??? what session work ?
	req.flash('success', 'Log out successfully!') // how do it run? request flash???
	return res.redirect('/posts')
})


// export router for 'signout'
module.exports = router