const express = require('express')
const router = express.router()
const sha1 = require('sha1')
const path = require('path')
const fs = require('fs')

const UserModel = require('../models/users')
const checkLogout = require('../middlewares/check').checkLogout

// GET, /signup, sign up
router.get('/', checkLogout, function (req, res, next) {
	res.render('signup')
})

// POST, /signup, post info of a new user
router.get('/', checkLogout, function (req, res, next) {
	const name = req.fields.name
	const gender = req.fields.gender
	const bio = req.fields.bio
	const avatar = req.fields.avatar.path.split(path.sep).pop() // ????
	let password = req.fields.password // difference between let and var
	const repassword = req.fields.repassword

	try {
		if (name.length < 1 || name.length > 10) {
			throw new Error('Username should be no more than 10 characters')
		} 
		if (['m', 'f', 'x'].indexOf(gender) === -1) {
			throw new Error('Gender should be MALE, FEMALE or Secret')
		}
		if (bio.length < 1 || bio.length > 30) {
			throw new Error('Bio should be no more than 30 characters')		
		}
		if (!req.fields.avatar.name) {
			throw new Error('Please upload an avatar')
		}
		if (password.length < 6 || password.length > 18) {
			throw new Error('Password should be no less than 6 characters and no more than 18 characters')
		}
		if (password !== repassword) {
			throw new Error('Passwords not same')
		}
	} catch (err) {
		// delete avatar async
		fs.unlink(req.files.avatar.path) // ???
		req.flash('error', err.message)
		return res.redirect('/singup')
	}

	password = sha1(password)
	let user = {
		name: name,
		password: password,
		gender: gender,
		bio: bio,
		avatar: avatar
	}

	UserModel.create(user).then(function (result) {
		user = result.ops[0] // ???
		delete user.password
		req.session.user = user
		req.flash('success', 'Sign up successfully')
		res.redirect('/posts')
	}).catch(function (e) {
		if (e.message.match('duplicate key')) {
			// string match
			req.flash('error', 'Username exists')
			return req.redirect('/signup')
		}
		next(e) // ???????
	})
})

// export router for '/signup'
module.exports = router