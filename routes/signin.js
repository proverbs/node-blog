const express = require('express')
const router = express.router()
const sha1 = require('sha1')

const UserModel = require('../models/users')
const checkLogout = require('../middlewares/check').checkLogout

// GET, /signin, sign in
router.get('/', checkLogout, function (req, res, next) {
	res.render('signin')
})

// POST, /signin, post signin info
router.post('/', checkLogout, function (req, res, next) {
	const name = req.fields.name // formidable fields???
	const password = req.fields.password

	// check params
	try {
		if (!name.length) {
			throw new Error('Please input username.')
		} 
		if (!password.length) {
			throw new Error('Please input password.')
		}
	} catch (e) {
		req.flash('error', e.message)
		return res.redirect('back') // return???
	}

	// UserModel return the instance of user, then run the anoneymous func
	UserModel.getUserByName(name).then(function (user) {
		if (!user) {
			req.flash('user not exists.')
			return res.redirect('back')
		} else {
			if (sha1(password) === user.password) {
				req.flash('success', 'Login Successfully.')
				// writer session ???
				delete user.password
				req.session.user = user
				res.redirect('/posts')
			} else {
				req.flash('error', 'Wrong Username or Password')
				return res.redirect('back')
			}
		}
	}).catch(next) // mongo????
})

// export router for 'signin'
module.exports = router