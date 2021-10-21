const cds = require('@sap/cds')
const helper = require('./common/helper')
const LOG = cds.log('book-ui-service')

module.exports = async function () {
  const authorService = await cds.connect.to('API_AUTHORS')

  this.before('READ', 'Books', beforeReadBooks)
  this.on('READ', 'Authors', onReadAuthors)
  this.on('DELETE', 'Books', helper.reject)

  async function beforeReadBooks (req) {
    LOG.debug('NICE')
  }

  async function onReadAuthors (req) {
    const tx = await authorService.transaction(req) // attach to request transaction
    const dbEntries = await tx.run(SELECT.from('Authors'))
    return dbEntries
  }
}
