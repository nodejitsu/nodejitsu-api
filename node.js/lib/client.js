var parts = ['Apps', 'Users', 'Snapshots', 'Databases', 'Logs', 'Client'];

parts.forEach(function (k) {
  exports[k] = require('./client/' + k.toLowerCase())[k];
})

exports.createClient = function (options) {
  var client = {};
  parts.forEach(function (k) {
    client[k.toLowerCase()] = new exports[k](options);
    client[k.toLowerCase()].on('debug::request',  debug);
    client[k.toLowerCase()].on('debug::response', debug);
  });
  function debug (arguments) {
    if (options.debug) {
      console.log(arguments);
    }
  }
  return client;
}