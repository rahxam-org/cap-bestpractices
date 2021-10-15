const cds = require('@sap/cds')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

// handle bootstrapping events...
cds.on('bootstrap', (app) => {
  // Improve App Security
  app.use(helmet())
  app.use(cookieParser())
  // If you do not use an approuter register csurf to handle CSRF protection

  // anonymous ping service (https://cap.cloud.sap/docs/node.js/best-practices#anonymous-ping)
  app.get('/health', (_, res) => {
    res.status(200).send('OK')
  })
})

// add more middleware after all CDS servies
// cds.on('served', () => {
// })
// delegate to default server.js:

module.exports = cds.server
