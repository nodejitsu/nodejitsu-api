var nj = require('../lib/client');

var client = nj.createClient({
      username: 'marak',
      password: 'foo',
      remoteUri: 'https://api.nodejitsu.com'
    });

client.logs.byUser('marak', 100, function(err, result){
  if (err) {
    console.log(err);
    return;
  }
  console.log(JSON.stringify(result, null, 2, true));
});

