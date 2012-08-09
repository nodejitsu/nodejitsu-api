var nj = require('../lib/client'),
    fs = require('fs');

var client = nj.createClient({
  username: 'marak',
  password: 'foofoo',
  remoteUri: 'http://api.nodejitsu.com'
});


client.databases.get('new-database-55558', function(err, result){
  if (err) {
    console.log(err);
    return;
  }
  console.log(result)
});
