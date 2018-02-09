const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET, /signin, sign in
// pass
router.get('/', checkNotLogin, function (req, res, next) {
	res.render('signin')
})

// POST, /signin, post signin info
// pass
// flash does not work, when signing in unsuccessfully
router.post('/', checkNotLogin, function (req, res, next) {
	const name = req.fields.name // formidable fields???
	const password = req.fields.password

	console.log('------------------------' + name + '-' + password)
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

	let user = {
		name: 'proverbs',
		password: 'proverbs',
		gender: 'm',
		bio: 'bio',
		avatar: 'avatar'
	}

	// query the database and check if username and password are correct
	/*query..., user now is the return value*/
	if (name.toString() !== user.name.toString()) {
		req.flash('User not exists.')
		return res.redirect('back')
	} else {
		if (password.toString() === user.password.toString()) {
			req.flash('success', 'Login Successfully.')
			// writer session ???
			req.session.user = {name: user.name}
			return res.redirect('/posts')
		} else {
			req.flash('error', 'Wrong Username or Password')
			return res.redirect('back')
		}
	}

	// next(e)?????? error next()
})



// export router for 'signin'
module.exports = router