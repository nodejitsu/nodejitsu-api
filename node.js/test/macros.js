var createClient = require('../lib/client').createClient,
    client = createClient({
      username: 'tester',
      password: 'password',
      remoteUri: 'https://api.mockjitsu.com'
    }),
    assert = require('assert');

exports.makeApiCall = function () {
  var args = [].slice.call(arguments),
      data = [],
      that = {},
      method = client,
      testName,
      assertTxt,
      assertFn = function (err, res) {
        assert.isTrue(!err);
      },
      setupFn = function () {},
      context = {},
      i;


  args.forEach(function (arg) {
    switch (typeof arg) {
      case 'string':
        if (!testName) {
          testName = arg;

          i = 0;

          // Attempt to walk the command path in order to find the method the user
          // wants to call, dumping the rest of the arguments into "data".
          // Using .any as a short-circuiting "forEach" substitute.
          arg.split(' ').some(function (word) {
            if (method[word]) {
              that = method;
              method = method[word];
              i++;
            }
            else {
              data = data.concat(arg.split(' ').slice(i));
              return true;
            }
          });
        }
        else if (!assertTxt) {
          assertTxt = arg;
        }
        break;

      case 'function':
        // The below is written to take advantage of switch fallthrough.
        if (arg.name === 'setup') {
          setupFn = arg;
          break;
        }
        else if (arg.name === 'assertion') {
          assertfn = arg;
          break;
        }

      case 'object':
        data.push(arg);
        break;
      default:
        throw new Error(
          'The `makeApiCall` macro doesn\'t know how to interpret '
          + require('util').inspect(arg)
        );
        break;
    }
  });

  assertTxt = assertTxt || 'should respond with no error';

  context[testName] = {};

  context[testName].topic = function () {
    var cb = this.callback.bind(this);

    setupFn();

    method.apply(that, data.concat(function (err, res) {
      cb(err, res);
    }));
  };

  context[testName][assertTxt] = assertFn;

  return context;
}
