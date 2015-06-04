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

var getDomain = function(url) {
  return parseDomain(url).domain
}

var isSameDomain = function(base, url) {
  return _.includes(url, getDomain(base))
}

var isSameUrlPath = function(baseUrl, newUrl) {
  return _.includes(baseUrl, newUrl)
}

module.exports = function(urlBase, html) {
  return new Promise(function(resolve, reject) {
    if (!html)
      resolve({email: [], link: []})

    console.log('Processing Page: ', urlBase)

    var $ = cheerio.load(html),
        res = {
          email: extractEmails(html), 
          link: []
        }

    $('a[href]').each(function() {
      var text = $(this).attr('href')

      if (/mailto:/.test(text))
        res.email = res.email.concat(extractEmails(text))
      else if (isValidUrl(text))
        if (isSameDomain(urlBase, text)) {
          var url

          if (isRelative(text)) 
            if (!isSameUrlPath(urlBase, text))
              url = urlBase + text
          else
            url = text

          if (url)
            res.link.push(url)
        }
    })

    res.email = _.unique(res.email)
    res.link  = _(res.link).filter(isValidUrl).unique().value()

    console.log('Total Emails on Page: ', res.email.length)

    return resolve(res)
  })
 }
