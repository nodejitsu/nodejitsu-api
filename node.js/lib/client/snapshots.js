'use strict';

/*
 * snapshots.js: Client for the Nodejitsu snapshots API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    Client = require('./client').Client,
    defaultUser = require('./helpers').defaultUser;

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
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat('snapshots');

  this.request({ uri: argv }, function (err, result) {
    if (err) return callback(err);

    callback(err, result.snapshots);
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
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat(['snapshots', snapshotName]);

  return this.upload({ uri: argv, file: filename }, callback);
};

//
// ### function fetch (appName, snapshotName, callback)
// #### @appName {string} Name of the application to fetch a snapshot for.
// #### @snapshotName {string} Name of the snapshot to fetch.
// #### @callback {function} Continuation to pass control to when complete. **Optional**.
// Fetchs a snapshot for the application with `app.name = name` and
// `snapshot.id === snapshotName`.
//
Snapshots.prototype.fetch = function (appName, snapshotName, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat(['snapshots', snapshotName + '.tgz']);

  callback = callback || function () {};
  return this.request({ uri: argv }, callback);
};

//
// ### function destroy (appName, snapshotName, callback)
// #### @appName {string} Name of the application to destroy a snapshot for.
// #### @snapshotName {string} Name of the snapshot to destroy.
// #### @callback {function} Continuation to pass control to when complete
// Destroys a snapshot for the application with `app.name = name` and
// `snapshot.id === snapshotName`.
//
Snapshots.prototype.destroy = function (appName, snapshotName, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat(['snapshots', snapshotName]);

  this.request({ method: 'DELETE', uri: argv }, callback);
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
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat(['snapshots', snapshotName, 'activate']);

  this.request({ method: 'POST', uri: argv }, callback);
};
