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
  } else if (opts.method !== 'GET') {
    opts.body = '{}';
  }

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
// ### function upload (uri, contentType, file, callback, success)
// #### @uri {Array} Locator for the Remote Resource
// #### @contentType {string} Content-Type header to use for the upload.
// #### @file {string} Path of the local file to upload.
// #### @success {function} Continuation to call upon successful transactions
// #### @callback {function} Continuation to call if errors occur.
// Makes a `POST` request to `this.remoteUri + uri` with the data in `file`
// as the request body. Short circuits to `callback` if the response
// code from Nodejitsu matches `failCodes`.
//
Client.prototype.upload = function (uri, contentType, file, callback, success) {
  var self = this,
      options,
      out,
      encoded,
      emitter = new EventEmitter(),
      proxy = self.options.get('proxy'),
      token = this.options.get('password') || this.options.get('api-token'),
      encoded = new Buffer(this.options.get('username') + ':' + token).toString('base64');

  fs.stat(file, function (err, stat) {
    if (err) {
      return callback(err);
    }

    emitter.emit('start', stat);

    options = {
      method: 'POST',
      uri: self.options.get('remoteUri') + '/' + uri.join('/'),
      headers: {
        'Authorization': 'Basic ' + encoded,
        'Content-Type': contentType,
        'Content-Length': stat.size
      },
      timeout: self.options.get('timeout') || 8 * 60 * 1000
    };

    if(proxy) {
      options.proxy = proxy;
    }

    out = self._request(options, function (err, response, body) {
      if (err) {
        return callback(err);
      }

      var statusCode, result, error;

      try {
        statusCode = response.statusCode;
        result = JSON.parse(body);
      }
      catch (ex) {
        // Ignore Errors
      }
      if (failCodes[statusCode]) {
        error = new Error('Nodejitsu Error (' + statusCode + '): ' + failCodes[statusCode]);
        error.result = result;
        return callback(error);
      }

      success(response, result);
    });

    out.on('request', function(request) {
      var buffer = 0;
      request.on('socket', function(socket) {
        var id = setInterval(function() {
          var data = socket._bytesDispatched || (socket.socket && socket.socket._bytesDispatched);
          emitter.emit('data', data - buffer);
          buffer = data;
          if(buffer >= stat.size) {
            clearInterval(id);
            emitter.emit('end');
          }
        },100);
      });
    });

    fs.createReadStream(file).pipe(out);
  });

  return emitter;
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

