const config = require('config-lite')(__dirname) // __dirname is the path of entance code??
const Mongolass = require('mongolass') // ??
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')


const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
})

