var request = require('request'),
    _       = require('lodash'),
    Promise = require('es6-priomise').Promise

var dummyData = _.unique(["ca.linkedin.com/", "pastebin.com/", "www.npmjs.com/", "pastebin.com/", "angel.co/", "www.tomsguide.com/", "angel.co/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "pastebin.com/", "www.npmjs.com/", "pastebin.com/", "angel.co/", "www.tomsguide.com/", "angel.co/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.npmjs.com/", "pastebin.com/", "angel.co/", "www.tomsguide.com/", "angel.co/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "pastebin.com/", "angel.co/", "www.tomsguide.com/", "angel.co/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "www.networkinginvan.com/", "angel.co/", "www.tomsguide.com/", "angel.co/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "www.networkinginvan.com/", "stackoverflow.com/", "www.tomsguide.com/", "angel.co/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "www.networkinginvan.com/", "stackoverflow.com/", "www.sanskrittranslations.com/", "angel.co/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "www.networkinginvan.com/", "stackoverflow.com/", "www.sanskrittranslations.com/", "www.f6s.com/", "www.linkedin.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "www.networkinginvan.com/", "stackoverflow.com/", "www.sanskrittranslations.com/", "www.f6s.com/", "www.tamilcnnlk.com/", "www.tomsguide.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "www.networkinginvan.com/", "stackoverflow.com/", "www.sanskrittranslations.com/", "www.f6s.com/", "www.tamilcnnlk.com/", "www.koodal.com/", "github.com/", "www.tomshardware.com/", "www.programmableweb.com/", "www.networkinginvan.com/", "stackoverflow.com/", "www.sanskrittranslations.com/", "www.f6s.com/", "www.tamilcnnlk.com/", "www.koodal.com/", "blogs.rsc.org/"])

var promiseQue = []

var parseEmails = function(itemList) {

}

var requestDefault = function(item) {
  return new Promise(function(resolve, reject) {
    request(item, function(err, res, body) {
      if (err)
        reject()
      else
        resolve(body)
    })    
  })
}

var requestSitemap = function(item) {
  return new Promise(function(resolve, reject) {
    request(item + 'sitemap.xml', function(err, res, body) {
      if (err)
        requestDefault(item)
          .then(function(data) {
            resolve(parseEmails(data))
          }, reject)
      else
        resolve(parseEmails(body))
    })  
  })
}

dummyData.forEach(function(item) {
  promiseQue.push(requestSitemap(item))
})

Promise.all(promiseQue)
  .then(function(items) {
    debugger
  })
