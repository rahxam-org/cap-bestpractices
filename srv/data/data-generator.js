// node
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const util = require('./data-generator-util')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const APPLICATION_DATA = []
module.exports = class {
  constructor () {
    this.parsing = util.readDirectory(path.resolve(__dirname, 'source'))
      .then(importData => {
        this.data = importData

        this.insertUuidv4Ids()
        this.transferText()
        this.uniquifyById()
      }, error => console.log(error))
  }

  transferText () {
    for (const [, values] of Object.entries(this.data)) {
    // for (const [key, values] of Object.entries(this.data)) {
      // const entityText = `${key}_texts`
      const texts = []
      values.forEach((entityLine) => {
        if (entityLine.texts) {
          entityLine.texts.forEach(text => {
            text.ID = entityLine.ID
            texts.push(text)
          })
          delete entityLine.texts
        }
      })

      // if (texts.length > 0) this.data[entityText] = texts
    }
  }

  uniquifyById () {
    for (const [key, values] of Object.entries(this.data)) {
      const uniqueEntries = values.reduce((accumulator, currentValue) => {
        if (accumulator[currentValue.ID]) {
          console.warn(` Entry (0) in ${key} overwritten by 1 because ID was not unique`)
          console.table([accumulator[currentValue.ID], currentValue])
        }
        accumulator[currentValue.ID] = currentValue
        return accumulator
      }, {})
      this.data[key] = Object.values(uniqueEntries)
    }
  }

  /**
   * set ID = null; in the JSON's to get them inserted on the fly
   */
  insertUuidv4Ids () {
    for (const [, values] of Object.entries(this.data)) {
      values.forEach((entityLine) => {
        if (entityLine.ID === null) {
          entityLine.ID = uuidv4()
        }
      })
    }
  }

  _writeCSV (obj, path) {
    const data = obj
    if (data.length > 0 && typeof data[0] !== 'undefined' && data[0] !== null) {
      const header = Object.keys(data[0]).map(o => { return { id: o, title: o } })

      const csvWriter = createCsvWriter({
        path: path,
        header: header
      })
      return csvWriter.writeRecords(data)
    }
  }

  async writeCSV () {
    await this.parsing

    const namespace = 'quadrio.cap.bestpractices'
    const dirData = path.resolve(__dirname, '..', '..', 'db', 'data')
    const dirCSV = path.resolve(__dirname, '..', '..', 'db', 'csv')
    util.emptyDirectory(dirData)
    util.emptyDirectory(dirCSV)

    for (const [key, value] of Object.entries(this.data)) {
      if (APPLICATION_DATA.includes(key)) {
        await this._writeCSV(value, path.join(dirCSV, `${namespace}-${key}.csv`))
      } else {
        await this._writeCSV(value, path.join(dirData, `${namespace}-${key}.csv`))
      }
    }

    return true
  }

  async injectIntoCDS (cds) {
    const neverChangedByTests = [] // # WARNING Entity might be changed, but so far doing this leads to errors
    await this.parsing

    const opsDel = []
    const opsInsert = []
    for (const [key, values] of Object.entries(this.data)) {
      if (!APPLICATION_DATA.includes(key) && !neverChangedByTests.includes(key)) {
        opsDel.push(DELETE.from(key))
        if (values.length > 0) {
          opsInsert.push(INSERT.into(key).entries(...values))
        }
      }
    }
    return cds.run(opsDel).then(() => cds.run(opsInsert))
  }
}
