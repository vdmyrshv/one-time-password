const functions = require('firebase-functions')

const accountSid = functions.config().twilio.account_sid 
const token = functions.config().twilio.token

module.exports = require('twilio')(accountSid, token)

