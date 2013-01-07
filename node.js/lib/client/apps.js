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
  this.clouds = {};
  this.datacenters = {};

  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Apps, Client);

//
// ### @private function request
// #### @options {Object}
// #### @callback {function} Continuation to call if errors occur.
// Overrites the default request logic to make it aware of datacenter locations
//
Apps.prototype.request = function (options, callback) {
  var self = this,
      flow = [];

  // we don't need to have any datacenter information for these types of calls
  if (options.remoteUri || !options.app || !options.method || options.method === 'GET') {
    return Client.prototype.request.apply(this, arguments);
  }

  //
  // We don't have any datacenter data by default as it's only needed for
  // starting or stopping the application.
  //
  if (!Object.keys(this.datacenters)) flow.push(function (done) {
    self.endpoints(function endpoints(err, datacenters) {
      if (err) return done(err);

      self.datacenters = datacenters;
      done();
    });
  });

  //
  // Make sure that we have this app in our cloud cache so we know in which
  // datacenter it is.
  //
  if (!(options.app in this.clouds)) flow.push(function (done) {
    self.list(function apps(err, applications) {
      if (err) return done(err);

      self.clouds = applications.reduce(function reduce(memo, app) {
        memo[app] = app.cloud;
      }, {});

      done();
    });
  });

  //
  // Upgrade the remoteUri to the correct location of the datacenter or we will
  // not be able to communicate correctly with it.
  //
  flow.push(function (done) {
    var cloud = self.clouds[options.app];

    options.remoteUri = self.datacenters[cloud.provider][cloud.datacenter];
    Client.prototype.request.call(self, options, callback);
  });

  var completed = 0;
  (function iterate() {
    flow[completed](function next(err) {
      if (err) {
        callback(err);
      } else {
        completed++;
        if (completed !== flow.length) iterate();
      }
    });
  }());
};

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

  this.request({ uri: ['apps', username] }, function (err, result, res) {
    if (err) return callback(err);

    callback(err, result.apps);
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
  var argv = ['apps'].concat(appName.split('/'));

  this.request({ uri: argv }, function (err, result, res) {
    if (err) return callback(err);

    callback(err, result.app);
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

  this.request({ method: 'DELETE', uri: argv }, callback);
};

//
// ### function start (appName, callback)
// #### @appName {string} Name of the application to start
// #### @callback {function} Continuation to pass control to when complete
// Starts the application with `name` for the authenticated user.
//
Apps.prototype.start = function (appName, callback) {
  appName = defaultUser.call(this, appName);
  var argv = ['apps'].concat(appName.split('/')).concat('start');

  this.request({ method: 'POST', uri: argv }, callback);
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

  this.request({ method: 'POST', uri: argv }, callback);
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

  this.request({ method: 'POST', uri: argv }, callback);
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
  var argv = ['apps'].concat(appName.split('/')).concat('cloud');

  this.request({ method: 'POST', uri: argv, body: [{ drones: drones }] }, callback);
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
  var argv = ['apps'].concat(appName.split('/')).concat('cloud');

  if (!Array.isArray(cloud)) cloud = [cloud];

  this.request({ method: 'POST', uri: argv, body: cloud }, callback);
};

//
// ### function endpoints(callback)
// #### @callback {function} Continuation to respond to when complete.
// Retrieves a list of currenlty active datacenters and providers
//
Apps.prototype.endpoints = function (callback) {
  this.request({ uri: ['endpoints'] }, function (err, result) {
    if (err) return callback(err);

    callback(err, result.endpoints);
  });
};
