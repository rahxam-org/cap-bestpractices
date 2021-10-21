const BasePage = require('../base/Page')
/**
 * sub page containing specific selectors and methods for a specific page
 */
module.exports = class extends BasePage {
  constructor () {
    super()
    this.viewId = 'container-bestpractices-ui---worklist'
    this.url = '/'
  }
}
