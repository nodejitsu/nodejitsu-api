var nj = require('../lib/client'),
    fs = require('fs');

var client = nj.createClient({
  username: 'marak',
  password: 'foofoo',
  remoteUri: 'https://api.nodejitsu.com'
});


client.databases.create('new-database-55558', 'couch', function(err, result){
  if (err) {
    console.log(err);
    return;
  }
  console.log(result)
});
