var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('databases').addBatch(makeApiCall(
  'databases create couch chair',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/databases/tester/chair', { type: 'couch'})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'databases get chair',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/databases/tester/chair')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'databases list',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/databases/tester')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'databases destroy chair',
  function setup () {
    nock('https://api.mockjitsu.com')
      .delete('/databases/tester/chair', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
