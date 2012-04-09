var nj = require('../lib/client'),
    fs = require('fs');

var client = nj.createClient({
      username: 'jim',
      password: '1234',
      remoteUri: 'http://localhost:9001',
      debug: true
    });

client.keys.view('jim/keys/my-key', function(err, result){
  if (err) {
    console.log(err);
    return;
  }
  console.log(JSON.stringify(result, null, 2, true));
});
