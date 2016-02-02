/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Emitter = require('cjs-emitter');


/**
 *
 *
 * @constructor
 * @extends Emitter
 *
 * @param {Object} [data={}] init attributes
 */
function Runner ( data ) {
    // parent constructor call
    Emitter.call(this);

    this.data = data || {};
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
Runner.prototype.task = function () {


    // there are some listeners
    if ( this.events['clear'] ) {
        // notify listeners
        this.emit('clear', {data: data});
    }

};


// public
module.exports = Runner;
