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

It's possible to use either anonymous or named functions as well:

```js
runner.task('build', runner.parallel('jade:build', 'sass:build', function lessBuild ( done ) {
    // function name "lessBuild" is used as task name
    // otherwise <noname> is printed
    done();
}));
```

Batch tasks creation:
```js
Object.assign(runner.tasks,
    {
        taskName1: taskFunction1,
        taskName2: taskFunction2
    },
    {
        taskName3: taskFunction3,
        taskName4: taskFunction4
    }
);
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

Execute a task as a named or anonymous function:

```js
runner.run(function ( done ) {
    done();
});
```

Execute task series:

```js
runner.run(runner.parallel('lint', 'build'));
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

If you have any problems or suggestions please open an [issue](https://github.com/cjssdk/runner/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`cjs-runner` is released under the [MIT License](license.md).
