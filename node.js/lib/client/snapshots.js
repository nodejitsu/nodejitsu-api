/*
 * snapshots.js: Client for the Nodejitsu snapshots API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    Client = require('./client').Client;

//
// ### function Snapshots (options)
// #### @options {Object} Options for this instance
// Constructor function for the Apps resource responsible
// with Nodejitsu's Snapshots API
//
var Snapshots = exports.Snapshots = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Snapshots, Client);

//
// ### function list (appName, callback)
// #### @appName {string} Name of the application to list snapshots for.
// #### @callback {function} Continuation to pass control to when complete
// Lists all applications for the authenticated user
//
Snapshots.prototype.list = function (appName, callback) {
  var username = this.options.get('username');
  this.request('GET', ['apps', username, appName, 'snapshots'], callback, function (res, result) {
    callback(null, result.snapshots);
  });
};

//
// ### function create (appName, snapshotName, filename, callback)
// #### @appName {string} Name of the application to create a snapshot for.
// #### @snapshotName {string} Snapshot name
// #### @filename {string} Snapshot filename (`*.tgz` file)
// #### @callback {function} Continuation to pass control to when complete
// Creates a snapshot named `snapshotName` for the application with
// `app.name = name` using the `*.tgz` package data in `filename` file.
//
Snapshots.prototype.create = function (appName, snapshotName, filename, callback) {
  var username = this.options.get('username'),
      url = ['apps', username, appName, 'snapshots', snapshotName];

  this.upload(url, 'application/octet-stream', filename, callback, function (res, body) {
    callback(null, body || res.statusCode);
  });
};

//
// ### function create (appName, snapshotName, callback)
// #### @appName {string} Name of the application to destroy a snapshot for.
// #### @snapshotName {string} Name of the snapshot to destroy.
// #### @callback {function} Continuation to pass control to when complete
// Destroys a snapshot for the application with `app.name = name` and 
// `snapshot.id === snapshotName`.
//
Snapshots.prototype.destroy = function (appName, snapshotName, callback) {
  var username = this.options.get('username'),
      url = ['apps', username, appName, 'snapshots', snapshotName];
      
  this.request('DELETE', url, callback, function (res, body) {
    callback(null, body || res.statusCode);
  });
};

//
// ### function activate (appName, snapshotName, callback)
// #### @appName {string} Name of the application to activate a snapshot for.
// #### @snapshotName {string} Name of the snapshot to activate.
// #### @callback {function} Continuation to pass control to when complete
// Activates a snapshot for the application with `app.name = name` and 
// `snapshot.id === snapshotName`.
//
Snapshots.prototype.activate = function (appName, snapshotName, callback) {
  var username = this.options.get('username'),
      url = ['apps', username, appName, 'snapshots', snapshotName, 'activate'];
      
  this.request('POST', url, callback, function (res, body) {
    callback(null, body || res.statusCode);
  });
};
