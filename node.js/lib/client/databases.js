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
// ### function create (username, databaseType, databaseName, callback)
// #### @username {string} Username
// #### @databaseType {string} Type of database to create, valid values: redis, couch, mongo
// #### @databaseName {string} Name of the database to create
// #### @callback {function} Continuation to pass control to when complete
// Provisions a database for the user
//
Databases.prototype.create = function (username, databaseType, databaseName, callback) {
  if (arguments.length == 3) {
    callback = databaseName;
    databaseName = databaseType;
    databaseType = username;
    username = this.options.get('username');
  }

  this.addons.client.users.databases.create(username, {
    type: databaseType,
    name: databaseName
  }, function(err, res, body){
    callback(err, body);
  });
};

//
// ### function get (username, databaseName, callback)
// #### @username {String} Username
// #### @databaseName {string} Name of the database to get
// #### @callback {function} Continuation to pass control to when complete
// Gets the metadata for the specified database
//
Databases.prototype.get = function (username, databaseName, callback) {
  if (arguments.length == 2) {
    callback = databaseName;
    databaseName = username;
    username = this.options.get('username');
  }

  this.addons.client.users.databases.get(username, databaseName, function(err, res, body){
    callback(err, body);
  });
};

//
// ### function list (username, callback)
// #### @username {String} Username
// #### @callback {function} Continuation to pass control to when complete
// Gets the list of databases assigned to the user
//
Databases.prototype.list = function (username, callback) {
  if (arguments.length == 1) {
    callback = username;
    username = this.options.get('username');
  }

  this.addons.client.users.databases(username, function(err, res, body){
    callback(err, body);
  });
};

//
// ### function destroy (username, databaseName, callback)
// #### @username {String} Username
// #### @databaseName {string} Name of the database to delete
// #### @callback {function} Continuation to pass control to when complete
// Deprovisions specified database
//
Databases.prototype.destroy = function (username, databaseName, callback) {
  if (arguments.length == 2) {
    callback = databaseName;
    databaseName = username;
    username = this.options.get('username');
  }

  this.addons.client.users.databases.destroy(username, databaseName, function(err, res, body){
    callback(err, body);
  });
};
