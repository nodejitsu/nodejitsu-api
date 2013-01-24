var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

var cloud = [{ drones: 0, provider: 'jitsu', datacenter: 'foobar' }],
    endpoints = {
      "endpoints": {
        "jitsu": {
          "foobar": "api.mockjitsu.com"
        }
      }
    };

vows.describe('apps').addBatch(makeApiCall(
  'apps list',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/apps/tester')
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps list myUser',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/apps/myUser')
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps create',
  { name: 'myApp' },
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/apps/tester/myApp', { name: 'myApp' })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps view myApp',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/apps/tester/myApp')
      .reply(200, {
        app: {}
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps view myUser/myApp',
  function setup () {
    nock('https://api.mockjitsu.com')
      .get('/apps/myUser/myApp')
      .reply(200, {
        app: {}
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps update myUser/myApp',
  { foo: 'bar'},
  function setup () {
    nock('https://api.mockjitsu.com')
      .put('/apps/myUser/myApp', { foo: 'bar' })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps destroy myUser/myApp',
  function setup () {
    nock('https://api.mockjitsu.com')
      .destroy('/apps/myUser/myApp')
      .reply(200, {
        apps: []
      }, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps start myApp',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/apps/tester/myApp/start', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
      .get('/endpoints')
      .reply(200, endpoints, { 'x-powered-by': 'Nodejitsu' })
      .get('/apps/tester/myApp/cloud')
      .reply(200, cloud, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps restart myApp',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/apps/tester/myApp/restart', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps stop myApp',
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/apps/tester/myApp/stop', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'apps available',
  { name: 'myApp' },
  function setup () {
    nock('https://api.mockjitsu.com')
      .post('/apps/tester/myApp/available', { name: 'myApp'})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
