var path = require('path')
var phantom = require('phantomjs-prebuilt')
var childprocess = require('child_process')

module.exports = function (host, port, route, options, callback) {
  function serveAndPrerenderRoute () {
    var maxAttempts = options.maxAttempts || 5
    var attemptsSoFar = 0

    var phantomArguments = [
      path.join(__dirname, 'phantom-page-render.js'),
      host + ':' + port + route,
      JSON.stringify(options)
    ]

    if (options.phantomOptions) {
      phantomArguments.unshift(options.phantomOptions)
    }

    function capturePage () {
      attemptsSoFar += 1
      childprocess.execFile(
        phantom.path,
        phantomArguments,
        function (error, stdout, stderr) {
          if (error || stderr) {
            // Retry if we haven't reached the max number of capture attempts
            if (attemptsSoFar <= maxAttempts) {
              return capturePage()
            } else {
              if (error) throw error
              if (stderr) throw stderr
            }
          }
          callback(stdout)
        }
      )
    }

    capturePage()
  }
  serveAndPrerenderRoute()
}
