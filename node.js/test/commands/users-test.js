var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('users').addBatch(makeApiCall(
  'users create',
  { username: 'adam' },
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/users/adam', { username: 'adam' })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users available eve',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/users/eve/available')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users view abraham',
  function setup () {
    nock('http://api.mockjitsu.com')
      .get('/users/abraham')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users confirm',
  { username: 'noah' },
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/users/noah/confirm', { username: 'noah' })
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users forgot job',
  function setup () {
    nock('http://api.mockjitsu.com')
      .post('/users/job/forgot', {})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).addBatch(makeApiCall(
  'users update moses',
  { prophet: true },
  function setup () {
    nock('http://api.mockjitsu.com')
      .put('/users/moses', { prophet: true})
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
