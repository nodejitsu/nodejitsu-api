'use strict';

/*
 * tokens.js: Client for the Nodejitsu Tokens API.
 *
 * (C) 2013, Nodejitsu Inc.
 *
 */

var util = require('util'),
    Client = require('./client').Client,
    defaultUser = require('./helpers').defaultUser;

//
// ### function Tokens (options)
// #### @options {Object} Options for this instance
// Constructor function for the Tokens resource responsible
// with Nodejitsu's Tokens API
//
var Tokens = exports.Tokens = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Tokens, Client);

//
// ### function list (username, callback)
// #### @callback {function} Continuation to pass control to when complete
// Lists all tokens for the authenticated user
//
Tokens.prototype.list = function (username, callback) {
  if (arguments.length === 1) {
    callback = username;
    username = this.options.get('username');
  }

  this.request({ uri: ['users', username, 'tokens'] }, callback);
};

//
// ### function create (username, tokenID, callback)
// #### @token String Properties for the new token.
// #### @callback {function} Continuation to pass control to when complete
// Creates a new token with the properties specified by `tokenID` if provided.
//
Tokens.prototype.create = function (username, tokenID, callback) {
  if(arguments.length === 1) {
    callback = username;
    tokenID = null;
    username = this.options.get('username');
  }

  if(arguments.length === 2) {
    callback = tokenID;
    tokenID = username;
    username = this.options.get('username');
  }

  if(tokenID !== null){
    this.request({ method: 'PUT', uri: ['users', username, 'tokens', tokenID] }, callback);
  } else {
    this.request({ method: 'POST', uri: ['users', username, 'tokens'] }, callback);
  }
};


//
// ### function destroy (token, callback)
// #### @token {Object} Properties for the new token.
// #### @callback {function} Continuation to pass control to when complete
// Destroys a token with the id specified by `token`.
//
Tokens.prototype.destroy = function (username, tokenID, callback) {
  if(arguments.length === 2) {
    callback = tokenID;
    tokenID = username;
    username = this.options.get('username');
  }

  this.request({ method: 'DELETE', uri: ['users', username, 'tokens', tokenID] }, callback);
};
