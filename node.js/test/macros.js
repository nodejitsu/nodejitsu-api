var createClient = require('../../lib/client').createClient,
    client = new createClient({
      username: 'tester',
      password: 'password',
      remoteUri: 'http://api.mockjitsu.com'
    }),
    assert = require('assert');

exports.makeApiCall = function () {
  var args = [].slice.call(arguments),
      data,
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
    var method;

    switch (typeof arg) {
      case 'string':
        if (!testName) {
          testName = arg;

          i = 0;

          // Attempt to walk the command path in order to find the method the user
          // wants to call, dumping the rest of the arguments into "data".
          // Using .any as a short-circuiting "forEach" substitute.
          arg.split(' ').any(function (word) {
            if (method[word]) {
              method = method[word];
              i++;
            }
            else {
              data = arg.split(' ').slice(i).join(' ');
              return true;
            }
          });
        } else if (!assertTxt) {
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

    method.call(client, data, this.callback);
  };

  context[testName][assertTxt] = assertFn;

  return context;
}
