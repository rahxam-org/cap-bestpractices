const axios = require('axios')
const fs = require('fs')
const querystring = require('querystring')

const authUrl = 'https://dev-appl-cust-cf.authentication.eu10.hana.ondemand.com'
const serviceUrl = 'https://api.authentication.eu10.hana.ondemand.com'
const binding = JSON.parse(fs.readFileSync(process.env.CF_API_BINDING, 'utf8'))
const clientId = binding.clientid
const clientSecret = binding.clientsecret

const getOauthToken = async function () {
  // get oauth credentials
  const getClientCredentials = await axios.post(
    `${authUrl}/oauth/token`,
    querystring.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
    }), {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).catch((e) => { console.error(e); throw e })


  if (getClientCredentials.status !== 200 || !getClientCredentials.data.access_token) {
    console.error(400, 'Error when fetching destination service token')
    return false
  }

  return getClientCredentials.data.access_token
}

const createRoleCollection = async function (token) {
  const json = {
    'description': `NUTI CI User Role ${process.env.CI_ENVIRONMENT_SLUG}`,
    'isReadOnly': false,
    'name': `NUTI CI User Role ${process.env.CI_ENVIRONMENT_SLUG}`,
    'roleReferences': [
      {
        'description': 'user',
        'name': 'user',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'user'
      },
      {
        'description': 'import',
        'name': 'import',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'import'
      },
      {
        'description': 'admin',
        'name': 'admin',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'admin'
      },
      {
        'description': 'interface-admin',
        'name': 'interface-admin',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'interface-admin'
      },
      {
        'description': 'maintainer',
        'name': 'maintainer',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'maintainer'
      },
      {
        'description': 'time-admin',
        'name': 'time-admin',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'time-admin'
      },
      {
        'description': 'fi-admin',
        'name': 'fi-admin',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'fi-admin'
      },
      {
        'description': 'api',
        'name': 'api',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'api'
      },
      {
        'description': 'ticket-token',
        'name': 'ticket-token',
        'roleTemplateAppId': `nuti_${process.env.CI_ENVIRONMENT_SLUG}!t44021`,
        'roleTemplateName': 'ticket-token'
      }
    ],
    // 'userReferences': [
    //   {
    //     "id": "60f300aa-739c-43cb-b8e8-df951e327365",
    //     "username": "sf-skill-interface-suser-scp-cpi-dev@nttdata.com",
    //     "zoneId": "1d645ac6-16a4-47fd-89e8-a739a8167c09",
    //     "email": "sf-skill-interface-suser-scp-cpi-dev@nttdata.com",
    //     "givenName": "Itelligence",
    //     "familyName": "SuccessFactors DB CPI SCP DEV",
    //     "origin": "ldap"
    //   }
    // ]
  }

  const request_config = {
    maxContentLength: 1000000000000000,
    maxBodyLength: 1000000000000000,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  let file = await axios.post(`${serviceUrl}/sap/rest/authorization/v2/rolecollections`, json, request_config).catch((e) => { console.error(e); throw e })
  return file.data
}

const assignUser = async function (token, role) {
  const json = {
    'members': [
      {
        'origin': 'ldap',
        'type': 'USER',
        'value': '60f300aa-739c-43cb-b8e8-df951e327365'
      }
    ]
  }
  const date = new Date()
  const request_config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'If-Match': `${(date.getFullYear() + "").substring(2, 4)}${date.getMonth()}${date.getHours()}${date.getMinutes()}`
    }
  }
  let file = await axios.patch(`${serviceUrl}/Groups/${role}`, json, request_config).catch((e) => { console.error(e); throw e })
  return file.data
}

const createTestAuthorization = async function () {
  console.log('Start Role Collection Creation')

  try {

    console.log('Get Oauth Token')
    let token = await getOauthToken()

    console.log('Create Role')
    let role = await createRoleCollection(token)
    console.log(`Role: ${role.name}`)

    console.log('Assign User')
    let user = await assignUser(token, role.name)
    console.log(`User: ${user.members[0].value}`)

  } catch (error) {
    //console.error(error)
    throw error
  }
  console.log('End Role Collection Creation')
}

createTestAuthorization()
