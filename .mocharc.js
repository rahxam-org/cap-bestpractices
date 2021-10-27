// https://mochajs.org/#command-line-usage
module.exports = {
    reporter: "mocha-github-actions-reporter",
    reporterOptions: {
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
