/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
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
    // parent constructor call
    Emitter.call(this);

    this.tasks = {};
    this.tree  = {};
    //this.running = {};
}


// inheritance
Runner.prototype = Object.create(Emitter.prototype);
Runner.prototype.constructor = Runner;


/**
 * Remove all attributes from the model.
 *
 * @fires Runner#clear
 */
Runner.prototype.task = function ( id, body ) {
    if ( id && typeof id === 'string' && body && typeof body === 'function' ) {
        this.tasks[id] = body;
        body.id = id;
        //console.log(body);
    }

    return body;
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

                time = +new Date() - time;
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

            time = +new Date();
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
                done();
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

    func = function ( done ) {
        var readyTasks = [];

        // wrap not running tasks only
        tasks.forEach(function ( task ) {
            task = self.tasks[task] || task;

            if ( task && !task.running ) {
                readyTasks.push(
                    function ( done ) {
                        return self.run(task, done);
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
        tasks = Array.prototype.slice.call(arguments);

    tasks = tasks.map(function ( item ) {
        item = typeof item === 'string' ? self.tasks[item] : item;

        return function () {

        };
    });

    return function ( done ) {
        serial(tasks, done);
    };
};


/**
 * @param {function|string} task task to run
 * @param {function} [done] callback on task finish
 */
Runner.prototype.run = function ( task, done ) {
    var result;

    task = this.tasks[task] || task;

    if ( !task.running ) {
        result = this.wrap(task)(done);
    }

    return result;

    //var self = this,
    //    taskId, taskFn,
    //    done = function () {
    //        // mark finished
    //        taskFn.running = false;
	//
    //        // there are some listeners
    //        if ( self.events['finish'] ) {
    //            // notify listeners
    //            self.emit('finish', {id: taskId});
    //            console.log('finish', taskId);
    //        }
    //    };
	//
    //// normalize
    //if ( typeof task === 'string' ) {
    //    taskId = task;
    //    taskFn = self.tasks[taskId];
    //} else {
    //    taskId = task.id || 'noname';
    //    taskFn = task;
    //}
	//
    //// exist and not already executing
    //if ( taskFn && !taskFn.running ) {
    //    // mark to prevent multiple starts
    //    taskFn.running = true;
	//
    //    // there are some listeners
    //    if ( this.events['start'] ) {
    //        // notify listeners
    //        this.emit('start', {id: taskId});
    //        console.log('start', taskId);
    //    }
	//
    //    // is there a callback for task?
    //    if ( taskFn.length === 0 ) {
    //        // start task sync
    //        taskFn();
    //        // finish
    //        done();
    //    } else {
    //        // start task async
    //        taskFn(done);
    //    }
    //}
};


Runner.prototype.start = function () {
    this.run(this.tasks.default);
};


// public
module.exports = Runner;
