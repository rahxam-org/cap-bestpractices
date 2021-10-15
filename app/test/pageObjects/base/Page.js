const fs = require('fs')
const path = require('path')

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
module.exports = class {
  /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
  open (url, param) {
    browser.pause(1000)
    browser.url(`#${this.url || url || ''}`)

    const view = this.view
    view.waitForExist()

    if (param && param.donNotWaitForData) {
      // TODO: cleanup
    } else {
      view.$('tbody > tr.sapMLIB-CTX').waitForExist()
    }
  }

  get view () {
    // const v = $(`div[id$="${this.viewId}"]`);
    // v.waitForDisplayed();
    return $(`div[id$="${this.viewId}"]`)
  }

  i18n (key) {
    if (!this._i18n) {
      const data = fs.readFileSync(path.resolve(__dirname, '../.././../webapp/i18n/i18n_en.properties'))
      this._i18n = ('' + data).split('\n').reduce((accumulator, currentValue) => {
        if (currentValue.includes('=')) {
          const keyValue = currentValue.split('=')
          accumulator[keyValue[0].trim()] = keyValue[1].trim()
        }
        return accumulator
      }, {})
    }
    return this._i18n[key]
  }

  fill ({ i18nLabel, idLabel, value, waitForSuggestion, parent }) {
    const _parent = parent || this.view
    const workPackage = this.inputForLabel({ parent: _parent, i18n: i18nLabel })
    if (idLabel) { workPackage.setValue(`${idLabel.label} (${idLabel.id})`) }
    if (value) { workPackage.setValue(value) }

    // ui5 bug pressing enter before suggestion is loaded is skipping the tokenization
    if (waitForSuggestion) {
      $('.sapMSuggestionsPopover').waitForExist()
    }

    workPackage.keys('Enter')
    workPackage.keys('Tab')
  }

  clear ({ i18nLabel }) {
    const workPackage = this.inputForLabel({ i18n: i18nLabel })
    // clear up to 7 tokens and/or all text
    workPackage.setValue('')
    workPackage.keys(['Backspace', 'Backspace', 'Backspace', 'Backspace', 'Backspace', 'Backspace', 'Backspace', 'Control', 'a', 'Control', 'Delete'])
  }

  /**
     * @param {any} param parameter
     * @param {string} param.i18n can be label or tooltip, use tooltip in case of icon
     * @param {string} param.text button text
     */
  pressButton ({ i18n, parent, text }) {
    const _parent = parent || this.view
    let _text = text
    if (i18n) { _text = this.i18n(i18n) }
    const button = _parent.$('button*=' + _text)

    // const buttonInner = button.$("span");
    button.waitForClickable()
    button.click()
  }

  inputForLabel ({ ariaLabel, i18n, parent }) {
    const _parent = parent || this.view
    const text = ariaLabel || this.i18n(i18n)
    const selector = _parent.$(`label[aria-label="${text}"]`)

    if (!selector) { throw new Error('Not supported') }

    const id = selector.getAttribute('for')
    return $(`//*[@id="${id}"]`)
  }
}
