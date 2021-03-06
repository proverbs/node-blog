const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const checkNotLogin = require('../middlewares/check').checkNotLogin


// GET, /signup, sign up
// pass
router.get('/', checkNotLogin, function (req, res, next) {
	res.render('signup')
})

// POST, /signup, post info of a new user
// pass
// link not deleted
router.post('/', checkNotLogin, function (req, res, next) {
	const name = req.fields.name
	const gender = req.fields.gender
	const bio = req.fields.bio
	const avatar = req.files.avatar.path.split(path.sep).pop() // ????
	let password = req.fields.password // difference between let and var
	const repassword = req.fields.repassword

	console.log('---------------' + name + '-' + gender + '-' + bio + '-' + avatar + '-' + password)
	
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
		if (!req.files.avatar.name) {
			throw new Error('Please upload an avatar')
		}
		if (password.length < 4 || password.length > 18) {
			throw new Error('Password should be no less than 6 characters and no more than 18 characters')
		}
		if (password !== repassword) {
			throw new Error('Passwords not same')
		}
	} catch (err) {
		// delete avatar async
		fs.unlink(req.files.avatar.path) // ???
		req.flash('error', err.message)
		return res.redirect('/signup')
	}
	

	let user = {
		name: name,
		password: password,
		gender: gender,
		bio: bio,
		avatar: avatar
	}

	// write into database and check if the username exists
	fs.readFile('users.json', 'utf-8', function (err, allUsers) {
		if (!err) {
			allUsers = JSON.parse(allUsers)
			for (let i = 0; i < allUsers.length; i ++) {
				if (allUsers.name === name) {
					req.flash('error', 'Username exists')
					return res.redirect('back')
				}
			}
			allUsers.push(user)
			fs.writeFile('users.json', JSON.stringify(allUsers), function (err) {
				if (!err) {
					req.session.user = {name: user.name}
					req.flash('success', 'Sign up successfully')
					return res.redirect('/posts')
				} else {
					next(err)
				}
			})

		} else {
			next(err)
		}
	})
})


// export router for '/signup'
module.exports = router