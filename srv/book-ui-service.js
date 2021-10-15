const cds = require('@sap/cds')
const helper = require('./common/helper')

module.exports = async function () {
  const db = await cds.connect.to('db') // connect to database service

  this.on('READ', 'Books', readBooks)
  this.on('DELETE', 'Books', helper.reject)

  async function readBooks (req) {
    const tx = await db.transaction(req) // attach to request transaction
    const dbEntries = await tx.run(SELECT.from('Books'))
    return dbEntries
  }
}
