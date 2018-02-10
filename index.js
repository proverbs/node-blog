const path = require('path')
const express = require('express')
const pkg = require('./package') // ./package.json
const routes = require('./routes') // routes/index.js, app.use to bind urls and route handlers

const formidable = require('express-formidable')
const cookieParser = require('cookie-parser')

const session = require('express-session') // ??
const config = require('config-lite')(__dirname) //?? open __dirname/config/
const flash = require('connect-flash') //??


const app = express()
app.set('views', path.join(__dirname, 'views')) // views dir
app.set('view engine', 'ejs') // view engine

app.use(express.static(path.join(__dirname, 'public'))) // static dir

/*--------------------------for learning---------------------------------------*/
// use file as substitute to MongoDB
/*
const fs = require('fs')

var tposts = [
    {
        author: 'proverbs',
        title: 'title-1',
        content: 'post-content-1',
        _id: 'post-id-1'
    },

    {
        author: 'xuhao',
        title: 'title-2',
        content: 'post-content-2',
        _id: 'post-id-2'
    },
    
    {
        author: 'proverbs',
        title: 'title-3',
        content: 'post-content-3',
        _id: 'post-id-3'
    }
]
fs.writeFile('posts.json', JSON.stringify(tposts), function (err) {
    if (!err) {
        console.log('Posts saved successfully')
    }
    else {
        console.log('Posts saved ERROR')
        throw err
    }
})


var tcomments = [
    {
        author: 'xuhao',
        postId: 'post-id-1',
        content: 'comment-content-1',
        _id: 'post-id-1'
    },

    {
        author: 'proverbs',
        postId: 'post-id-2',
        content: 'comment-content-2',
        _id: 'post-id-2'
    }
]
fs.writeFile('comments.json', JSON.stringify(tcomments), function (err) {
    if (!err) {
        console.log('Comments saved successfully')
    }
    else {
        console.log('Comments saved ERROR')
        throw err
    }
})

var tusers = [
    {
        name: 'proverbs',
        password: 'proverbs',
        gender: 'm',
        bio: 'bio-proverbs',
        avatar: 'google.png',
        _id: 'user-id-1'
    },

    {
        name: 'xuhao',
        password: 'xuhao',
        gender: 'f',
        bio: 'bio-xuhao',
        avatar: 'liming.png',
        _id: 'user-id-2'
    }
]
fs.writeFile('users.json', JSON.stringify(tusers), function (err) {
    if (!err) {
        console.log('Users saved successfully')
    } else {
        console.log('Users saved ERROR')
        throw err
    }
})
*/
/*---------------------------for learning------------------------------------------------*/

// set locals(global variables of app) for ejs engine
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
}

// flash need cookie-parser
app.use(cookieParser('secret'))

// add session, next()??
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    cookie: {
        maxAge: config.session.maxAge
    }
}))

// add flash, next()???
app.use(flash())

// add form handler, next()????
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

// add routers, next() ???
routes(app)


// add error handler, print error using flash
// params cannot be customized, more: https://expressjs.com/en/guide/error-handling.html
app.use(function (err, req, res, next) {
    console.log('---------------------INDEX ERROR---------------------' + err.error)
    console.error(err)
    req.flash('error', err.message)
    res.redirect('/posts')
})

// main
if (require.main == module) {
    // run directly
    app.listen(config.port, function () {
        console.log(`${pkg.name} listening on port ${config.port}`)
    })
} else {
    // called by others
    module.exports = app
}

