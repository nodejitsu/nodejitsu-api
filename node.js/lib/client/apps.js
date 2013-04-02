'use strict';

/*
 * app.js: Client for the Nodejitsu apps API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    Client = require('./client').Client,
    defaultUser = require('./helpers').defaultUser;

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
// ### function list (username, callback)
// #### @callback {function} Continuation to pass control to when complete
// Lists all applications for the authenticated user
//
Apps.prototype.list = function (username, callback) {
  if (arguments.length === 1) {
    callback = username;
    username = this.options.get('username');
  }

  var self = this;

  this.request({ uri: ['apps', username] }, function (err, result, res) {
    if (err) return callback(err);

    callback(err, result.apps);

    //
    // Cache the lookups so we know which datacenters belong to the apps.
    //
    if (username === self.options.get('username')) {
      result.apps.forEach(function reduce(memo, app) {
        if (app.config && app.config.cloud) {
          self.clouds[app._id] = app.cloud;
        }
      });
    }
  });
};

//
// ### function create (app, callback)
// #### @app {Object} Package.json manifest for the application.
// #### @callback {function} Continuation to pass control to when complete
// Creates an application with the specified package.json manifest in `app`.
//
Apps.prototype.create = function (app, callback) {
  var appName = defaultUser.call(this, app.name);

  this.request({ method: 'POST', uri: ['apps', appName], body: app }, callback);
};

//
// ### function view (appName, callback)
// #### @appName {string} Name of the application to view
// #### @callback {function} Continuation to pass control to when complete
// Views the application specified by `name`.
//
Apps.prototype.view = function (appName, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')),
      self = this;

  this.request({ uri: argv }, function (err, result) {
    if (err) return callback(err);

    var app = result.app;
    callback(err, app);

    //
    // Update the cloud cache.
    //
    if (app.config && app.config.cloud) {
      self.clouds[appName] = app.config.cloud;
    }
  });
};

//
// ### function update (name, attrs, callback)
// #### @appName {string} Name of the application to update
// #### @attrs {Object} Attributes to update for this application.
// #### @callback {function} Continuation to pass control to when complete
// Updates the application with `name` with the specified attributes in `attrs`
//
Apps.prototype.update = function (appName, attrs, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/'));

  this.request({ method: 'PUT', uri: argv, body: attrs }, callback);
};

//
// ### function destroy (appName, callback)
// #### @appName {string} Name of the application to destroy
// #### @callback {function} Continuation to pass control to when complete
// Destroys the application with `name` for the authenticated user.
//
Apps.prototype.destroy = function (appName, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/'));

  this.request({ method: 'DELETE', uri: argv, appName: appName }, callback);
};

//
// ### function start (appName, callback)
// #### @appName {string} Name of the application to start
// #### @cloud {Object|Array} **Optional** Cloud to start this application in.
// #### @callback {function} Continuation to pass control to when complete
// Starts the application with `name` for the authenticated user.
//
Apps.prototype.start = function (appName, cloud, callback) {
  if (!callback && typeof cloud === 'function') {
    callback = cloud;
    cloud = null;
  }

  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat('start');

  if (cloud) {
    this.clouds[appName] = !Array.isArray(cloud)
      ? [cloud]
      : cloud;
  }

  this.cloud({ method: 'POST', uri: argv, appName: appName }, this.request, callback);
};

//
// ### function restart (appName, callback)
// #### @appName {string} Name of the application to start
// #### @callback {function} Continuation to pass control to when complete
// Starts the application with `name` for the authenticated user.
//
Apps.prototype.restart = function (appName, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat('restart');

  this.cloud({ method: 'POST', uri: argv, appName: appName }, this.request, callback);
};

//
// ### function stop (appName, callback)
// #### @appName {string} Name of the application to stop.
// #### @callback {function} Continuation to pass control to when complete
// Stops the application with `name` for the authenticated user.
//
Apps.prototype.stop = function (appName, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat('stop');

  this.cloud({ method: 'POST', uri: argv, appName: appName }, this.request, callback);
};

//
// ### function available (app, callback)
// #### @app {Object} Application to check availability against.
// #### @callback {function} Continuation to respond to when complete.
// Checks the availability of the `app.name` / `app.subdomain` combo
// in the current Nodejitsu environment.
//
Apps.prototype.available = function (app, callback) {
  var appName = defaultUser.call(this, app.name),
      argv = ['apps'].concat(appName.split('/')).concat('available');

  this.request({ method: 'POST', uri: argv, body: app }, callback);
};

//
// ### function setDrones (app, callback)
// #### @app {string} Name of the application to set number of drones for.
// #### @drones {Number} Number of drones to run.
// #### @callback {function} Continuation to respond to when complete.
// Runs `app` on `drones` drones.
//
Apps.prototype.setDrones = function (appName, drones, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat('cloud'),
      cloud = [{ drones: drones }];

  this.cloud({ method: 'POST', uri: argv, body: cloud, appName: appName }, this.request, callback);
};

//
// ### function datacenter(appName, cloud, callback)
// #### @appName {String} Name of the application
// #### @cloud {Object} Cloud specification
// #### @callback {Function} Continuation to pass control to when complete
// Deploy the given application in a new datacenter.
//
Apps.prototype.datacenter = function (appName, cloud, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat('cloud'),
      self = this;

  if (!Array.isArray(cloud)) cloud = [cloud];

  //
  // As this API request needs to go to the correct datacenter, add the current
  // cloud call to our internal datacenter cache so it will target the correct
  // API
  //
  this.clouds[appName] = cloud;

  // Ensure the app is started before we try to set the datacenter.
  this.view(appName, function (err, current) {
    if (err) throw err;

    if (!current.config.cloud) {
      self.start(appName, executeCloud);
    }
    else {
      executeCloud();
    }
  });

  function executeCloud() {
    self.cloud({ method: 'POST', uri: argv, body: cloud, appName: appName }, self.request, function (err, result) {
      //
      // Assume that this call invalidates our cached datacenter endpoint, so
      // remove it, and it will be fetched again on the next call
      //
      delete self.clouds[appName];

      if (err) return callback(err);
      callback(err, result);
    });
  }
};
