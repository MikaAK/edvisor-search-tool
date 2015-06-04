var _           = require('lodash'),
    Promise     = require('es6-promise').Promise,
    requestor   = require('./requestor'),
    search_tool = require('./google_search'),
    collector   = require('./collector')

module.exports = function(query, totalPages) {
  var emails = []
  var links = []

  return search_tool(query, totalPages)
    .then(function(res) {
      return requestor(_.pluck(res, 'link'))
    })
    .then(function(data) {
      console.log('Finished first set')
      emails = data.email
      links  = data.link
      console.log("Fetched Emails: ", emails.length)

      return requestor(links)
    })
    .then(function(data) {
      console.log('Second Set Finished')
      console.log('Fetched Emails Collector: ', collector.email.length)
      emails = emails.concat(data.email)
      links = links.concat(data.link)
      console.log('Fetched Emails : ', data.email.length)

      return {
        emails: _.unique(emails), 
        links: _.unique(links)
      }
    })
    .catch(function(e) {
      console.log(e)
    })
}
