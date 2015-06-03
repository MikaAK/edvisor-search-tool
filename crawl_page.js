var cheerio = require('cheerio'),
    Promise = require('es6-promise').Promise,
    _       = require('lodash')

var isValidUrl = function(item) {
  var isJs = /^javascript:/.test(item)
  var isJSNull = /;;javascript/.test(item)
  var isHash = item && item[0] === '#'

  return !isJs && !isJSNull && !isHash
}

var isEmail = function(item) {
  return false // emailRegex.test(item)
}

var isRelative = function(item) {
  return !/^(http|https):|\/\/.*/.test(item)
}

module.exports = function(urlBase, html) {
  return new Promise(function(resolve, reject) {
    
    if (!html)
      resolve({email: [], link: []})

    var $ = cheerio.load(html),
        res = {
          email: [],
          link: []
        }

    $('a[href]').each(function() {
      var text = $(this).attr('href')

      if (isValidUrl(text))
        if (isRelative(text))
          res.link.push(urlBase + text)
        else
          res[isEmail(text) ? 'email' : 'link'].push(text)
    })

    $('a[href^="mailto"]').each(function() {
      var text = $(this).attr('href')

      res.email.push(text)
    })

    res.email = _.unique(res.email)
    res.link  = _.unique(res.link)

    return resolve(res)
  })
 }
