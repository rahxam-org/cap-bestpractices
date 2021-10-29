// module.exports = require('./data')

const DataGenerator = require('./data-generator')
module.exports = new DataGenerator().writeCSV()
