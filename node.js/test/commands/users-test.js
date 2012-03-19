var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('users').addBatch(makeApiCall(
  'users create',
  { username: 'Adam' },
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/users/adam', { username: 'Adam' })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users available Eve',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/users/eve/available')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users view Abraham',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/users/abraham')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users confirm',
  { username: 'Noah' },
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/users/noah/confirm', { username: 'Noah' })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users forgot Job',
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/users/job/forgot', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users update Moses',
  { prophet: true },
  function setup () {
    nock('http://api.mockjitsu.com')
      .put('/users/moses', { prophet: true})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
