Task runner
===========

[![Build Status](https://img.shields.io/travis/cjssdk/runner.svg?style=flat-square)](https://travis-ci.org/cjssdk/runner)
[![NPM version](https://img.shields.io/npm/v/cjs-runner.svg?style=flat-square)](https://www.npmjs.com/package/cjs-runner)
[![Dependencies Status](https://img.shields.io/david/cjssdk/runner.svg?style=flat-square)](https://david-dm.org/cjssdk/runner)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/cjssdk)


Set of methods to synchronize asynchronous operations.


## Installation ##

```bash
npm install cjs-runner
```

For test execution there are some additional dependencies:

```bash
sudo npm install -g mocha should
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

If you have any problem or suggestion please open an issue [here](https://github.com/cjssdk/runner/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`cjs-runner` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
