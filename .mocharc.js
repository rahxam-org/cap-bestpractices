// https://mochajs.org/#command-line-usage
module.exports = {
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
      mochaFile: 'test-results.xml'
  },
  allowUncaught: false,
  checkLeaks: true,
  color: true,
  recursive: true,
  file: 'test/setup',
  spec: ['test/unit/', 'test/integration/'],
  exit: true,
  timeout: 10000,
  'full-trace': true
}
