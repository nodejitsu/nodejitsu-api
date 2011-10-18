var nj = require('../lib/client')

var client = nj.createClient({
      username: 'wizard',
      password: 'password',
      remoteUri: 'http://localhost:9001'
    })

client.apps.view('bugger', console.log)