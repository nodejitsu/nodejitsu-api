/*
 *
 *
 */

var util = require('util'),
    Client = require('../client').Client,
    fs = require("fs"),
    dr = require('director-reflector'),
    defaultUser = require('../helpers').defaultUser;

var Addons = exports.Addons = function (options) {
  
  this.router = JSON.parse(fs.readFileSync(__dirname + '/router.json').toString());
  this.client = dr.createClient(this.router);
  console.log(this.router)
  console.log(this.client)
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Addons, Client);

Addons.prototype.list = function (username, callback) {
  console.log('sup')
};
