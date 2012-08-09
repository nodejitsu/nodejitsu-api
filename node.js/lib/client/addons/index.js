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
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Addons, Client);

Addons.prototype.list = function (username, callback) {
  callback();
};
