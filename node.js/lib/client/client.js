'use strict';

/*
 * client.js: Client base for the Nodejitsu API clients.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var fs = require('fs'),
    util = require('util'),
    request = require('request'),
    async = require('./helpers').async,
    EventEmitter = require('events').EventEmitter;

//
// ### function Client (options)
// #### @options {Object} Options for this instance
// Constructor function for the Client base responsible
// for communicating with Nodejitsu's API
//
var Client = exports.Client = function (options) {
  this.clouds = {};
  this.datacenters = {};
  this.options = options;
  this._request = request;

  if (typeof this.options.get !== 'function') {
    this.options.get = function (key) {
      return this[key];
    };
  }
};

util.inherits(Client, EventEmitter);

//
// ### function endpoints(callback)
// #### @callback {function} Continuation to respond to when complete.
// Retrieves a list of currenlty active datacenters and providers
//
Client.prototype.endpoints = function (callback) {
  var self = this;

  this.request({ uri: ['endpoints'] }, function (err, result) {
    if (err) return callback(err);

    self.datacenters = result.endpoints;
    callback(err, result.endpoints);
  });
};

//
// ### @private function cloud (options, api, callback)
// #### @options {Object} Configuration
// #### @api {Function} Private API that needs to be called, request / upload
// #### @callback {Function} Continuation
// Transforms the given API in to a cloud aware method assigning it to the
// correct datacenter.
//
Client.prototype.cloud = function (options, api, callback) {
  var self = this,
      flow = [];

  // We don't need to have any datacenter information for these types of calls
  if (options.remoteUri || !options.appName || !options.method || options.method === 'GET') {
    return api.call(this, options, callback);
  }

  //
  // Fetches the datacenter locations for the app
  //
  function locations(done) {
    var argv = ['apps', options.appName, 'cloud'];

    self.request({ uri: argv }, function apps(err, result) {
      if (err) return done(err);

      self.clouds[options.appName] = result;
      done();
    });
  }

  //
  // We don't have any datacenter data by default as it's only needed for
  // starting or stopping the application.
  //
  if (!Object.keys(this.datacenters).length) flow.push(this.endpoints.bind(this));

  //
  // Make sure that we have this app in our cloud cache so we know in which
  // datacenter it is.
  //
  if (!(options.appName in this.clouds)) flow.push(locations);

  //
  // Iterate over the possible steps.
  //
  async.iterate(flow, function completed(err) {
    if (err) return callback(err);

    // The returned clouds is an array of datacenters, iterate over them.
    async.map(self.clouds[options.appName], function iterate(cloud, done) {
      //
      // Clone the options to prevent race conditions.
      //
      var opts = Object.keys(options).reduce(function clone(memo, field) {
        memo[field] = options[field];
        return memo;
      }, {});

      if (!self.datacenters || !self.datacenters[cloud.provider]
          || !self.datacenters[cloud.provider][cloud.datacenter]) {
        return done(new Error('Unknown cloud: ' + cloud.provider + ' ' + cloud.datacenter));
      }

      opts.remoteUri = self.datacenters[cloud.provider][cloud.datacenter];
      if (!~opts.remoteUri.indexOf('http')) opts.remoteUri = 'https://'+ opts.remoteUri;

      api.call(self, opts, done);
    }, function ready(err, results) {
      if (err) {
        delete self.clouds[options.appName];
        return callback(err);
      }

      return results.length === 1
        ? callback(null, results[0])
        : callback(null, results)

      //
      // We probably want to figure out which calls went okay, and which one
      // failed when we get an error so we only have to retry that one.
      //
    });
  });
};

//
// ### @private function request (options, callback)
// #### @options {Object} Configuration
// #### @callback {function} Continuation to call if errors occur.
// Makes a request to the remoteUri + uri using the HTTP and any body if
// supplied.
//
// Options:
// - method {String}: HTTP method to use
// - uri {Array}: Locator for the remote resource
// - remoteUri {String}: Location of the remote API
// - timeout {Number}: Request timeout
// - body {Array|Object}: JSON request body
// - headers {Object}: Headers you want to set
//
Client.prototype.request = function (options, callback) {
  options = options || {};

  var password = this.options.get('password') || this.options.get('apiToken'),
      auth = new Buffer(this.options.get('username') + ':' + password).toString('base64'),
      proxy = this.options.get('proxy'),
      self = this,
      opts = {};

  opts = {
    method: options.method || 'GET',
    uri: (options.remoteUri || this.options.get('remoteUri')) + '/' + options.uri.join('/'),
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    timeout: options.timeout || this.options.get('timeout') || 8 * 60 * 1000,
    rejectUnauthorized: this.options.get('rejectUnauthorized')
  };

  if (options.body) {
    try { opts.body = JSON.stringify(options.body); }
    catch (e) { return callback(e); }
  } else if (opts.method !== 'GET' && options.body !== false) {
    opts.body = '{}';
  }

  if (options.headers) Object.keys(options.headers).forEach(function each(field) {
    opts.headers[field] = options.headers[field];
  });

  if (proxy) opts.proxy = proxy;

  this.emit('debug::request', opts);

  return this._request(opts, function requesting(err, res, body) {
    if (err) return callback(err);

    var poweredBy = res.headers['x-powered-by'],
        result, statusCode, error;

    try {
      statusCode = res.statusCode;
      result = JSON.parse(body);
    } catch (e) {}

    self.emit('debug::response', { statusCode: statusCode, result: result });

    if (!self.options.get('ignorePoweredBy') && !poweredBy || !~poweredBy.indexOf('Nodejitsu')) {
      error = new Error('The Nodejitsu-API requires you to connect the Nodejitsu\'s stack (api.nodejitsu.com)');
      error.statusCode = 403;
      error.result = '';
    } else if (failCodes[statusCode]) {
      error = new Error('Nodejitsu Error (' + statusCode + '): ' + failCodes[statusCode]);
      error.statusCode = statusCode;
      error.result = result;
    }

    // Only add the response argument when people ask for it
    if (callback.length === 3) return callback(error, result, res);
    callback(error, result);
  });
};

//
// ### @private function upload (options, callback)
// #### @options {Object}
// #### @callback {function} Continuation to call if errors occur.
// Makes a POST request to the remoteUri + uri using the HTTP and any body if
// supplied. It defers the call the private request method.
//
// Options:
// - uri {Array}: Locator for the remote resource
// - remoteUri {String}: Location of the remote API
// - timeout {Number}: Request timeout
// - file: {String} path to the file you want to upload
//
Client.prototype.upload = function (options, callback) {
  options = options || {};

  var progress = new EventEmitter(),
      self = this;

  fs.stat(options.file, function fstat(err, stat) {
    if (err) return callback(err);

    var size = stat.size;

    // Set the correct headers
    if (!options.headers) options.headers = {};
    options.headers['Content-Length'] = size;
    options.headers['Content-Type'] = options.contentType || 'application/octet-stream';

    // And other default options to do a successful post
    if (!options.method) options.method = 'POST';
    options.body = false;

    // Defer all the error handling to the request method
    var req = self.request(options, callback);
    if (!req) return;

    // Notify that we have started the upload procedure and give it a reference
    // to the stat.
    progress.emit('start', stat);

    req.once('request', function requested(request) {
      request.once('socket', function data(socket) {
        var buffer = 0;

        var interval = setInterval(function polling() {
          var data = socket._bytesDispatched || (socket.socket && socket.socket._bytesDispatched);

          if (data) {
            progress.emit('data', data - buffer);
            buffer = data;
          }

          if (buffer >= size) {
            clearInterval(interval);
            progress.emit('end');
          }
        }, 100);
      });
    });

    fs.createReadStream(options.file).pipe(req);
  });

  return progress;
};

var failCodes = {
  400: 'Bad Request',
  401: 'Not Authorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Item not found',
  405: 'Method not Allowed',
  409: 'Conflict',
  500: 'Internal Server Error',
  503: 'Service Unavailable'
};
