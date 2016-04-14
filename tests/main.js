/**
 * Mocha tests entry point.
 *
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Mocha = require('mocha'),
    mocha = new Mocha({
        reporter: 'spec',
        timeout: 1000,
        bail: true,
        fullTrace: true
    });


global.DEVELOP = true;

// add specs
mocha.addFile('./tests/specs');

// exec
mocha.run(function ( failures ) {
    if ( failures ) {
        process.exitCode = 1;
    }
});
