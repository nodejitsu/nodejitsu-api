var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('snapshots').addBatch(makeApiCall(
  'snapshots list myApp',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/apps/tester/myApp/snapshots')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
))
// TODO: Snapshots create. Needs a file as a fixture.
.addBatch(makeApiCall(
  'snapshots destroy myApp v0.0.0',
  function setup () {
    nock('http://api.mockjitsu.com')
      .delete('/apps/tester/myApp/snapshots/v0.0.0', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'snapshots activate myApp v0.0.0',
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/apps/tester/myApp/snapshots/v0.0.0/activate', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
