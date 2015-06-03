var request = require('request'),
    _       = require('lodash'),
    Promise = require('es6-promise').Promise,
    util    = require('util'),
    crawl_page = require('./crawl_page')



var pRequest = function(url) {
  var newUrl = addProtocol(url)
  
  console.warn('Requesting URL: ', newUrl)

  return new Promise(function(resolve, reject) {
    try {
      request(newUrl, function(err, req, body) {
        if (err)
          resolve('')
        else
          resolve(body)
      })
    } catch(e) {
      resolve('')
    }
  })
}

var addProtocol = function(url) {
  var hasProtocol    = /(http|https):\/\/.*/.test(url)
  var isAutoProtocol = _.startsWith(url, '//')

  if (hasProtocol)
    return url
  else if (isAutoProtocol)
    return 'http:' + url
  else
    return 'http://' + url
}

var requestDefault = function(item) {
  return pRequest(item)
    .then(function(html) {
      var promise = crawl_page(item, html)

      return promise
    })
}

module.exports = function(urls) {
  var promiseQue = []

  urls.forEach(function(item) {
    promiseQue.push(requestDefault(item))
  })


  return Promise.all(promiseQue)
    .then(function(items) {
      var newItems = {}

      items.forEach(function(item) {
        _.merge(newItems, item)
      })


      return newItems
    })
}
