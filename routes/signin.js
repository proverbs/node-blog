const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin
const fs = require('fs')

// GET, /signin, sign in
// pass
router.get('/', checkNotLogin, function (req, res, next) {
	res.render('signin')
})

// POST, /signin, post signin info
// pass
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
	} catch (err) {
		req.flash('error', err.message)
		return res.redirect('back') // return???
	}

	// query the database and check if username and password are correct
	fs.readFile('users.json', 'utf-8', function (err, allUsers) {
		if (!err) {
			var fg = 0
			allUsers = JSON.parse(allUsers)
			for (let i = 0; i < allUsers.length; i ++) {
				if (allUsers[i].name == name && allUsers[i].password == password) {
					req.flash('success', 'Login Successfully.')
					req.session.user = allUsers[i]
					return res.redirect('/posts')
				} else {
					try {	
						req.flash('error', 'User or Password not correct.')
						return res.redirect('back')
					} catch (err) {
						next(err)
					}
				}
			}
		} else {
			next(err)
		}
	})
})


// export router for 'signin'
module.exports = router