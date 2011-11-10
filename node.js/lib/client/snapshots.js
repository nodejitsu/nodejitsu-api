/*
 * snapshots.js: Client for the Nodejitsu snapshots API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    fs = require('fs'),
    winston = require('winston'),
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
// ### function list (name, callback)
// #### @name {string} Name of the application to list snapshots for.
// #### @callback {function} Continuation to pass control to when complete
// Lists all applications for the authenticated user
//
Snapshots.prototype.list = function (name, callback) {
  winston.info('Listing snapshots for ' + name.magenta);
  var username = this.options.get('username');
  this.request('GET', ['apps', username, name, 'snapshots'], callback, function (res, result) {
    callback(null, result.snapshots);
  });
};

//
// ### function create (name, snapshot, callback)
// #### @appName {string} Name of the application to create a snapshot for.
// #### @snapshotName {string} Snapshot name
// #### @filename {string} Snapshot filename (`*.tgz` file)
// #### @callback {function} Continuation to pass control to when complete
// Creates a snapshot named `snapshotName` for the application with
// `app.name = name` using the `*.tgz` package data in `filename` file.
//
Snapshots.prototype.create = function (appName, snapshotName, filename, callback) {
  var username = this.options.get('username');
  var url = ['apps', username, appName, 'snapshots', snapshotName];
  var that = this;

  fs.stat(filename, function(err, stat) {
    if (err) return callback(err);

    // XXX Is 25 mb enough? Please warning message
    if (stat.size > 50 * 1024 * 1024) {
      winston.warn('You\'re trying to upload snapshot larger than ' +
                   '50M'.magenta + '.');
      winston.warn('This is not recommended practice.');
    }

    that.upload(url, 'application/octet-stream', filename, callback, function (res, body) {
      callback(null, body || res.statusCode);
    });
  });
};

//
// ### function create (name, snapshot, callback)
// #### @name {string} Name of the application to destroy a snapshot for.
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
// ### function activate (name, snapshot, callback)
// #### @name {string} Name of the application to activate a snapshot for.
// #### @snapshot {string} Name of the snapshot to activate.
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
