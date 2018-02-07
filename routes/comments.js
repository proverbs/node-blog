const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// POST, /comments, add a comment(cannot visit directly)
router.post('/', checkLogin, function (req, res, next) {

})

// GET, /commnets/:commentId/remove
rotuer.get('/:commentId/remove', checkLogin, function (req, res, next) {

})

// export router for '/comments' 
module.exports = router