## Usage


### webpack config

```javascript
var path = require('path')
var PrerenderPlugin = require('webpack-prerender-spa-plugin')

module.exports = {
  // ...
  plugins: [
    new PrerenderPlugin({
      // (REQUIRED) Absolute path to static root
      dist: path.resolve(__dirname, '../dist'),

      // (REQUIRED) server entry
      entry: path.resolve(__dirname, '../index'),

      // (REQUIRED) server host
      host: 'http://127.0.0.1',

      // (REQUIRED) server port
      port: 7000,

      // (REQUIRED) List of routes to prerender
      routes: ['/login'],

      // (OPTIONAL) Options
      options: {
        // NOTE: Unless you are relying on asynchronously rendered content,
        // such as after an Ajax request, none of these options should be
        // necessary. All synchronous scripts are already executed before
        // capturing the page content.

        // Wait until a specific event is fired on the document.
        captureAfterDocumentEvent: 'custom-post-render-event',

        // This is how you would trigger this example event:
        // document.dispatchEvent(new Event('custom-post-render-event'))

        // Wait until a specific element is detected with
        // document.querySelector.
        captureAfterElementExists: '#content',

        // Wait until a number of milliseconds has passed after scripts
        // have been executed. It's important to note that this may
        // produce unreliable results when relying on network
        // communication or other operations with highly variable timing.
        captureAfterTime: 5000,

        // NOTE: You can even combine strategies if you like. For example,
        // if you only _sometimes_ want to wait for an event to fire, you
        // can create a timeout by combining captureAfterTime with
        // captureAfterDocumentEvent. When combining strategies, page
        // content will be captured after the first triggered strategy.

        // Because PhantomJS occasionally runs into an intermittent issue,
        // we will retry a page capture up to 5 times by default. You may
        // raise or lower this limit if you wish.
        maxAttempts: 10,

        // Prevent PhantomJS from navigating away from the URL passed to it
        // and prevent loading embedded iframes (e.g. Disqus and Soundcloud
        // embeds), which are not ideal for SEO and may introduce JS errors.
        navigationLocked: true,

        // The options below expose configuration options for PhantomJS,
        // for the rare case that you need special settings for specific
        // systems or applications.

        // http://phantomjs.org/api/command-line.html#command-line-options
        phantomOptions: '--disk-cache=true',

        // http://phantomjs.org/api/webpage/property/settings.html
        phantomPageSettings: {
          loadImages: true
        }
      }
    })
  ]
}
```
