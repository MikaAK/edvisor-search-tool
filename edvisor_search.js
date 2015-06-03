var _         = require('lodash'),
    Promise   = require('es6-promise').Promise,
    extractor = require('./extractor_tool')


var dummyData = ['www.thecambiogroup.com/', 'www.queensu.ca', 'www.schoolsandagents.com']

var emails = []
var links = []

extractor(dummyData)
  .then(function(data) {
    emails = data.email
    links  = data.link

    return extractor(data.link)
  })
  .then(function(data) {
    emails = emails.concat(data.email)
    links = links.concat(data.link)

    console.warn(emails)
  })
  .catch(function(e) {
    console.log(e)
  })
