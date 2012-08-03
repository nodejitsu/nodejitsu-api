var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('logs').addBatch(makeApiCall(
  'logs byApp myApp 50',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/logs/tester/myApp', {
        from: "NOW-1DAY",
        until: "NOW",
        rows: "50"
      })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'logs byUser myUser 50',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/logs/myUser', {
        from: "NOW-1DAY",
        until: "NOW",
        rows: "50"
      })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
