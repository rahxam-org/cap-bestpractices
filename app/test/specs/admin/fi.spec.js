/* globals before beforeEach describe */
const Util = require('../../support/util')
const AdminFi = require('../../pageObjects/admin/Fi.page')

const util = new Util()
const adminFi = new AdminFi()

describe('AdminFi ', () => {
  before(() => { util.login() })
  beforeEach(async function () { await util.reset(); browser.url('about:blank') })

  it('filter for Service Organization 1010 ', () => {
    adminFi.open()
    adminFi.fill({ i18nLabel: 'common.serviceOrganization', value: '1010', waitForSuggestion: true })

    expect(adminFi.view.$$('tbody>tr')).toBeElementsArrayOfSize(2)
  })

  it('filter without Start-End', () => {
    adminFi.open()
    adminFi.fill({ i18nLabel: 'common.serviceOrganization', value: '1010', waitForSuggestion: true })
    adminFi.clear({ i18nLabel: 'common.startEnd' })

    const closingImOrg1010 = 12
    const rowsWithServiceOrg1010 = adminFi.view.$$("//tr/td[ position()=2 and contains(.,'1010') ]")
    expect(rowsWithServiceOrg1010).toBeElementsArrayOfSize(closingImOrg1010)
  })

  it('activate the first Month-End Closing ', () => {
    adminFi.open()

    const mySwitch = adminFi.view.$('.sapMSwt')
    mySwitch.click()

    expect(mySwitch).toHaveAttributeContaining('class', 'sapMSwtOn')
  })

  it.skip('add Month-End Closing', () => {
    const timeRange = 'Feb 11, 2538 - Feb 26, 2538'

    adminFi.open()
    adminFi.addAddDialog.open()
    adminFi.addAddDialog.pressRows([{ contains: '1010' }, { contains: '1110a' }])
    adminFi.addAddDialog.pressNext()
    adminFi.addAddDialog.fillTimeRange(timeRange)
    adminFi.addAddDialog.pressCreate()

    adminFi.fill({ i18nLabel: 'common.startEnd', value: timeRange })
    expect(adminFi.view.$$('tbody>tr')).toBeElementsArrayOfSize(2)
  })
})
