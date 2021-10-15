/* eslint-env mocha */
/* global browser, $, expect */

const defaults = {
  user: 'admin',
  pw: '1234',
  baseUrl: 'http://localhost:4004'
}

module.exports = class {
  constructor () {
    if (process.env.BASE_URL) {
      this.data = {
        user: process.env.CF_USER,
        pw: process.env.CF_PASSWORD,
        baseUrl: process.env.BASE_URL,
        method: 'FORM'
      }
    } else {
      this.data = {
        user: defaults.user,
        pw: defaults.pw,
        baseUrl: defaults.baseUrl,
        method: 'BASIC'
      }
    }
  }

  login () {
    // only required for local dev some firewall/protection blocks initial everything for 1 second
    browser.pause(500)
    // quick fix for login basic-auth till there jwt in place
    if (this.data.method === 'FORM') {
      console.log(this.data.baseUrl + ' - Login via form')

      browser.url('/#')
      // form login
      const userName = $('input[name*=\'username\']')
      userName.waitForDisplayed()
      userName.setValue(this.data.user)

      $('input[name*=\'password\']').setValue(this.data.pw)
      $('button, input[type=\'submit\']').keys('Enter')
      expect(userName).not.toBeVisible()
    } else {
      console.log(this.data.baseUrl + ' - Login via basic auth')
      const urlMatches = this.data.baseUrl.match(/(\w*:?\/\/)(.+)/)
      if (urlMatches === null) {
        throw new Error("Couldn't parse given base url")
      }
      this.baseUrlAuth = urlMatches[1] + this.data.user + ':' + this.data.pw + '@' + urlMatches[2]
      const urlWithAuth = `${this.baseUrlAuth}/test/Auth`
      console.log(urlWithAuth)
      browser.url(urlWithAuth)

      const elem = $('body>pre')
      expect(elem).toHaveTextContaining('@odata.context')
      browser.url('/') // ! important to have an URL that includes NOT credentials
    }
  }

  weekOfYear (shiftWeeks) {
    let now = new Date()

    if (Number.isInteger(shiftWeeks)) {
      now = new Date(new Date().setDate(new Date().getDate() + (shiftWeeks * 7)))
    }
    now.setHours(0, 0, 0, 0)
    now.setDate(now.getDate() + 3 - (now.getDay() + 6) % 7)
    const week1 = new Date(now.getFullYear(), 0, 4)
    return 1 + Math.round(((now.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
  }

  async reset () {
    // we do reset require(the browser therefore auth is no "our" problem
    const result = await browser.executeAsync((done) => {
      // eslint-disable-next-line no-undef
      fetch('/test/reset', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // eslint-disable-next-line no-undef
        headers: new Headers({ 'content-type': 'application/json' })
      }).then(() => {
        done()
      }).catch((_e) => {
        done(_e.toString())
      })
    })

    if (result) {
      throw result
    }
  }
}
