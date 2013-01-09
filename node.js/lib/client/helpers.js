'use strict';

//
// ### function defaultUser (appName)
// #### @appName {String} App name
//
// A helper to prepend a default username.
// needs 'this' to be able to options.get('username').
//
exports.defaultUser = function (appName) {
  if (appName.search('/') === -1) {
    appName = this.options.get('username') + '/' + appName;
  }

  return appName;
};

//
// Async flow control helper function, to clean up some messy code.
//
exports.async = {
  //
  // ### function iterate (arr, callback)
  // #### @arr {Array} Array of functions to call
  // #### @callback {Function} Completion function
  // Iterates of over the array of functions and triggers the callback once it
  // has been completed or when an error occures.
  //
  iterate: function iterate(arr, callback) {
    callback = callback || noop;

    var completed = 0,
        expected = arr.length;

    if (!expected) return callback();

    (function iterator() {
      arr[completed](function next(err) {
        if (err) return callback(err);
        if (++completed !== expected) return iterator();

        callback();
      });
    }());
  },

  //
  // ### function map (arr, iterator, callback)
  // #### @arr {Array} Array of functions to call
  // #### @callback {Function} Completion function
  // Async mapping
  //
  map: function map(arr, iterator, callback) {
    callback = callback || noop;

    var results = [],
        completed = 0,
        expected = arr.length;

    if (!expected) return callback();

    arr.forEach(function loop(something, index) {
      iterator(something, function completion(err, value) {
        if (err) {
          callback(err, results);
          return callback = noop;
        }

        results[index] = value;
        if (++completed === expected) {
          callback(undefined, results);
        }
      });
    });
  }
};

//
// Simple dummy function that is used when no callback is provided
//
function noop() {}
