#!/usr/bin/env node

var cli = require('cli'),
    search = require('./edvisor_search')

cli.main(function(args, opts) {
  if (!args.length)
    cli.fatal("You must provide a search query")

  search(args[0])
    .then(function(data) {
      console.log('In then', data)
      cli.info('Fetched Emails: ' + data.emails.length)
      cli.info('Fetched Links: '  + data.links.length)

      return data.emails
    })
    .then(function(emails) {
      cli.ok('Complete')
      console.log(emails)
    })
    .catch(function(e) {
      cli.fatal(e)
    })
})
