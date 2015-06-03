var _ = require('lodash')

var blacklist = [
  'email.com',
  'example.com'
]

var isBlacklisted = function(link) {
  var isBlackList = false

  for (var i = 0, k = blacklist.length - 1; i <= k; k--)
    if (new RegExp(blacklist[k] + '$').test(link)) {
      isBlackList = true
      break
    }

  return isBlackList         
}

var removeMailTo = function(link) {
  return _.startsWith(link, 'mailto:') ? link.slice(6, link.length) : link
}

module.exports = function(html) {
  var match  = html.match(/\b(([^ \W]|\.)+@[^ ]+\.[^ \W]{0,5})\b/g) || [],
      result = []

  match.forEach(function(res) {
    if (!isBlacklisted(res))
      result.push(removeMailTo(res))
  })

  return result
}
