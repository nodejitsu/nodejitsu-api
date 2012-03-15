var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('apps').addBatch(makeApiCall(
  'apps list',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/apps/tester')
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps list myUser',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/apps/myUser')
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps create',
  {
    name: 'myApp'
  },
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/apps/tester/myApp', { name: 'myApp' })
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps view myApp',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/apps/tester/myApp')
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps view myUser/myApp',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/apps/myUser/myApp')
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
