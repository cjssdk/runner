/**
 * @license The MIT License (MIT)
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Emitter  = require('cjs-emitter'),
    parallel = require('cjs-async/parallel'),
    serial   = require('cjs-async/serial');


function wrap ( instance, taskId, taskBody ) {
    var time;

    return function ( cb ) {
        var done = function () {
                // there are some listeners
                if ( instance.events['finish'] ) {
                    // notify listeners
                    instance.emit('finish', {id: taskId, time: Date.now() - time});
                }

                if ( cb ) {
                    console.assert(typeof cb === 'function', 'user callback should be a function');

                    cb.apply(null, arguments);
                }

                // mark finished
                taskBody.running = false;
            },
            result;

        // exist and not already executing
        if ( taskBody && !taskBody.running ) {
            // mark to prevent multiple starts
            taskBody.running = true;

            time = Date.now();

            // there are some listeners
            if ( instance.events['start'] ) {
                // notify listeners
                instance.emit('start', {id: taskId});
            }

            // is there a callback for task?
            if ( taskBody.length === 0 ) {
                // start task sync
                result = taskBody();
                // finish
                done(result === false);
            } else {
                // start task async
                result = taskBody(done);
            }
        }

        return result;
    };
}


/**
 * @constructor
 * @extends Emitter
 */
function Runner () {
    console.assert(typeof this === 'object', 'must be constructed via new');

    // parent constructor call
    Emitter.call(this);

    this.tasks = {};
}


// inheritance
Runner.prototype = Object.create(Emitter.prototype);
Runner.prototype.constructor = Runner;


/**
 * Create a task with the given identifier.
 *
 * @param {string} id task unique name
 * @param {function} body task method
 *
 * @return {function} task
 *
 * //@fires Runner#clear
 */
Runner.prototype.task = function ( id, body ) {
    console.assert(arguments.length === 2, 'wrong arguments number');
    console.assert(typeof id === 'string', 'task id should be a string');
    console.assert(id.length > 0, 'empty id');
    console.assert(typeof body === 'function', 'task body should be a function');

    this.tasks[id] = body;

    return body;
};


// accepts list of task ids
Runner.prototype.parallel = function () {
    var self  = this,
        tasks = Array.prototype.slice.call(arguments),
        task;

    // no tasks were given
    if ( tasks.length === 0 ) {
        return null;
    }

    task = function ( done ) {
        parallel(tasks.map(function ( taskId ) {
            return function ( callback ) {
                return self.run(taskId, callback);
            };
        }), done);
    };

    // apply custom task name
    Object.defineProperty(task, 'name', {value: '<parallel>'});

    return task;
};


// accepts list of task ids
Runner.prototype.serial = function () {
    var self  = this,
        tasks = Array.prototype.slice.call(arguments),
        task;

    // no tasks were given
    if ( tasks.length === 0 ) {
        return null;
    }

    task = function ( done ) {
        serial(tasks.map(function ( taskId ) {
            return function ( callback ) {
                return self.run(taskId, callback);
            };
        }), done);
    };

    // apply custom task name
    Object.defineProperty(task, 'name', {value: '<serial>'});

    return task;
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
        taskId, taskBody;

    console.assert(arguments.length >= 1, 'wrong arguments number');
    console.assert(typeof task === 'string' || typeof task === 'function', 'task should be a string or a function');
    console.assert(!!task, 'task is empty');
    console.assert(!done || typeof done === 'function', 'done should be a function');

    if ( typeof task === 'string' ) {
        taskId = task;
        taskBody = this.tasks[task];
    } else if ( typeof task === 'function' ) {
        taskId = task.name || '<noname>';
        taskBody = task;
    }

    if ( taskBody ) {
        if ( !taskBody.running ) {
            wrap(this, taskId, taskBody)(done);

            started = true;
        }
    } else {
        this.emit('error', {id: taskId, code: 404});
    }

    return started;
};


Runner.prototype.start = function ( done ) {
    this.run('default', done);
};


// public
module.exports = Runner;
