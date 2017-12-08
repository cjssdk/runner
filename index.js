/**
 * @module cjs-runner
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Emitter  = require('cjs-emitter'),
    parallel = require('cjs-async/parallel'),
    serial   = require('cjs-async/serial');


/**
 *
 *
 * @constructor
 * @extends Emitter
 */
function Runner () {
    console.assert(typeof this === 'object', 'must be constructed via new');

    // parent constructor call
    Emitter.call(this);

    this.tasks = {};
    this.tree  = {};
}


// inheritance
Runner.prototype = Object.create(Emitter.prototype);
Runner.prototype.constructor = Runner;


/**
 * Create a task with the given identifier.
 *
 * @param {string} id task name
 * @param {function} body task method
 *
 * @return {function} task
 *
 * //@fires Runner#clear
 */
Runner.prototype.task = function ( id, body ) {
    console.assert(arguments.length === 2, 'wrong arguments number');
    console.assert(typeof id === 'string', 'wrong id type');
    console.assert(id.length > 0, 'empty id');
    console.assert(typeof body === 'function', 'body should be a function');

    this.tasks[id] = body;
    body.id = id;

    //return body;
};

//function done ( instance, fn ) {
//    // mark finished
//    fn.running = false;
//
//    // there are some listeners
//    if ( instance.events['finish'] ) {
//        // notify listeners
//        instance.emit('finish', {id: fn.id});
//        //console.log('finish', fn.id);
//    }
//}
//
//function wrap ( instance, fn ) {
//    // is there a callback for task?
//    if ( fn.length === 0 ) {
//        // start task sync
//        fn();
//        // finish
//        done();
//    } else {
//        // start task async
//        fn(done);
//    }
//}


Runner.prototype.wrap = function ( task ) {
    var self = this,
        time;

    return function ( cb ) {
        var done = function () {
                // mark finished
                task.running = false;

                time = Date.now() - time;
                /*console.log('finish', task.id, time);/**/

                // there are some listeners
                if ( self.events['finish'] ) {
                    // notify listeners
                    self.emit('finish', {id: task.id, time: time});
                }

                // callback from user or
                if ( cb && typeof cb === 'function' ) {
                    cb.apply(null, arguments);
                }
            },
            result;

        // exist and not already executing
        if ( task && !task.running ) {
            // mark to prevent multiple starts
            task.running = true;

            time = Date.now();
            /*console.log('start', task.id);/**/

            // there are some listeners
            if ( self.events['start'] ) {
                // notify listeners
                self.emit('start', {id: task.id});
            }

            // is there a callback for task?
            if ( task.length === 0 ) {
                // start task sync
                result = task();
                // finish
                done(result === false);
            } else {
                //console.log(task.id);
                // start task async
                result = task(done);
            }
        }

        return result;
    };
};


Runner.prototype.parallel = function () {
    var self  = this,
        tasks = Array.prototype.slice.call(arguments),
        func;

    if ( tasks.length === 0 ) {
        return null;
    }

    func = function ( done ) {
        var readyTasks = [];

        // wrap not running tasks only
        tasks.forEach(function ( task ) {
            task = self.tasks[task] || task;

            if ( task && !task.running ) {
                readyTasks.push(
                    function ( done ) {
                        return self.run(task.id, done);
                    }
                );
            }
        });

        parallel(readyTasks, done);
    };

    func.group    = true;
    func.type     = 'parallel';
    func.children = tasks;

    return func;
};


Runner.prototype.serial = function () {
    var self  = this,
        tasks = Array.prototype.slice.call(arguments),
        func;

    if ( tasks.length === 0 ) {
        return null;
    }

    func = function ( done ) {
        var readyTasks = [];

        // wrap not running tasks only
        tasks.forEach(function ( task ) {
            task = self.tasks[task] || task;

            if ( task && !task.running ) {
                readyTasks.push(
                    function ( done ) {
                        return self.run(task.id, done);
                    }
                );
            }
        });

        serial(readyTasks, done);
    };

    func.group    = true;
    func.type     = 'serial';
    func.children = tasks;

    return func;
};


/**
 * Start task execution.
 *
 * @param {function|string} task task to run
 * @param {function} [done] callback on task finish
 *
 * @return {boolean} is task really started
 */
Runner.prototype.run = function ( task, done ) {
    var started = false,
        taskFn;
    //var result;

    //console.log(task, done);

    console.assert(arguments.length >= 1, 'wrong arguments number');
    console.assert(typeof task === 'string', 'wrong task type');
    console.assert(task.length > 0, 'empty task name');
    console.assert(arguments.length === 1 || typeof done === 'function', 'wrong done type');

    //task = this.tasks[task] || task;
    taskFn = this.tasks[task];

    //console.assert(typeof task === 'function', 'task method is missing');

    if ( typeof taskFn === 'function' ) {
        if ( !taskFn.running ) {
            //result = this.wrap(task)(done);
            this.wrap(taskFn)(done);
            started = true;
        }
    } else {
        this.emit('error', {id: task, code: 404});
    }

    //return result;
    return started;
};


Runner.prototype.start = function ( done ) {
    var args = Array.prototype.slice.call(arguments);

    args.unshift('default');

    this.run.apply(this, args);
};


// public
module.exports = Runner;
