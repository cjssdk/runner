Task runner
===========

[![build status](https://img.shields.io/travis/cjssdk/runner.svg?style=flat-square)](https://travis-ci.org/cjssdk/runner)
[![npm version](https://img.shields.io/npm/v/cjs-runner.svg?style=flat-square)](https://www.npmjs.com/package/cjs-runner)
[![dependencies status](https://img.shields.io/david/cjssdk/runner.svg?style=flat-square)](https://david-dm.org/cjssdk/runner)
[![devDependencies status](https://img.shields.io/david/dev/cjssdk/runner.svg?style=flat-square)](https://david-dm.org/cjssdk/runner?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/cjssdk)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://runkit.com/npm/cjs-runner)


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

Create a simple sync task:

```js
runner.task('lint', function () {
    // some actions
});
```

Create a simple async task:

```js
runner.task('build', function ( done ) {
    someAsyncCall(function () {
        // handle call result
        done();
    });
});
```

Create a task with serial subtasks:

```js
runner.task('serve', runner.serial('lint', 'build'));
```

Create a task with parallel subtasks:

```js
runner.task('build', runner.parallel('jade:build', 'sass:build'));
```

Execute a task by name:

```js
runner.run('lint');
```

Execute a task and handle the result:

```js
runner.run('lint', function ( error ) {
    if ( error ) {
        console.log('the task has failed!');
    }
});
```

Execute task chain:

```js
// no result check
runner.start();

// hook on task completion
runner.start(function () {
    console.log('finished');
});

// hook on task completion
runner.start(function ( error ) {
    if ( error ) {
        console.log('failed!');
    }
});
```

Hook on task start/stop events:

```js
runner.addListener('start', function ( event ) {
    // {id: 'lint'}
    console.log(event);
});

runner.addListener('finish', function ( event ) {
    // {id: 'lint', time: 1}
    console.log(event);
});
```


## Contribution ##

If you have any problem or suggestion please open an issue [here](https://github.com/cjssdk/runner/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`cjs-runner` is released under the [MIT License](license.md).
