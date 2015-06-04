var _          = require('lodash'),
    Promise    = require('es6-promise').Promise,
    util       = require('util'),
    crawl_page = require('./crawl_page')
    pRequest   = require('./prequest'),
    collector  = require('./collector.js')


var requestLimit = 15

var requestDefault = function(item) {
  return pRequest(item)
    .then(function(html) {
      return crawl_page(item, html)
    })
}

var request = function(urls) {
  if (!_.isArray(urls) && typeof urls === 'object')
    return urls

  var urlsUnderLimit = urls.length < requestLimit

  console.log('\n')
  console.log('Request Stats')
  console.log('=============')
  console.log('Collected emails: ', collector.email.length)
  console.log('Amount of URL\'s to Process: ', urls.length)
  console.log('\n')

  var promiseQueue = [],
      urlChunk = urls.splice(0, urlsUnderLimit ? urls.length : requestLimit)

  
  urlChunk.forEach(function(link) {
    promiseQueue.push(requestDefault(link))
  })

  return Promise.all(promiseQueue)
    .then(function(items) {
      var emailTotal = 0
      
      items.forEach(function(item) {
        collector.link  = collector.link.concat(item.link)
        collector.email = collector.email.concat(item.email)
        emailTotal += item.email.length
      })

      console.log('=================')
      console.log('Chunk Finished')
      console.log('Collected ' + emailTotal + ' Emails')
      console.log('=================')

      return urls.length ? request(urls) : collector 
    })
}

module.exports = request
