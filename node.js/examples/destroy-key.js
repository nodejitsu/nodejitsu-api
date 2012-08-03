var nj = require('../lib/client'),
    fs = require('fs');

var client = nj.createClient({
  username: 'marak',
  password: 'foobar',
  remoteUri: 'https://api.nodejitsu.com'
});

client.keys.destroy('marak/keys/test-ssh-key', function(err, result){
  if (err) {
    console.log(err);
    return;
  }
  console.log(JSON.stringify(result, null, 2, true));
});
