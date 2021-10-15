/* global server, before, beforeEach, util */
// eslint-disable-next-line no-unused-vars
const { GET, POST, PATCH, DELETE } = server.httpOperations()
const service = 'admin-ui'
describe(service, () => {
  before(function () { return server.connect(this, '/' + service) })
  beforeEach(() => { return server.reset() })

  util.testEntitySetRead(['Books'])

  it('should request Books', async () => {
    const res = await GET('/MonthClosings?$orderby=serviceOrganization_ID,endDate%20desc&$skip=0&$top=20')
    expect(res).to.have.status(200)
  })
})
