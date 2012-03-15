var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

nock.recorder.rec();

vows.describe('apps').addBatch(makeApiCall(
  'apps list tester/differentApp',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get()
      .reply(200, {})
  }
))
