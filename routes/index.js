const signupRouter = require('./signup')
const signinRouter = require('./signin')
const signoutRouter = require('./signout')
const postsRouter = require('./posts')
const commentsRouter = require('./comments')


modules.exports = function (app) {
    // run in order ?????
    app.get('/', function (req, res) {
        res.redirect('/post')
    })
    app.use('/signup', signupRouter)
    app.use('/signin', signinRouter)
    app.use('/signout', signoutRouter)
    app.use('/posts', postRouter)
    app.use('/comments', commentsRouter)
    
    app.use(function (req, res) {
        if (res.headersSent) {
            res.status(404).render('404')
        }
    })
}
