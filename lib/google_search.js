var _ = require('lodash'),
    google = require('google'),
    Promise = require('es6-promise').Promise

var totalPages = 1

google.resultsPerPage = 50

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

      if (++i < totalPages)
        next()
      else
        resolve(_.unique(results, 'link'))
    })
  })
}

module.exports = function(query) {
  return searchGoogle(query)
}

