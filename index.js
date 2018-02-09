const path = require('path')
const express = require('express')
const pkg = require('./package') // package.json
const routes = require('./routes') // routes/index.js, app.use to bind urls and route handlers

const formidable = require('express-formidable')

const session = require('express-session') // ??
const config = require('config-lite')(__dirname) //?? open __dirname/config/
const MongoStore = require('connect-mongo')(session) //?? use express-session
const flash = require('connect-flash') //??


const app = express()
app.set('views', path.join(__dirname, 'views')) // views dir
app.set('view engine', 'ejs') // view engine

app.set('static', express.static(path.join(__dirname, 'public'))) // static dir


// set locals(global variable of app) for ejs engine
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
}



// add session(with mongodb)
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    cookie: {
        maxAge: config.session.maxAge
    }
}))

app.use(flash())

app.use(formidable({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true
}))

// add middleware: set response locals(local variable of response/render)
app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})


routes(app)


// print error using flash
app.use(function (err, req, res, next) {
    console.error(err)
    req.flash('error', err.message)
    res.redirect('/posts')
})

if (require.main == module) {
    // run directly
    app.listen(config.port, function () {
        console.log(`${pkg.name} listening on port ${config.port}`)
    })
} else {
    // called by others
    module.exports = app
}

