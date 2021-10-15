/* eslint-disable no-undef */
const merge = require('deepmerge')
// const allure = require("allure-commandline");

const wdioConf = require('./wdio.conf.base.js')

exports.config = merge(wdioConf.config, {
  capabilities: [{
    maxInstances: 1,
    browserName: 'chrome',
    'goog:chromeOptions': {
      // to run chrome headless the following flags are required
      // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
      // https://peter.sh/experiments/chromium-command-line-switches/
      args: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1930,1090']
    }
  }
  ],
  mochaOpts: {
    retries: 1
  }

})
