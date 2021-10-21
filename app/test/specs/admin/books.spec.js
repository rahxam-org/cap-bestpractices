/* globals before beforeEach describe */
const Util = require('../../support/util')
const Books = require('../../pageObjects/books/Books.page')

const util = new Util()
const books = new Books()

describe('Books ', () => {
  before(() => { util.login() })
  beforeEach(async function () { await util.reset(); browser.url('about:blank') })

  it('Two books in table', () => {
    books.open()
    expect(books.view.$$('tbody>tr')).toBeElementsArrayOfSize(2)
  })

  it('activate the first Month-End Closing ', () => {
    books.open()

    const firstBook = books.view.$('tbody>tr:first-child')
    firstBook.click()
  })
})
