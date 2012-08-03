var nj = require('../lib/client');

var client = nj.createClient({
      username: 'marak',
      password: 'foobar',
      remoteUri: 'https://api.nodejitsu.com'
    });

client.apps.start('marak/hellonode', function(err, result){
  if (err) {
    console.log(err);
    return;
  }
  console.log(JSON.stringify(result, null, 2, true));
});

