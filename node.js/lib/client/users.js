'use strict';

/*
 * users.js: Client for the Nodejitsu users API.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var util = require('util'),
    Client = require('./client').Client,
    defaultUser = require('./helpers').defaultUser;

//
// ### function Users (options)
// #### @options {Object} Options for this instance
// Constructor function for the Users resource responsible
// with Nodejitsu's Users API
//
var Users = exports.Users = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Users, Client);

//
// ### function auth (callback)
// #### @callback {function} Continuation to pass control to when complete
// Tests the authentication of the user identified in this process.
//
Users.prototype.auth = function (callback) {
  this.request({ uri: ['auth'] }, function (err, result) {
    if (err) return callback(err)
    callback(err, true);
  });
};

//
// ### function create (user, callback)
// #### @user {Object} Properties for the new user.
// #### @callback {function} Continuation to pass control to when complete
// Creates a new user with the properties specified by `user`.
//
Users.prototype.create = function (user, callback) {
  this.request({ method: 'POST', uri: ['users', user.username], body: user }, callback);
};

//
// ### function available (username, callback)
// #### @username {string} Username to check availability for.
// #### @callback {function} Continuation to pass control to when complete
// Checks the availability of the specified `username`.
//
Users.prototype.available = function (username, callback) {
  this.request({ uri: ['users', username, 'available'] }, callback);
};

//
// ### function view (username, callback)
// #### @callback {function} Continuation to pass control to when complete.
// Retrieves data for the specified user.
//
Users.prototype.view = function (username, callback) {
  this.request({ uri: ['users', username] }, callback);
};

//
// ### function confirm (user, callback)
// #### @user {Object} Properties for the user to confirm.
// #### @callback {function} Continuation to pass control to when complete
// Confirms the specified `user` by sending the invite code in the `user` specified.
//
Users.prototype.confirm = function (user, callback) {
  this.request({ method: 'POST', uri: ['users', user.username, 'confirm'], body: user }, callback);
};

//
// ### function forgot (username, callback)
// #### @username {Object} username requesting password reset.
// #### @params {Object} Object containing shake and new password, if applicable.
// #### @callback {function} Continuation to pass control to when complete
// Request an password reset email.
//
Users.prototype.forgot = function (username, params, callback) {
  if (!callback && typeof params === 'function') {
    callback = params;
    params = {};
  }

  this.request({ method: 'POST', uri: ['users', username, 'forgot'], body: params }, callback);
};

//
// ### function update (username, object, callback)
// #### @username {Object} username requesting password reset.
// #### @object {Object} Updated information about user
// #### @callback {function} Continuation to pass control to when complete
// Update user account information.
//
Users.prototype.update = function (username, object, callback) {
  this.request({ method: 'PUT', uri: ['users', username], body: object }, callback);
};

//
// ### function destroy (username, callback)
// #### @username {String} User to delete
// #### @callback {function} Continuation to pass control to when complete
// Delete user account. Use with extreme caution.
//
// So sad to see you go.
//
Users.prototype.destroy = function (username, callback) {
  this.request({ method: 'DELETE', uri: ['users', username] }, callback);
};
