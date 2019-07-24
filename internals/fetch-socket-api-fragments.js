const fs = require('fs')
const path = require('path')

const fetch = require('node-fetch')
const socketApiURL = process.env.SOCKET_API_URL || 'http://localhost:3002'

module.exports = channel => {
  if (channel.config.chat.enabled) {
    fetch(`${socketApiURL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variables: {},
        query: `
          {
            __schema {
              types {
                kind
                name
                possibleTypes {
                  name
                }
              }
            }
          }
    `,
      }),
    })
      .then(result => result.json())
      .then(json => {
        // here we're filtering out any type information unrelated to unions or interfaces
        const filteredData = json.data.__schema.types.filter(
          type => type.possibleTypes !== null,
        )
        json.data.__schema.types = filteredData

        fs.writeFileSync(
          path.resolve('base', 'lib', 'apollo', 'fragment-types.json'),
          JSON.stringify(json.data),
          'utf8',
        )
      })
      .catch(error => {
        console.error(error)
      })
  }
}
