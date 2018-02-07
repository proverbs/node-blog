const express = require('express')
const router = express.router()

const checkLogout = require('../middlewares/check').checkLogout

// GET, /signup, sign up
router.get('/', checkLogout, function (req, res, next) {

})

// POST, /signup, post info of a new user
router.get('/', checkLogout, function (req, res, next) {

})

// export router for '/signup'
module.exports = router