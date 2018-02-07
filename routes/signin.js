const express = require('express')
const router = express.router()

const checkLogout = require('../middlewares/check').checkLogout

// GET, /signin, sign in
router.get('/', checkLogout, function (req, res, next) {

})

// POST, /signin, post signin info
router.post('/', checkLogout, function (req, res, next) {

})

// export router for 'signin'
module.exports = router