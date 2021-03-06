const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET, /signout, sign out
// pass
// session cannot be cleared
router.get('/', checkLogin, function (req, res, next) { // 2 callbacks(middlewares/components) cascade
	req.session.user = null // clear session ??? what session work ?
	req.flash('success', 'Log out successfully!') // how do it run? request flash???
	return res.redirect('/posts')
})


// export router for 'signout'
module.exports = router