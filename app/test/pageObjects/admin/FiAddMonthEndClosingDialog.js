const BasePage = require('../base/Page')

/**
 * sub page containing specific selectors and methods for a specific page
 */
module.exports = class extends BasePage {
  constructor (caller) {
    super()
    this.caller = caller
  }

  get view () { return $('*[id$="wizardDialog"]') }
  get addWLineDialogButton () { return this.caller.view.$('*[id$="addNewLineButton"]') }

  open () {
    const elem = this.addWLineDialogButton
    elem.waitForClickable()
    elem.click()

    expect(this.view).toBeDisplayed()

    return this
  }

  fillTimeRange (value) {
    this.fill({ i18nLabel: 'common.timerange', value })
  }

  pressRows (rows) {
    for (const element of rows) {
      const row = this.view.$(`//tbody/tr[contains(@class,'sapMListTblRow') and descendant-or-self::*[contains(text(),'${element.contains}') ] ]`)
      row.waitForClickable()
      row.click()
    }
  }

  pressNext (value) {
    this.pressButton({ i18n: 'common.next' })
  }

  pressCreate (value) {
    this.pressButton({ i18n: 'common.create' })
  }
}
