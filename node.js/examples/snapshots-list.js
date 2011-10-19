var nj = require('../lib/client'),
    fs = require('fs');

var client = nj.createClient({
      username: 'marak',
      password: '1234',
      remoteUri: 'http://localhost:9001'
    });

client.snapshots.list('test', console.log);
