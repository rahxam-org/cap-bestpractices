// const  BasePage require(re("../base/Page";
const BasePage = require('../base/Page')
const FiAddMonthEndClosingDialog = require('./FiAddMonthEndClosingDialog')
/**
 * sub page containing specific selectors and methods for a specific page
 */
module.exports = class extends BasePage {
  constructor () {
    super()
    this.viewId = 'adminFi'
    this.url = '/adminFi'
  }

  get addAddDialog () {
    if (!this.fiAddMonthEndClosingDialog) { this.fiAddMonthEndClosingDialog = new FiAddMonthEndClosingDialog(this) }
    return this.fiAddMonthEndClosingDialog
  }
}
