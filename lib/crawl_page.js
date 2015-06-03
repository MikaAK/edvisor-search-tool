var cheerio = require('cheerio'),
    Promise = require('es6-promise').Promise,
    _       = require('lodash'),
    extractEmails = require('./email_extractor'),
    parseDomain = require("parse-domain")

var isValidUrl = function(item) {
  var isJs = /^javascript:/.test(item)
  var isJSNull = /;;javascript/.test(item)
  var isHash = item && item[0] === '#'
  var isTel = /^tel:/.test(item)
  var isPhotoExt = /\.(png|gif|jpeg|jpg|tiff|bmp|rif|webp|svg)$/.test(item)

  return !(isJs || isJSNull || isHash || isTel || isPhotoExt)
}

var isRelative = function(item) {
  return !/^(http|https):|\/\/.*/.test(item)
}

var isSameDomain = function(base, url) {
  var domain = parseDomain(base).domain

  return _.includes(url, parseDomain(base).domain)
}

module.exports = function(urlBase, html) {
  return new Promise(function(resolve, reject) {
    if (!html)
      resolve({email: [], link: []})

    var $ = cheerio.load(html),
        res = {
          email: extractEmails(html), 
          link: []
        }

    $('a[href]').each(function() {
      var text = $(this).attr('href')

      if (/mailto:/.test(text))
        res.email = res.email.concat(extractEmails(text))
      else if (isValidUrl(text)) {
        var url = isRelative(text) ? urlBase + text : text

        if (isSameDomain(urlBase, url))
         res.link.push(url)
      }
    })

    res.email = _.unique(res.email)
    res.link  = _.unique(res.link)

    return resolve(res)
  })
 }
