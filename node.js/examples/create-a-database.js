var nj = require('../lib/client'),
    fs = require('fs');

var client = nj.createClient({
  username: 'marak',
  password: 'foofoo',
  remoteUri: 'http://api.nodejitsu.com'
});


client.databases.create('marak', 'new-database-55558', { type: 'couch' }, function(err, result){
  if (err) {
    console.log(err);
    return;
  }
  console.log(result)
});
