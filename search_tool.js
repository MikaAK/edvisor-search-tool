var _ = require('lodash'),
    google = require('google'),
    Promise = require('es6-promise').Promise

var totalPages = 4

google.resultsPerPage = 100

var searchGoogle = function(query) {
  return new Promise(function(resolve, reject) {
    var results = [],
        i       = 1

    google(query, function(err, next, res) {
      if (err)
        return reject(err)

      res.forEach(function(link) {
        if (link.href)
          results.push({
            title: link.title,
            link: link.href.match(/((http|https):\/\/.*\/)/)[1]
          })
      })

      if (++i > totalPages)
        next()
      else
        resolve(results)
    })
  })
}

module.exports = function(query) {
  var promiseQue = []

  for (var i = 1; i < 11; i++) 
    promiseQue.push(searchGoogle(query))

  return Promise.all(promiseQue)
    .then(function(data) {
      return _.unique(data, 'link')
    })
}

