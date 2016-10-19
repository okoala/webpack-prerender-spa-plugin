var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var childprocess = require('child_process')
var compileToHTML = require('./lib/compile-to-html')

function HtmlPrecompiler (options) {
  this.dist = options.dist
  this.entry = options.entry
  this.host = options.host
  this.port = options.port
  this.routes = options.routes
  this.options = options.options || {}
}

HtmlPrecompiler.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('emit', function (compilation, done) {
    var server = childprocess.fork(self.entry, {env: {NODE_ENV: process.env.NODE_ENV || 'production'}})
    var successCount = 0

    server.on('error', err => {
      console.error(err)
    })

    setTimeout(function () {
      self.routes.forEach(function (route) {
        compileToHTML(self.host, self.port, route, self.options, function (prerenderedHTML) {
          var folder = path.join(self.dist, route)
          mkdirp(folder, function (error) {
            if (error) throw error
            fs.writeFile(
              path.join(folder, 'index.html'),
              prerenderedHTML,
              function (error) {
                if (error) throw error
                successCount++
                if (successCount === self.routes.length) {
                  server.kill()
                }
              }
            )
          })
        })
      })
    }, 10000)

    done()
  })
}

module.exports = HtmlPrecompiler
