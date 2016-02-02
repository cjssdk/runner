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
    this.running = {};
}


// inheritance
Runner.prototype = Object.create(Emitter.prototype);
Runner.prototype.constructor = Runner;


/**
 * Remove all attributes from the model.
 *
 * @return {boolean} operation status
 *
 * @fires Runner#clear
 */
Runner.prototype.task = function ( name, body ) {
    if ( name && typeof name === 'string' && body && typeof body === 'function' ) {
        this.tasks[name] = body;
    }

    // there are some listeners
    //if ( this.events['clear'] ) {
    //    // notify listeners
    //    this.emit('clear', {data: data});
    //}
};


Runner.prototype.parallel = function () {
    var self  = this,
        tasks = Array.prototype.slice.call(arguments);

    tasks = tasks.map(function ( item ) {
        var name, func;

        if ( typeof item === 'string' ) {
            name = item;
            func = self.tasks[item];
        } else {
            name = item.name;
            func = item;
        }

        return function ( done ) {
            self.run()
        };
    });

    return function ( done ) {
        parallel(tasks, done);
    };
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


Runner.prototype.run = function ( name ) {
    var self = this,
        done = function () {
            // mark finished
            self.running[name] = false;

            // there are some listeners
            if ( self.events['finish'] ) {
                // notify listeners
                self.emit('finish', {task: name});
                console.log('finish', name);
            }
        };

    // exist and not already executing
    if ( this.tasks[name] && !this.running[name] ) {
        // mark to prevent multiple starts
        this.running[name] = true;

        // there are some listeners
        if ( this.events['start'] ) {
            // notify listeners
            this.emit('start', {task: name});
            console.log('start', name);
        }

        // is there a callback for task?
        if ( this.tasks[name].length === 0 ) {
            // start task sync
            this.tasks[name]();
            // finish
            done();
        } else {
            // start task async
            this.tasks[name](done);
        }
    }
};


// public
module.exports = Runner;
