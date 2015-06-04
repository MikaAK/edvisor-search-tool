#!/usr/bin/env node

var cli    = require('cli'),
    search = require('./lib/edvisor_search'),
    fs     = require('fs')

cli.parse({
  pages: ['p', 'Number of pages to google', 'number', 1]
})

cli.main(function(args, opts) {
  if (!args.length)
    cli.fatal("You must provide a search query")

  search(args[0], opts.pages)
    .then(function(data) {
      cli.info('Fetched Emails: ' + data.emails.length)
      cli.info('Fetched Links: '  + data.links.length)

      return data.emails
    })
    .then(function(emails) {
      var file = fs.createWriteStream('emails.csv')

      file.write('Email\n')

      emails.forEach(function(email) {
        file.write(email + '\n')
      })

      file.end()
    })
    .then(function() {
      cli.ok('Finished Writing To File')
    })
    .catch(function(e) {
      cli.fatal(e)
    })
})
