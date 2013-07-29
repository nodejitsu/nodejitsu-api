'use strict';

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
Databases.prototype.create = function (databaseType, databaseName, callback) {
  var databaseName = this.defaultUser(databaseName),
      argv = [ 'databases' ].concat(databaseName.split('/'));

  this.request({ method: 'POST', uri: argv, body: { type: databaseType }}, function (err, result, res) {
    if (err) return callback(err);

    callback(err, result.database, res);
  });
};

//
// ### function get (databaseName, callback)
// #### @databaseName {string} Name of the database to get
// #### @callback {function} Continuation to pass control to when complete
// Gets the metadata for the specified database
//
Databases.prototype.get = function (databaseName, callback) {
  var databaseName = this.defaultUser(databaseName),
      argv = [ 'databases' ].concat(databaseName.split('/'));

  this.request({ uri: argv }, function (err, result) {
    if (err) return callback(err);

    callback(null, result.database);
  });
};

//
// ### function list (username, callback)
// #### @username {String} **optional** Username
// #### @callback {function} Continuation to pass control to when complete
// Gets the list of databases assigned to the user
//
Databases.prototype.list = function (username, callback) {
  if (arguments.length === 1) {
    callback = username;
    username = this.options.get('username');
  }

  this.request({ uri: ['databases', username] }, function (err, result) {
    if (err) return callback(err);

    callback(null, result.databases);
  });
};

//
// ### function destroy (databaseName, callback)
// #### @databaseName {string} Name of the database to delete
// #### @callback {function} Continuation to pass control to when complete
// Deprovisions specified database
//
Databases.prototype.destroy = function (databaseName, callback) {
  var databaseName = this.defaultUser(databaseName),
      argv = [ 'databases' ].concat(databaseName.split('/'));

  this.request({ method: 'DELETE', uri: argv }, callback);
};
