/*
 * app.js: Client for the Nodejitsu apps API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    winston = require('winston'),
    Client = require('./client').Client;

//
// ### function Apps (options)
// #### @options {Object} Options for this instance
// Constructor function for the Apps resource responsible
// with Nodejitsu's Apps API
//
var Apps = exports.Apps = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Apps, Client);

//
// ### function list (callback)
// #### @callback {function} Continuation to pass control to when complete
// Lists all applications for the authenticated user
//
Apps.prototype.list = function (username, callback) {
  this.request('GET', ['apps', username], callback, function (res, result) {
    callback(null, result.apps || res.statusCode);
  })
};

//
// ### function create (app, callback)
// #### @app {Object} Package.json manifest for the application.
// #### @callback {function} Continuation to pass control to when complete
// Creates an application with the specified package.json manifest in `app`. 
//
Apps.prototype.create = function (app, callback) {
  var username = this.options.get('username');
  this.request('POST', ['apps', username, app.name], app, callback, function (res, result) {
    callback(null, result || res.statusCode);
  })
};

//
// ### function view (name, callback)
// #### @name {string} Name of the application to view
// #### @callback {function} Continuation to pass control to when complete
// Views the application specified by `name`.
//
Apps.prototype.view = function (name, callback) {
  this.request('GET', ['apps', name], callback, function (res, result) {
    callback(null, result.app || res.statusCode);
  })
};

//
// ### function update (name, attrs, callback)
// #### @name {string} Name of the application to update
// #### @attrs {Object} Attributes to update for this application.
// #### @callback {function} Continuation to pass control to when complete
// Updates the application with `name` with the specified attributes in `attrs`
//
Apps.prototype.update = function (name, attrs, callback) {
  this.request('PUT', ['apps', name], attrs, callback, function (res, result) {
    callback(null, result || res.statusCode);
  });
};

//
// ### function destroy (name, callback)
// #### @name {string} Name of the application to destroy
// #### @callback {function} Continuation to pass control to when complete
// Destroys the application with `name` for the authenticated user. 
//
Apps.prototype.destroy = function (name, callback) {
  this.request('DELETE', ['apps', name], callback, function (res, result) {
    callback(null, result || res.statusCode);
  })
};

//
// ### function start (name, callback)
// #### @name {string} Name of the application to start
// #### @callback {function} Continuation to pass control to when complete
// Starts the application with `name` for the authenticated user. 
//
Apps.prototype.start = function (name, callback) {
  this.request('POST', ['apps', name, 'start'], callback, function (res, result) {
    callback(null, result || res.statusCode);
  });
};

//
// ### function restart (name, callback)
// #### @name {string} Name of the application to start
// #### @callback {function} Continuation to pass control to when complete
// Starts the application with `name` for the authenticated user. 
//
Apps.prototype.restart = function (name, callback) {
  this.request('POST', ['apps', name, 'restart'], callback, function (res, result) {
    callback(null, result || res.statusCode);
  });
};

//
// ### function stop (name, callback)
// #### @name {string} Name of the application to stop.
// #### @callback {function} Continuation to pass control to when complete
// Stops the application with `name` for the authenticated user. 
//
Apps.prototype.stop = function (name, callback) {
  this.request('POST', ['apps', name, 'stop'], callback, function (res, result) {
    callback(null, result || res.statusCode);
  });
};

//
// ### function available (app, callback)
// #### @app {Object} Application to check availability against.
// #### @callback {function} Continuation to respond to when complete.
// Checks the availability of the `app.name` / `app.subdomain` combo 
// in the current Nodejitsu environment.
//
Apps.prototype.available = function (app, callback) {
  var username = this.options.get('username');
  this.request('POST', ['apps', username, app.name, 'available'], app, callback, function (res, result) {
    callback(null, result || res.statusCode);
  });
};
