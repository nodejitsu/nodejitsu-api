'use strict';

/*
 * client.js: Client base for the Nodejitsu API clients.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var fs = require('fs'),
    request = require('request'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

//
// ### function Client (options)
// #### @options {Object} Options for this instance
// Constructor function for the Client base responsible
// for communicating with Nodejitsu's API
//
var Client = exports.Client = function (options) {
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
// ### @private function request (options, callback)
// #### @options {Object}
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

  var password = this.options.get('password') || this.options.get('api-token'),
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
  403: 'Forbidden',
  404: 'Item not found',
  405: 'Method not Allowed',
  409: 'Conflict',
  500: 'Internal Server Error',
  503: 'Service Unavailable'
};

