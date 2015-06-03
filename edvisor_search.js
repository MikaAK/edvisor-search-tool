var _           = require('lodash'),
    Promise     = require('es6-promise').Promise,
    requestor   = require('./requestor'),
    search_tool = require('./google_search')

module.exports = function(query) {
  var emails = []
  var links = []

  return search_tool(query)
    .then(function(res) {
      return requestor(_.pluck(res, 'link'))
    })
    .then(function(data) {
      console.log('Finished first set')
      emails = data.email
      links  = data.link
      console.log("Fetched Links: ", links.length)

      return requestor(links)
    })
    .then(function(data) {
      emails = emails.concat(data.email)
      links = links.concat(data.link)

      return {
        emails: _.unique(emails), 
        links: _.unique(links)
      }
    })
    .catch(function(e) {
      console.log(e)
    })
}
