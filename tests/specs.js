/**
 * Mocha tests.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/* eslint-env mocha */
/* eslint-disable no-useless-call */


var should = require('should'),
    Runner = require('../index');


describe('main', function () {

    it('should fail: add task with bad arguments', function () {
        var runner = new Runner();

        runner.task();
        runner.task(null);
        runner.task(true);
        runner.task(false);
        runner.task('one');
        runner.task(12345);
        runner.task('one', null);
        runner.task('one', true);
        runner.task('one', false);
        runner.task('one', 12345);
        runner.task('one', '234');

        Object.keys(runner.tasks).should.have.length(0);
    });


    it('should pass: add simple task', function () {
        var runner = new Runner();

        runner.task('one', function () {});

        Object.keys(runner.tasks).should.have.length(1);
        runner.tasks.one.should.have.type('function');
        runner.tasks.one.id.should.equal('one');
    });


    it('should pass: run simple task sync', function () {
        var runner  = new Runner(),
            counter = 0,
            result;

        runner.task('one', function () {
            counter++;
            return true;
        });

        result = runner.run('one');

        result.should.equal(true);
        counter.should.equal(1);
    });


    it('should pass: run simple task sync and check events', function () {
        var runner  = new Runner(),
            counter = 0;

        runner.addListener('start', function ( event ) {
            counter++;
            should.exist(event);
            should.exist(event.id);
            event.id.should.equal('one');
            event.should.have.keys('id');
        });

        runner.addListener('finish', function ( event ) {
            counter++;
            should.exist(event);
            should.exist(event.id);
            event.id.should.equal('one');
            event.should.have.keys('id', 'time');
        });

        runner.task('one', function () {
            counter++;
        });

        runner.run('one');
        counter.should.equal(3);
    });


    it('should pass: run simple task async with callback', function ( done ) {
        var runner  = new Runner(),
            counter = 0;

        runner.task('one', function ( cb ) {
            counter++;
            setTimeout(function () {
                counter++;
                cb();
                counter.should.equal(2);
                done();
            }, 20);
        });

        runner.run('one');
    });


    it('should pass: run simple task async without callback', function ( done ) {
        var runner  = new Runner(),
            counter = 0;

        runner.addListener('start', function () {
            counter++;
        });

        runner.addListener('finish', function () {
            counter++;
        });

        runner.task('one', function ( cb ) {
            counter++;
            setTimeout(function () {
                counter++;
                counter.should.equal(3);
                cb();
                done();
            }, 20);
        });

        runner.run('one');
    });


    it('should pass: run simple task async with callback and check events', function ( done ) {
        var runner  = new Runner(),
            counter = 0;

        runner.addListener('start', function ( event ) {
            counter++;
            should.exist(event);
            should.exist(event.id);
            event.id.should.equal('one');
            event.should.have.keys('id');
        });

        runner.addListener('finish', function ( event ) {
            counter++;
            should.exist(event);
            should.exist(event.id);
            event.id.should.equal('one');
            event.should.have.keys('id', 'time');
            event.time.should.be.above(0);
        });

        runner.task('one', function ( cb ) {
            counter++;
            setTimeout(function () {
                counter++;
                cb();
                counter.should.equal(4);
                done();
            }, 20);
        });

        runner.run('one');
    });


    it('should pass: run simple task multiple time while executing', function ( done ) {
        var runner = new Runner();

        runner.task('one', function ( cb ) {
            setTimeout(function () {
                cb();
                done();
            }, 20);
        });

        runner.run('one');
        runner.run('one');
        runner.run('one');
    });


    it('should pass: direct run sync', function () {
        var runner  = new Runner(),
            counter = 0,
            handler = function () {
                counter++;
            };

        runner.addListener('start',  handler);
        runner.addListener('finish', handler);

        runner.run(function () {
            counter++;
        });

        counter.should.equal(3);
    });


    it('should pass: direct run async', function ( done ) {
        var runner  = new Runner(),
            counter = 0,
            handler = function () {
                counter++;
            };

        runner.addListener('start',  handler);
        runner.addListener('finish', handler);

        runner.run(function ( done ) {
            setTimeout(function () {
                handler();
                done();
            }, 5);
        });

        setTimeout(function () {
            counter.should.equal(3);
            done();
        }, 10);
    });


    it('should pass: add parallel with no tasks', function () {
        var runner  = new Runner(),
            counter = 0,
            handler = function () {
                counter++;
            };

        runner.addListener('start',  handler);
        runner.addListener('finish', handler);

        runner.run(
            runner.task('all', runner.parallel())
        );

        counter.should.equal(2);
    });


    it('should pass: add parallel with single sync task', function () {
        var runner  = new Runner(),
            counter = 0,
            handler = function () {
                counter++;
            };

        runner.addListener('start',  handler);
        runner.addListener('finish', handler);

        runner.run(
            runner.task('all', runner.parallel(
                function () {
                    counter++;
                }
            ))
        );

        counter.should.equal(5);
    });


    it('should pass: add parallel with single async task', function ( done ) {
        var runner  = new Runner(),
            counter = 0,
            handler = function () {
                counter++;
            };

        runner.addListener('start',  handler);
        runner.addListener('finish', handler);

        runner.run(
            runner.task('all', runner.parallel(
                function ( cb ) {
                    setTimeout(function () {
                        handler();
                        cb();
                    }, 5);
                }
            )),
            function () {
                counter.should.equal(5);
                done();
            }
        );
    });


    it.only('should pass: add some parallel tasks', function ( done ) {
        var runner  = new Runner(),
            counter = 0;

        runner.task('t0', function () {
            counter++;
        });

        runner.task('t1', function ( done ) {
            counter++;
            done();
        });

        runner.task('t2', function ( done ) {
            setTimeout(function () {
                counter++;
                done();
            }, 10);
        });

        runner.task('t3', function ( done ) {
            setTimeout(function () {
                counter++;
                done();
            }, 10);
        });

        runner.run(
            runner.task('all',
                runner.parallel(
                    't0',
                    't1',
                    't2',
                    't3',
                    function () {
                        counter++;
                    },
                    function ( done ) {
                        counter++;
                        done();
                    },
                    function ( done ) {
                        setTimeout(function () {
                            counter++;
                            done();
                        }, 10);
                    }
                )
            ),
            function () {
                //console.log(counter);
                //console.log(arguments);
            }
        );

        setTimeout(function () {
            counter.should.equal(4);
        }, 5);

        setTimeout(function () {
            counter.should.equal(7);
            done();
        }, 50);
    });
});
