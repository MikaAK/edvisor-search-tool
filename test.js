process.setMaxListeners(0)
require('./edvisor_search')('international school agency')
  .then(function(data) {
    console.log('Fetched Emails: ', data.emails.length)
    console.log('Fetched Links: ', data.links.length)
  })
