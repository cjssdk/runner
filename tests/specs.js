/**
 * Mocha tests.
 *
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

/* eslint-env mocha */
/* eslint-disable new-cap */
/* eslint-disable no-new */
/* eslint-disable no-useless-call */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */


var should  = require('should'),
    Emitter = require('cjs-emitter'),
    Runner  = require('../index');


describe('main', function () {

    it.only('should pass: constructed with new', function () {
        (function () {
            new Runner();
        }).should.not.throw();
    });


    it.only('should fail: constructed without new', function () {
        (function () {
            Runner();
        }).should.throw('must be constructed via new');
    });


    it.only('should pass: fresh instance inner structure checks', function () {
        var runner = new Runner();

        runner.should.be.Object();
        runner.should.be.instanceof(Emitter);
        runner.events.should.be.Object();
        runner.tasks.should.be.Object();
        runner.tree.should.be.Object();
        Object.keys(runner.events).should.have.length(0);
        Object.keys(runner.tasks).should.have.length(0);
        Object.keys(runner.tree).should.have.length(0);
    });


    it.only('should fail: add tasks with bad arguments', function () {
        var runner = new Runner();

        (function () {
            runner.task();
        }).should.throw('wrong arguments number');

        (function () {
            runner.task(null);
        }).should.throw('wrong arguments number');

        (function () {
            runner.task(null, null);
        }).should.throw('wrong id type');

        (function () {
            runner.task(undefined, null);
        }).should.throw('wrong id type');

        (function () {
            runner.task(true, null);
        }).should.throw('wrong id type');

        (function () {
            runner.task(false, null);
        }).should.throw('wrong id type');

        (function () {
            runner.task(123, null);
        }).should.throw('wrong id type');

        (function () {
            runner.task([], null);
        }).should.throw('wrong id type');

        (function () {
            runner.task({}, null);
        }).should.throw('wrong id type');

        (function () {
            runner.task('', null);
        }).should.throw('empty id');

        (function () {
            runner.task('someId', null);
        }).should.throw('body should be a function');

        (function () {
            runner.task('someId', true);
        }).should.throw('body should be a function');

        (function () {
            runner.task('someId', false);
        }).should.throw('body should be a function');

        (function () {
            runner.task('someId', 123);
        }).should.throw('body should be a function');

        (function () {
            runner.task('someId', []);
        }).should.throw('body should be a function');

        (function () {
            runner.task('someId', '');
        }).should.throw('body should be a function');

        Object.keys(runner.tasks).should.have.length(0);
    });


    it.only('should pass: add simple task', function () {
        var runner = new Runner(),
            fnBody = function () {},
            result = runner.task('one', fnBody);

        should(result).equal(undefined);
        Object.keys(runner.tasks).should.have.length(1);
        runner.tasks.one.should.have.type('function');
        runner.tasks.one.should.be.equal(fnBody);
        runner.tasks.one.id.should.equal('one');
    });


    it.only('should fail: run with bad arguments', function () {
        var runner  = new Runner();

        (function () {
            runner.run();
        }).should.throw('wrong arguments number');

        (function () {
            runner.run(null);
        }).should.throw('wrong task type');

        (function () {
            runner.run(undefined);
        }).should.throw('wrong task type');

        (function () {
            runner.run(null);
        }).should.throw('wrong task type');

        (function () {
            runner.run(true);
        }).should.throw('wrong task type');

        (function () {
            runner.run(false);
        }).should.throw('wrong task type');

        (function () {
            runner.run(123);
        }).should.throw('wrong task type');

        (function () {
            runner.run([]);
        }).should.throw('wrong task type');

        (function () {
            runner.run({});
        }).should.throw('wrong task type');

        (function () {
            runner.run('');
        }).should.throw('empty task name');

        (function () {
            runner.run('qwe', null);
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', undefined);
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', true);
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', false);
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', 123);
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', []);
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', {});
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', '');
        }).should.throw('wrong done type');

        (function () {
            runner.run('qwe', 'qwe');
        }).should.throw('wrong done type');
    });


    it.only('should pass: run simple task sync', function () {
        var runner        = new Runner(),
            counterBody   = 0,
            counterStart  = 0,
            counterFinish = 0,
            result;

        runner.addListener('start', function ( event ) {
            counterStart++;
            should.exist(event);
            should.exist(event.id);
            event.should.have.keys('id');
            event.id.should.equal('one');
        });

        runner.addListener('finish', function ( event ) {
            counterFinish++;
            should.exist(event);
            should.exist(event.id);
            event.should.have.keys('id', 'time');
            event.id.should.equal('one');
            event.time.should.be.greaterThanOrEqual(0);
        });

        runner.task('one', function () {
            counterBody++;
        });

        result = runner.run('one');

        // ok
        result.should.be.true();
        counterBody.should.equal(1);
        counterStart.should.equal(1);
        counterFinish.should.equal(1);

        // repeat
        runner.run('one');
        counterBody.should.equal(2);
        counterStart.should.equal(2);
        counterFinish.should.equal(2);
    });


    it.only('should pass: run simple task sync and check return', function () {
        var runner        = new Runner(),
            counterBody   = 0,
            counterStart  = 0,
            counterFinish = 0;

        runner.addListener('start', function ( event ) {
            counterStart++;
            should.exist(event);
            should.exist(event.id);
            event.should.have.keys('id');
        });

        runner.addListener('finish', function ( event ) {
            counterFinish++;
            should.exist(event);
            should.exist(event.id);
            event.should.have.keys('id', 'time');
            event.time.should.be.greaterThanOrEqual(0);
        });

        runner.task('one', function () {
            counterBody++;
        });

        runner.task('two', function () {
            counterBody++;

            return true;
        });

        runner.task('three', function () {
            counterBody++;

            return false;
        });

        // no error checks
        runner.run('one', function () {});
        runner.run('two', function () {});
        runner.run('three', function () {});

        counterBody.should.equal(3);
        counterStart.should.equal(3);
        counterFinish.should.equal(3);

        // check errors
        runner.run('one', function ( error ) {
            // ok
            error.should.be.false();
        });
        runner.run('two', function ( error ) {
            // ok
            error.should.be.false();
        });
        runner.run('three', function ( error ) {
            // fail
            error.should.be.true();
        });

        counterBody.should.equal(6);
        counterStart.should.equal(6);
        counterFinish.should.equal(6);
    });


    it.only('should pass: run simple task async and check return', function ( done ) {
        var runner        = new Runner(),
            counterBody   = 0,
            counterStart  = 0,
            counterFinish = 0;

        runner.addListener('start', function ( event ) {
            counterStart++;
            should.exist(event);
            should.exist(event.id);
            event.should.have.keys('id');
        });

        runner.addListener('finish', function ( event ) {
            counterFinish++;
            should.exist(event);
            should.exist(event.id);
            event.should.have.keys('id', 'time');
            event.time.should.be.greaterThanOrEqual(0);
        });

        runner.task('one', function ( cb ) {
            setTimeout(function () {
                counterBody++;
                cb();
            }, 10);
        });

        runner.task('two', function ( cb ) {
            setTimeout(function () {
                counterBody++;
                cb(true);
            }, 10);
        });

        runner.task('three', function ( cb ) {
            setTimeout(function () {
                counterBody++;
                cb(false);
            }, 10);
        });

        // no error checks
        runner.run('one', function () {});
        runner.run('two', function () {});
        runner.run('three', function () {});

        setTimeout(function () {
            counterBody.should.equal(3);
            counterStart.should.equal(3);
            counterFinish.should.equal(3);

            // check errors
            runner.run('one', function ( error ) {
                // ok
                should(error).be.undefined();
            });
            runner.run('two', function ( error ) {
                // fail
                error.should.be.true();
            });
            runner.run('three', function ( error ) {
                // ok
                error.should.be.false();
            });

            setTimeout(function () {
                counterBody.should.equal(6);
                counterStart.should.equal(6);
                counterFinish.should.equal(6);

                done();
            }, 20);
        }, 20);
    });


    it.only('should pass: run simple task multiple time while executing', function ( done ) {
        var runner = new Runner();

        runner.task('one', function ( cb ) {
            setTimeout(function () {
                cb();
            }, 10);
        });

        // inner state
        //runner.tasks.one.running.should.be.false();

        // this should start
        runner.run('one').should.be.true();

        // inner state
        runner.tasks.one.running.should.be.true();

        // these should be ignored
        runner.run('one').should.be.false();
        runner.run('one').should.be.false();

        setTimeout(function () {
            // inner state
            runner.tasks.one.running.should.be.false();
            done();
        }, 20);
    });


    /*it('should pass: direct run sync', function () {
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
    });*/


    /*it('should pass: direct run async', function ( done ) {
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
    });*/


    it('should fail: add parallel task with bad arguments', function () {
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


    it('should pass: add some parallel tasks', function ( done ) {
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
