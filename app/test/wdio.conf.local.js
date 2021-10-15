const merge = require('deepmerge')
const wdioConf = require('./wdio.conf.base.js')

const timeouts = 50000

exports.config = merge(wdioConf.config, {

  baseUrl: 'http://localhost:4004/webapp/index.html',
  filesToWatch: [
    // watch for all JS files in my app
    './webapp/**/*',
    './features/**/*',
    './test/**/*'
  ],
  logLevel: 'info',
  waitforTimeout: timeouts, // Default timeout for all waitFor* commands.
  connectionRetryTimeout: timeouts + 5000, // Default timeout in milliseconds for request  // if Selenium Grid doesn't send response
  // baseUrl: "http://localhost:8081/index.html?sap-ui-language=en&sap-ui-animationMode=none",
  capabilities: [{
    maxInstances: 1,
    browserName: 'chrome',
    'goog:chromeOptions': {
      // to run chrome headless the following flags are required
      // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
      args: ['--window-size=1930,1090']
    }
  }
  ],
  mochaOpts: {
    timeout: timeouts * 2
  }

})
