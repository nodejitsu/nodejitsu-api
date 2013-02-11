# nodejitsu-api

The `nodejitsu-api` is a module that allows you to communicate with the our
[RESTful API][REST]

## Installation:

This module is published in NPM:

```
  npm install nodejitsu-api --save
```

The `--save` tells NPM to automatically add it to your `package.json` file

## API documentation

Before you can use the API you need to create a new API client. In this example
we are going to assume that `foo` is your username and `bar` is the password of
Nodejitsu account you want to control.

### api.createClient(options)

The `createClient` method generates a new API client. It accepts an options
argument which is used to configure the client.

##### options:

- `username` **string** The username of your Nodejitsu account
- `password` **string** The password or auth token of your account
- `remoteUri` **string** The Nodejitsu API resource
- `debug` **boolean** Output debugging information to the console
- `proxy` **string** HTTP proxy to connect over
- `timeout` **number** How long can a single API requests before we time it out
- `ignorePoweredBy` **boolean** Ignore the check for the `x-powered-by` header

This options argument can either be an object with the properties specified
above or a [nconf][nconf] object.

The `remoteUri` argument is a required argument. Most API calls also require the
`username` and `password` to be specified. There a couple of API call where this
is not required, this is documented by the relevant API calls.

```js
var api = require('nodejitsu-api');

// Construct a new client.
var client = api.createClient({
  username: 'foo',
  password: 'bar',
  remoteUri: 'https://api.nodejitsu.com'
});
```

### client

The API calls are generally constructed as `resource` and `action`:

``` js
client.resource.action('data', function (err, result) {
  if (err) {
    throw err;
  }

  // Use the result
});
```

The following API resources are exposes in the module:

- [apps][apps] Manage your application instances.
  - [apps.available][apps.available]
  - [apps.list][apps.list]
  - [apps.create][apps.create]
  - [apps.view][apps.view]
  - [apps.update][apps.update]
  - [apps.start][apps.start]
  - [apps.stop][apps.stop]
  - [apps.restart][apps.restart]
  - [apps.setDrones][apps.setdrones]
  - [apps.datacenter][apps.datacenter]
  - [apps.destroy][apps.destroy]
  - [apps.endpoints][apps.endpoints]
- [databases][databases] Manage your databases.
  - [databases.create][databases.create]
  - [databases.get][databases.get]
  - [databases.list][databases.list]
  - [databases.destroy][databases.destroy]
- [logs][logs] Manage your application logs.
  - [logs.byApp][logs.byapp]
  - [logs.byUser][logs.byuser]
- [snapshots][snapshots] Manage your application snapshots.
  - [snapshots.list][snapshots.list]
  - [snapshots.create][snapshots.create]
  - [snapshots.fetch][snapshots.fetch]
  - [snapshots.destroy][snapshots.destroy]
  - [snapshots.activate][snapshots.activate]
- [users][users] Manage your Nodejitsu account.
- [users.auth][users.auth]
- [users.create][users.create]
- [users.available][users.available]
- [users.view][users.view]
- [users.confirm][users.confirm]
- [users.forgot][users.forgot]
- [users.update][users.update]
- [users.destroy][users.destroy]

[apps]: #clientapps
[apps.available]: #clientappsavailable
[apps.list]: #clientappslist
[apps.create]: #clientappscreate
[apps.view]: #clientappsview
[apps.update]: #clientappsupdate
[apps.start]: #clientappsstart
[apps.stop]: #clientappsstop
[apps.restart]: #clientappsrestart
[apps.setdrones]: #clientappssetDrones
[apps.datacenter]: #clientappsdatacenter
[apps.destroy]: #clientappsdestroy
[apps.endpoints]: #clientappsendpoints

[databases]: #clientdatabases
[databases.create]: #clientdatabasescreate
[databases.get]: #clientdatabasesget
[databases.list]: #clientdatabaseslist
[databases.destroy]: #clientdatabasesdestroy

[logs]: #clientlogs
[logs.byapp]: #clientlogsbyapp
[logs.byUser]: #clientlogsbyuser

[snapshots]: #clientsnapshots
[snapshots.list]: #clientsnapshots.list
[snapshots.create]: #clientsnapshots.create
[snapshots.fetch]: #clientsnapshots.fetch
[snapshots.destroy]: #clientsnapshots.destroy
[snapshots.activate]: #clientsnapshots.activate

[users]: #clientusers
[users.auth]: #clientusersauth
[users.create]: #clientuserscreate
[users.available]: #clientusersavailable
[users.view]: #clientusersview
[users.confirm]: #clientusersconfirm
[users.forgot]: #clientusersforgot
[users.update]: #clientusersupdate
[users.destroy]: #clientusersdestroy

### client.app
#### client.apps.available

Checks if the available of the applications name and sub domain is currently
taken in Nodejitsu.

##### Arguments

- `app` **string** The application name
- `callback` **function** 

```js
client.app.available('my-application', function (err, data) {
  console.log(data);
});
```

#### client.apps.list

List all the applications for the authenticated user.

##### Arguments

- `username` **string** The username, which is optional and will default to the
  configured username
- `callback` **function** The callback receives an array of your applications

```js
client.app.list('my-application', function (err, data) {
  console.log(data);
});
```

#### client.apps.create

Create an application from the specified `package.json` object.

##### Arguments

- `app` **object** The package.json
- `callback` **function**

```js
var app = require('./package.json'); // requires your package.json as example
client.apps.create(app, function (err, data) {
  console.log(data);
});
```

#### client.apps.view

Views the application details for one specific application.

##### Arguments

- `app` **string** Name of the application
- `callback` **function** The callback receives your application details

```js
client.apps.view('my-application-name', function (err, data) {
  console.log(data);
});
```

#### client.apps.update

Updates the the application details.

##### Arguments

- `app` **string** Name of the application
- `changes` **Object** Properties that need to be updated for this application
- `callback` **function**

```js
client.apps.update('my-application-name', { name: 'foo' }, function (err, data) {
  console.log(data);
});
```

#### client.apps.start

Start the application.

##### Arguments

- `app` **string** Name of the application
- `callback` **function**

```js
client.apps.start('my-application-name', function (err, data) {
  console.log(data);
});
```

#### client.apps.stop

Stop the application.

##### Arguments

- `app` **string** Name of the application
- `callback` **function**

```js
client.apps.stop('my-application-name', function (err, data) {
  console.log(data);
});
```

#### client.apps.restart

Restarts the application without changing a drone. Where stopping and starting
an application could result in deployment on a different drone.

##### Arguments

- `app` **string** Name of the application
- `callback` **function**

```js
client.apps.stop('my-application-name', function (err, data) {
  console.log(data);
});
```

#### client.apps.setDrones

Run the application on `x` amount of drones on the Nodejitsu servers.

##### Arguments

- `app` **string** Name of the application
- `drones` **number** The amount of drones the application needs to run on
- `callback` **function**

```js
client.apps.setDrones('my-application-name', 10, function (err, data) {
  console.log(data);
});
```

#### client.apps.datacenter

Move the application to a new datacenter.

##### Arguments

- `app` **string** Name of the application
- `cloud` **object** The datacenter configuration
  - `provider` **string** Name of the cloud provider
  - `datacenter` **string** Data center identifier
  - `drones` **number** The amount of drones you want to start on this datacenter
- `callback` **function**

```js
var cloud = {
  provider: 'joyent',
  datacenter: 'eu-ams-1',
  drones: 6
}
client.apps.datacenter('my-application-name', cloud, function (err, data) {
  console.log(data);
});
```

#### client.apps.destroy

Destroys the application.

##### Arguments

- `app` **string** Name of the application
- `callback` **function**

```js
client.apps.destroy('my-application-name', function (err, data) {
  console.log(data);
});
```

#### client.apps.endpoints

Get a list of all datacenter providers and datacenter identifiers.
**Please note: this method doesn't require any authentication.**

##### Arguments

- `callback` **function**

```js
client.apps.destroy('my-application-name', function (err, data) {
  console.log(data);
});
```

### client.databases
#### client.databases.create

Create a new database. These databases are created by third party providers you
can find more information about each database provider in
[webops/databases][webops/databases]

##### Arguments

- `type` **string** Database type (mongo, monghq, redis, redistogo, couch)
- `name` **string** Name of the database
- `callback` **function** 

```js
client.databases.create('redis', 'my-iriscouch-redis-db', function (err, data) {
  console.log(data);
});
```

#### client.databases.get

Get the database information which contains the connection details

##### Arguments

- `name` **string** Name of the database
- `callback` **function** 

```js
client.databases.get('my-iriscouch-redis-db', function (err, data) {
  console.log(data);
});
```

#### client.databases.list

Get the all databases and their information.

##### Arguments

- `username` **string** The username, which is optional and will default to the
  configured username
- `callback` **function**

```js
client.databases.list('username', function (err, data) {
  console.log(data);
});
```

#### client.databases.destroy

Destroy the specified database.

##### Arguments

- `name` **string** Name of the database you want to destroy
- `callback` **function**

```js
client.databases.list('username', function (err, data) {
  console.log(data);
});
```

### client.logs
#### client.logs.byApp

Fetches the logs for the given application.

##### Arguments

- `name` **string** Name of the application
- `amount` **number** The amount logs to retrieve
- `callback` **function** 

```js
client.logs.byApp('my-application', 50, function (err, data) {
  console.log(data);
});
```

#### client.logs.byUser

Fetches the logs for every application for the specified user.

##### Arguments

- `username` **string** The username, which is optional and will default to the
  configured username
- `amount` **number** The amount logs to retrieve
- `callback` **function** 

```js
client.logs.byUser('foo', 50, function (err, data) {
  console.log(data);
});
```

### client.snapshots
#### client.snapshots.list

Lists all snapshots for the given application

##### Arguments

- `name` **string** Name of the application
- `callback` **function** 

```js
client.snapshots.list('my-application', function (err, data) {
  console.log(data);
});
```

#### client.snapshots.create

Uploads a new snapshot for the application. This method assumes that you have a
properly packed `.tgz` application on your system. The `.tgz` should have the
same internal structure as the result of an `npm pack`.

##### Arguments

- `name` **string** Name of the application that receives the snapshot
- `snapshotname`: **string** Name of the snapshot
- `location`: **string** absolute path to the `.tgz` snapshot
- `callback` **function** 

```js
client.snapshots.create('my-application', '0.1.0', '/app.tgz', function (err, data) {
  console.log(data);
});
```

Please note that this method returns an event emitter which you can use to track
the progress of the upload. This event emitter emits and `data` event with the
amount of data uploaded and emits the `end` event once the upload been
completed.

#### client.snapshots.fetch

Fetches the snapshot from your application. Please note that these snapshots are
the actual state of the application that is ran on the drones, so these will
contain the `node_modules` folder.

##### Arguments

- `name` **string** Name of the application
- `snapshotname` **string** Name of the snapshot that you want to download
- `callback` **function** 

```js
client.snapshots.fetch('my-application', '0.1.0', function (err, data) {
  console.log(data);
});
```

This function returns the Stream that fetches the snapshot. You can use
this Stream to `Stream.pipe` it to a file on your system. The callback would
only indicate a successful fetch.

#### client.snapshots.destroy

Destroy the snapshot.

##### Arguments

- `name` **string** Name of the application
- `snapshotname` **string** Name of the snapshot that you want to download
- `callback` **function** 

```js
client.snapshots.destroy('my-application', '0.1.0', function (err, data) {
  console.log(data);
});
```

#### client.snapshots.activate

Activates a snapshot. This allows you to roll back to a old version when
something goes wrong in your application.

##### Arguments

- `name` **string** Name of the application
- `snapshotname` **string** Name of the snapshot that you want to download
- `callback` **function** 

```js
client.snapshots.activate('my-application', '0.0.45', function (err, data) {
  console.log(data);
});
```
### client.users
#### client.users.auth

Tests if the users login details are valid.

##### Arguments

- `callback` **function** 

```js
client.users.auth(function (err, authenticated) {
  console.log(authenticated);
});
```

#### client.users.create

Register a new Nodejitsu account.
**Please note: this method doesn't require any authentication.**

##### Arguments

- `account` **object** account details
  - `username` **string** username
  - `passowrd` **string** password
  - `email` **string** e-mail address that receives the verification code
- `callback` **function** 

```js
var account = {
  username: 'foo',
  password: 'bar',
  email: 'foo@example.com'
};

client.users.create(account, function (err, data) {
  console.log(data);
});
```

#### client.users.available

Test if the username is available.
**Please note: this method doesn't require any authentication.**

##### Arguments

- `username` **string** username
- `callback` **function** 

```js
client.users.available('foo', function (err, data) {
  console.log(data);
});
```

#### client.users.view

Retrieves the user details.

##### Arguments

- `username` **string** username
- `callback` **function** 

```js
client.users.view('foo', function (err, data) {
  console.log(data);
});
```

#### client.users.confirm

Confirm the e-mail address of the user.
**Please note: this method doesn't require any authentication.**

##### Arguments

- `user` **object** confirmation details
  - `username` **string** the username that we are confirming
  - `inviteCode` **string** the inviteCode that was send to the users e-mail
- `callback` **function** 

```js
var user = {
  username: 'foo',
  inviteCode: 'foo-bar-bnanan-trololol'
};

client.users.confirm(user, function (err, data) {
  console.log(data);
});
```
#### client.users.forgot

Request a password reset e-mail

##### Arguments

- `username` **string** username
- `callback` **function** 

```js
client.users.forgot('foo', function (err, data) {
  console.log(data);
});
```

#### client.users.update

Updates the account information.

##### Arguments

- `username` **string** username
- `changes` **Object** Properties that need to be updated for this user.
- `callback` **function** 

```js
client.users.update('foo', changes, function (err, data) {
  console.log(data);
});
```

#### client.users.destroy

Removes your account from the Nodejitsu platform. Use with extreme caution. This
will also destroy all the applications that you are running and databases that
you have created. **Once you call this method, there is no way back and no
option to undo this**.

##### Arguments

- `username` **string** username
- `callback` **function** 

```js
client.users.destroy('foo', function (err, data) {
  console.log(data);
});
```

## Tests

All tests are written with [vows](http://vowsjs.org) and should be run with
[npm](http://npmjs.org):

```bash
$ npm test
```

## License

MIT.

[REST]: https://github.com/nodejitsu/handbook/tree/master/API.md
[nconf]: https://github.com/flatiron/nconf
[webops/databases]: https://webops.nodejitsu.com/databases
