
module.exports = function (app) {
    // run in order ?????
    app.get('/', function (req, res) {
        return res.redirect('/posts')
    })
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/posts', require('./posts'))
    app.use('/comments', require('./comments'))
    
    app.use(function (req, res) {
        if (!res.headersSent) {
            return res.status(404).render('404')
        }
    })
}
