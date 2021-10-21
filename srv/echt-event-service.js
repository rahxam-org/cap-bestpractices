const { v4: uuid } = require('uuid')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator')

module.exports = async function () {
  this.on('fancyEvent', onFancyEvent)

  async function onFancyEvent () {
    const config = {
      dictionaries: [adjectives, colors, animals]
    }

    await SELECT.from('Books')
    await INSERT.into('Echt1').entries([{ ID: uuid(), name: uniqueNamesGenerator(config) }])
    const echtAll = await SELECT.from('Echt1')
    const echt1 = echtAll[Math.floor(Math.random() * echtAll.length)]
    await UPDATE('Echt1').with({ name: uniqueNamesGenerator(config) }).where({ ID: echt1.ID })
    const echt2All = [{
      echt1_ID: echt1.ID,
      ID: uuid(),
      name: uniqueNamesGenerator(config)
    }, {
      echt1_ID: echt1.ID,
      ID: uuid(),
      name: uniqueNamesGenerator(config)
    }]
    await INSERT.into('Echt2').entries(echt2All)
    const echt2 = await SELECT.one.from('Echt2').columns(['ID']).where({ ID: echt2All[0].ID })
    await UPDATE('Echt2').with({ name: uniqueNamesGenerator(config) }).where({ ID: echt2.ID })
  }
}
