/*
 * keys.js: Client for the Nodejitsu Keys API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */
 
var util = require('util'),
    Client = require('./client').Client,
    defaultUser = require('./helpers').defaultUser;
    
//
// ### function Keys (options)
// #### @options {Object} Options for this instance
// Constructor function for the Keys resource responsible
// with Nodejitsu's Keys API
//
var Keys = exports.Keys = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Keys, Client);

//
// ### function list (username, callback)
// #### @callback {function} Continuation to pass control to when complete
// Lists all keys for the authenticated user
//
Keys.prototype.list = function (username, callback) {
  if (arguments.length == 1) {
    callback = username;
    username = this.options.get('username');
  }
  this.request('GET', ['users', username, 'keys'], callback, function (res, result) {
    callback(null, result);
  })
};

//
// ### function create (key, callback) 
// #### @key {Object} Properties for the new key.
// #### @callback {function} Continuation to pass control to when complete
// Creates a new key with the properties specified by `key`.
//
Keys.prototype.create = function (id, key, callback) {
  if(arguments.length === 2) {
    callback = key;
    key = {};
  }
  this.request('POST', ['users', id], key, callback, function (res, result) {
    callback(null, result);
  });
};


//
// ### function destroy (key, callback) 
// #### @key {Object} Properties for the new key.
// #### @callback {function} Continuation to pass control to when complete
// Creates a new key with the properties specified by `key`.
//
Keys.prototype.destroy = function (key, callback) {
  this.request('DELETE', ['users', key], key, callback, function (res, result) {
    callback(null, result);
  });
};

//
// ### function view (key, callback)
// #### @callback {function} Continuation to pass control to when complete.
// Retrieves data for the specified user.
//
Keys.prototype.view = function (key, callback) {
  this.request('GET', ['users', key], callback, function (res, result) {
    callback(null, result);
  });
};
