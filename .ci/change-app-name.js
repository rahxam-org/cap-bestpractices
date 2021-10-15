const fs = require('fs')

// read file and make object
let packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
let xsSecurityJson = JSON.parse(fs.readFileSync('xs-security.json', 'utf8'))

let version = process.env.BRANCH

// edit or add property
packageJson.name = xsSecurityJson.xsappname = `${packageJson.name}_${version}`

//write file
fs.writeFileSync('package.json', JSON.stringify(packageJson))
fs.writeFileSync('xs-security.json', JSON.stringify(xsSecurityJson))