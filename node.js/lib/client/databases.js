/*
 * databases.js: Client for the Nodejitsu users API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    Client = require('./client').Client;

//
// ### function Databases (options)
// #### @options {Object} Options for this instance
// Constructor function for the Databases resource responsible
// with Nodejitsu's Databases API
//
var Databases = exports.Databases = function (options) {
  Client = require('./client').Client;
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Databases, Client);

//
// ### function create (databaseType, databaseName, callback)
// #### @databaseType {string} Type of database to create, valid values: redis, couch, mongo
// #### @databaseName {string} Name of the database to create
// #### @callback {function} Continuation to pass control to when complete
// Provisions a database for the user
//


Databases.prototype.create = function (/* user, database, attrs, callback */) {
  var args      = utile.args(arguments);
  
  console.log('warg', args)
    var self = this;
  self.addons.client.users.databases.create(user, database, { type: attrs.type, name: database }, function(err, res, body){
    callback(err, body);
  });
};

//
// ### function get (databaseName, callback)
// #### @databaseName {string} Name of the database to get
// #### @callback {function} Continuation to pass control to when complete
// Gets the metadata for the specified database
//
Databases.prototype.get = function (user, database, callback) {
  self.addons.client.users.databases.get(user, database, function(err, res, body){
    callback(err, body);
  });
};

//
// ### function list (callback)
// #### @callback {function} Continuation to pass control to when complete
// Gets the list of databases assigned to the user
//
Databases.prototype.list = function (callback) {
  self.addons.client.users.databases(user, function(err, res, body){
    callback(err, body);
  });
};

//
// ### function destroy (databaseName, callback)
// #### @databaseName {string} Name of the database to delete
// #### @callback {function} Continuation to pass control to when complete
// Deprovisions specified database
//
Databases.prototype.destroy = function (user, database, callback) {
  self.addons.client.users.databases.destroy(user, database, function(err, res, body){
    callback(err, body);
  });
};
