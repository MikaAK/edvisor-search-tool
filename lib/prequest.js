var request = require('request'),
    _       = require('lodash')



request = request.defaults({
  pool: {
    maxSockets: Infinity
  }
})

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


module.exports = function(url) {
  var newUrl = addProtocol(url)
  
  console.warn('Requesting URL: ', newUrl)

  return new Promise(function(resolve, reject) {
    try {
      setTimeout(function() {
        request(newUrl, function(err, req, body) {
          if (err)
            resolve('')
          else
            resolve(body)
        })
      }, 100)
    } catch(e) {
      resolve('')
    }
  })
}
