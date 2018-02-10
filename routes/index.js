
module.exports = function (app) {
    // following middlewares will run in order
    app.get('/', function (req, res) {
        return res.redirect('/posts')
    })
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/posts', require('./posts'))
    app.use('/comments', require('./comments'))
    
    app.use(function (req, res, next) {
        if (!res.headersSent) {
            res.status(404).render('404')
            next(new Error('404 NOT FOUND'))
            // next can only throw error
            // more: https://expressjs.com/en/guide/error-handling.html
        }
    })
}
