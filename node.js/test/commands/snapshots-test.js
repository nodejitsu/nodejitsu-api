var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    path = require('path'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('snapshots').addBatch(makeApiCall(
  'snapshots list myApp',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/apps/tester/myApp/snapshots')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'snapshots destroy myApp v0.0.0',
  function setup () {
    nock('https://api.mockjitsu.com')
      .delete('/apps/tester/myApp/snapshots/v0.0.0', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'snapshots activate myApp v0.0.0',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/apps/tester/myApp/snapshots/v0.0.0/activate', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  [
    'snapshots create myApp v0.0.0',
    path.join(__dirname, '../fixtures/snapshot.tgz')
  ].join(' '),
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/apps/tester/myApp/snapshots/v0.0.0', 'This is only a test.\n')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
