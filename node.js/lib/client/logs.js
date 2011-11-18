/*
 * logs.js: Client for the Nodejitsu logs API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    winston = require('winston'),
    Client = require('./client').Client;

//
// ### function Logs (options)
// #### @options {Object} Options for this instance
// Constructor function for the Logs resource
// with Nodejitsu's Logs API
//
var Logs = exports.Logs = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Logs, Client);

//
// ### function byApp (appId, amount, callback)
// #### @appId {string} the name of the application to retrieve
// #### @amount {number} the number of lines to retrieve
// #### @callback {function} Continuation to pass control to when complete.
// It retrieves the specified amount of logs for the application
//
Logs.prototype.byApp = function (name, amount, callback) {
  var options = {
    from: 'NOW-1DAY',
    until: 'NOW',
    rows: amount
  };

  this.request('POST', ['logs', name], options, callback, function (res, result) {
    callback(null, result);
  });
};

//
// ### function byUser (amount, callback)
// #### @amount {number} the number of lines to retrieve
// #### @callback {function} Continuation to pass control to when complete.
// It retrieves the specified amount of logs for all the applications for the user
//
Logs.prototype.byUser = function (username, amount, callback) {
  var options = {
    from: 'NOW-1DAY',
    until: 'NOW',
    rows: amount
  };

  this.request('POST', ['logs', username], options, callback, function (res, result) {
    callback(null, result);
  });
};
