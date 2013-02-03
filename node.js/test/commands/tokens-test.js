var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;//nock.recorder.rec();

vows.describe('tokens').addBatch(makeApiCall(
  'tokens list',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/users/tester/tokens')
      .reply(200, {"apiTokens":{}}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'tokens list adam',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/users/adam/tokens')
      .reply(200, {"apiTokens":{}}, { 'x-powered-by': 'Nodejitsu' });
  }
)).addBatch(makeApiCall(
  'tokens create',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/users/tester/tokens', {})
      .reply(201, {"operation":"insert"}, { 'x-powered-by': 'Nodejitsu' });
  }
)).addBatch(makeApiCall(
  'tokens create test-token',
  function setup () {
    nock('https://api.mockjitsu.com')
      .put('/users/tester/tokens/test-token', {})
      .reply(201, {"operation":"insert"}, { 'x-powered-by': 'Nodejitsu' });
  }
)).addBatch(makeApiCall(
  'tokens destroy test-token',
  function setup () {
    nock('https://api.mockjitsu.com')
      .delete('/users/tester/tokens/test-token', {})
      .reply(201, {"ok":true,"id":"test-token"}, { 'x-powered-by': 'Nodejitsu' });
  }
))/*.addBatch(makeApiCall(
  'tokens create adam',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/users/adam/tokens', {})
      .reply(201, {"operation":"insert"}, { 'x-powered-by': 'Nodejitsu' });
  }
))*/.addBatch(makeApiCall(
  'tokens create adam test-token',
  function setup () {
    nock('https://api.mockjitsu.com')
      .put('/users/adam/tokens/test-token', {})
      .reply(201, {"operation":"insert"}, { 'x-powered-by': 'Nodejitsu' });
  }
)).addBatch(makeApiCall(
  'tokens destroy adam test-token',
  function setup () {
    nock('https://api.mockjitsu.com')
      .delete('/users/adam/tokens/test-token', {})
      .reply(201, {"ok":true,"id":"test-token"}, { 'x-powered-by': 'Nodejitsu' });
  }
)).export(module);
