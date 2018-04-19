Task runner
===========

[![build status](https://img.shields.io/travis/cjssdk/runner.svg?style=flat-square)](https://travis-ci.org/cjssdk/runner)
[![npm version](https://img.shields.io/npm/v/cjs-runner.svg?style=flat-square)](https://www.npmjs.com/package/cjs-runner)
[![dependencies status](https://img.shields.io/david/cjssdk/runner.svg?style=flat-square)](https://david-dm.org/cjssdk/runner)
[![devDependencies status](https://img.shields.io/david/dev/cjssdk/runner.svg?style=flat-square)](https://david-dm.org/cjssdk/runner?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/cjssdk)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/cjs-runner)


Set of methods to synchronize asynchronous operations.


## Installation ##

```bash
npm install cjs-runner
```


## Usage ##

Add to the scope:

```js
var Runner = require('cjs-runner'),
    runner = new Runner();
```

Create a simple task:

```js
runner.task('make', function () {
    // some actions
});
```

```js
t1 = runner.task('static', runner.serial('jade:build', 'sass:build'));

t1 = runner.task({
    name: 'static',
    dependency: ['jade:build', 'sass:build']
});

runner.start(['build']);
```


## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/cjssdk/runner/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`cjs-runner` is released under the [MIT License](license.md).
