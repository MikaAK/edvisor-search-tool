var _          = require('lodash'),
    Promise    = require('es6-promise').Promise,
    util       = require('util'),
    crawl_page = require('./crawl_page')
    pRequest   = require('./prequest')


var requestLimit = 15

var requestDefault = function(item) {
  return pRequest(item)
    .then(function(html) {
      return crawl_page(item, html)
    })
}

var newItems = {
  email: [],
  link: []
}

var request = function(urls) {
  if (!_.isArray(urls) && typeof urls === 'object')
    return urls

  var urlsUnderLimit = urls.length < requestLimit

  console.log('\n')
  console.log('Request Stats')
  console.log('=============')
  console.log('Collected emails: ', newItems.email.length)
  console.log('Collected links: ',  newItems.link.length)
  console.log('Amount of URL\'s: ', urls.length)
  console.log('\n')

  if (urlsUnderLimit)
    debugger

  var promiseQueue = [],
      urlChunk = urls.splice(0, urlsUnderLimit ? urls.length : requestLimit)

  
  urlChunk.forEach(function(link) {
    promiseQueue.push(requestDefault(link))
  })

  return Promise.all(promiseQueue)
    .then(function(items) {
      console.log('\n')
      console.log('Requests Finished')
      console.log('=================')
      console.log('\n')

      items.forEach(function(item) {
        _.merge(newItems, item)
      })

      return urls.length ? request(urls) : newItems
    })
}

module.exports = request
