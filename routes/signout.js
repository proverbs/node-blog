const express = require('express')
const router = express.router()

const checkLogin = require('../middlewares/check').checkLogin

// GET, /signout, sign out
router.get('/', checkLogin, function (req, res, next) {
	
})


// export router for 'signout'
module.exports = router