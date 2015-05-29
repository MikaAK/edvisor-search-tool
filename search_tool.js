var _ = require('lodash'),
    request = require('request'),
    Promise = require('es6-promise').Promise

var cx = '000976012178796896721:rw5dij0k0lu'
var key = 'AIzaSyCrqvT5sk80Xn1usAa7AgcsRTvfko1ff-o'

var googleURL = function(query, index) {
  if (isNaN(index))
    index = 1

  return 'https://www.googleapis.com/customsearch/v1?key=' + key + '&q=' + encodeURIComponent(query) + '&cx=' + cx + '&filter=1&num=10&start=' + (+index + 1)
}

var searchGoogle = function(query) {
  return new Promise(function(resolve, reject) {
    request(googleURL(query, i), function(err, resp, body) {
      if (err)
        return reject(err)

      var json = JSON.parse(body)

      if (json.spelling && json.spelling.correctedQuery)
        searchGoogle(json.spelling.correctedQuery)
          .then(resolve, reject)
      else
        resolve(json.items)
    })
  })
}

var promiseQue = []

for (var i = 1; i < 11; i++) 
  promiseQue.push(searchGoogle('mika kalathil', i))

modules.exports = Promise.all(promiseQue)
  .then(_.flatten)
  .then(function(data) {
    return data.map(function(item) {
      return {
        title: item.title,
        siteMap: item.displayLink
      }
    })
  })
