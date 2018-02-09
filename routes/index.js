const signupRouter = require('./signup')
const signinRouter = require('./signin')
const signoutRouter = require('./signout')
const postsRouter = require('./posts')
const commentsRouter = require('./comments')


module.exports = function (app) {
    // run in order ?????
    app.use('/signup', signupRouter)
    app.use('/signin', signinRouter)
    app.use('/signout', signoutRouter)
    app.use('/posts', postsRouter)
    app.use('/comments', commentsRouter)
    
    app.use(function (req, res) {
        if (res.headersSent) {
            res.status(404).render('404')
        }
    })
}
