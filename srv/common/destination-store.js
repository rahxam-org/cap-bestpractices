const axios = require('axios')
const querystring = require('querystring')
const xsenv = require('@sap/xsenv')

const _data = {
  connections: {
    successfactors: {
      connection: false,
      onPremise: false,
      authentication: 'token'
    },
    dox42: {
      connection: false,
      onPremise: true,
      authentication: 'none'
    }
  }
}

const DestinationStore = {
  destroyConnection: (target) => {
    _data.connections[target].connection = false
  },
  createConnection: async (req, target) => {
    if (
      !_data.connections[target].connection ||
      _data.connections[target].expiresIn < Date.now()
    ) {
      // Read environment variables
      const xsuaaServiceCredentials = xsenv.serviceCredentials({ tag: 'xsuaa' })
      if (!xsuaaServiceCredentials) {
        req.error(400, 'UAA Service is missing')
        return false
      }
      const destinationServiceCredentials = xsenv.serviceCredentials({
        tag: 'destination'
      })
      if (!destinationServiceCredentials) {
        req.error(400, 'Destination Service is missing')
        return false
      }
      const connectionServiceCredentials = xsenv.serviceCredentials({
        tag: 'connectivity'
      })
      if (!connectionServiceCredentials) {
        req.error(400, 'Connection Service is missing')
        return false
      }
      const destUaaCredentials = `${destinationServiceCredentials.clientid}:${destinationServiceCredentials.clientsecret}`
      const connUaaCredentials = `${connectionServiceCredentials.clientid}:${connectionServiceCredentials.clientsecret}`

      // Request a JWT token to access the destination service
      try {
        const destTokenReq = await axios.post(
          xsuaaServiceCredentials.url + '/oauth/token',
          querystring.stringify({
            grant_type: 'client_credentials',
            client_id: destinationServiceCredentials.clientid
          }),
          {
            headers: {
              Authorization:
                'Basic ' + Buffer.from(destUaaCredentials).toString('base64'),
              'Content-type': 'application/x-www-form-urlencoded'
            }
          }
        )

        if (destTokenReq.status !== 200 || !destTokenReq.data.access_token) {
          req.error(400, 'Error when fetching destination service token')
          return false
        }

        // Access the destination service securely
        const destinationRequest = await axios.get(
          destinationServiceCredentials.uri +
            '/destination-configuration/v1/destinations/' +
            process.env[`${target}ApiDest`],
          {
            headers: {
              Authorization: 'Bearer ' + destTokenReq.data.access_token
            }
          }
        )

        if (
          destinationRequest.status !== 200 ||
          (_data.connections[target].authentication === 'token' &&
            (!destinationRequest.data.authTokens ||
              destinationRequest.data.authTokens.length < 1))
        ) {
          req.error(
            400,
            'Error when fetching the destination from destination service'
          )
          return false
        }

        _data.connections[target].connection = {
          url: destinationRequest.data.destinationConfiguration.URL,
          headers: {}
        }

        if (_data.connections[target].authentication === 'token') {
          _data.connections[
            target
          ].connection.headers.Authorization = `${destinationRequest.data.authTokens[0].type} ${destinationRequest.data.authTokens[0].value}`
          _data.connections[target].expiresIn =
            Date.now() + destinationRequest.data.authTokens[0].expires_in * 900
        } else if (_data.connections[target].authentication === 'basic') {
          _data.connections[
            target
          ].connection.headers.Authorization = `${destinationRequest.data.authTokens[0].type} ${destinationRequest.data.authTokens[0].value}`
          _data.connections[target].expiresIn = Date.now() + 86400000 * 365
        } else {
          _data.connections[target].expiresIn = Date.now() + 86400000
        }

        // for on premise _data.connections set proxy settings
        if (_data.connections[target].onPremise) {
          // fetch authentication token for connectivity service
          const connTokenReq = await axios.post(
            xsuaaServiceCredentials.url + '/oauth/token',
            querystring.stringify({
              grant_type: 'client_credentials',
              client_id: connectionServiceCredentials.clientid
            }),
            {
              headers: {
                Authorization:
                  'Basic ' + Buffer.from(connUaaCredentials).toString('base64')
              }
            }
          )

          if (connTokenReq.status !== 200 || !connTokenReq.data.access_token) {
            req.error(400, 'Error when fetching connectivity service token')
            return false
          }

          const expiresIn = connTokenReq.data.expires_in * 900
          _data.connections[target].expiresIn =
            _data.connections[target].expiresIn < expiresIn
              ? _data.connections[target].expiresIn
              : expiresIn

          _data.connections[target].connection.headers['Proxy-Authorization'] =
            'Bearer ' + connTokenReq.data.access_token

          if (
            destinationRequest.data.destinationConfiguration
              .CloudConnectorLocationId
          ) {
            _data.connections[target].connection.headers[
              'SAP-Connectivity-SCC-Location_ID'
            ] =
              destinationRequest.data.destinationConfiguration.CloudConnectorLocationId
          }

          _data.connections[target].connection.proxy = {
            host: connectionServiceCredentials.onpremise_proxy_host,
            port: connectionServiceCredentials.onpremise_proxy_http_port
          }
        }
      } catch (error) {
        console.error('response' in error ? error.response.data : error)
        req.error(400, `Error when connecting to ${target}`)
      }
    }
    return _data.connections[target].connection
  }
}

Object.freeze(DestinationStore)
export default DestinationStore
