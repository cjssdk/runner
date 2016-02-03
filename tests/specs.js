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
            counter = 0;

        runner.task('one', function () {
            counter++;
        });

        runner.run('one');
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
                done();
            }, 20);
        });

        runner.run('one');
        runner.run('one');
        runner.run('one');
    });


    it.only('should pass: add parallel tasks', function ( done ) {
        var runner  = new Runner(),
            counter = 0;

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

        runner.task('all', runner.parallel(
            't1',
            't2',
            't3',
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
        ));

        runner.run('all');

        setTimeout(function () {
            counter.should.equal(2);
        }, 5);

        setTimeout(function () {
            counter.should.equal(5);
            done();
        }, 20);
    });


    //it('should pass: add serial tasks', function ( done ) {
    //    var runner  = new Runner(),
    //        counter = 0;
	//
    //    runner.task('t1', function () {
    //        counter++;
    //    });
	//
    //    runner.task('t2', function ( done ) {
    //        setTimeout(function () {
    //            counter++;
    //            done();
    //        }, 10);
    //    });
	//
    //    runner.task('t3', function ( done ) {
    //        setTimeout(function () {
    //            counter++;
    //            done();
    //        }, 10);
    //    });
	//
    //    runner.task('all', runner.serial(
    //        't1',
    //        't2',
    //        't3',
    //        function () {
    //            counter++;
    //        },
    //        function ( done ) {
    //            setTimeout(function () {
    //                counter++;
    //                done();
    //            }, 10);
    //        }
    //    ));
	//
    //    runner.run('all');
	//
    //    setTimeout(function () {
    //        should(counter).equal(4);
    //    }, 25);
	//
    //    setTimeout(function () {
    //        should(counter).equal(5);
    //        done();
    //    }, 35);
    //});




    //it('should pass: null tasks', function ( done ) {
    //    parallel(null, function ( error, list, hash ) {
    //        should.not.exist(error);
	//
    //        should.exist(list);
    //        should.exist(hash);
    //        list.should.containDeep([]);
    //        hash.should.containDeep({});
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: no tasks', function ( done ) {
    //    parallel([], function ( error, list, hash ) {
    //        should.not.exist(error);
	//
    //        should.exist(list);
    //        should.exist(hash);
    //        list.should.containDeep([]);
    //        hash.should.containDeep({});
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: 1 simple task', function ( done ) {
    //    parallel([
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(null, 128);
    //            }, 10);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.not.exist(error);
	//
    //        should.exist(list);
    //        should.exist(hash);
    //        list.should.containDeep([128]);
    //        hash.should.containDeep({});
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: 1 named task', function ( done ) {
    //    parallel([
    //        function one ( callback ) {
    //            setTimeout(function () {
    //                callback(null, 128);
    //            }, 10);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.not.exist(error);
	//
    //        should.exist(list);
    //        should.exist(hash);
    //        list.should.containDeep([128]);
    //        hash.should.containDeep({one: 128});
	//
    //        done();
    //    });
    //});
	//
    //it('should fail: 1 simple error task', function ( done ) {
    //    parallel([
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback({code: 123});
    //            }, 10);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.exist(error);
    //        error.should.containDeep({code: 123});
	//
    //        should.not.exist(list);
    //        should.not.exist(hash);
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: 3 simple tasks', function ( done ) {
    //    var counter = 0;
	//
    //    parallel([
    //        function ( callback ) {
    //            setTimeout(function () {
    //                counter++;
    //                should(counter).equal(2);
    //                callback(null, true);
    //            }, 10);
    //        },
    //        function ( callback ) {
    //            setTimeout(function () {
    //                counter++;
    //                should(counter).equal(3);
    //                callback(null, 256);
    //            }, 20);
    //        },
    //        function ( callback ) {
    //            setTimeout(function () {
    //                counter++;
    //                should(counter).equal(1);
    //                callback(null, '512');
    //            }, 0);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.not.exist(error);
	//
    //        should.exist(list);
    //        should.exist(hash);
    //        list.should.containDeep([true, 256, '512']);
    //        hash.should.containDeep({});
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: 3 named tasks', function ( done ) {
    //    parallel([
    //        function t1 ( callback ) {
    //            setTimeout(function () {
    //                callback(null, true);
    //            }, 10);
    //        },
    //        function t2 ( callback ) {
    //            setTimeout(function () {
    //                callback(null, 256);
    //            }, 20);
    //        },
    //        function t3 ( callback ) {
    //            setTimeout(function () {
    //                callback(null, '512');
    //            }, 0);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.not.exist(error);
	//
    //        should.exist(list);
    //        should.exist(hash);
    //        list.should.containDeep([true, 256, '512']);
    //        hash.should.containDeep({t1: true, t2: 256, t3: '512'});
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: 3 mixed tasks', function ( done ) {
    //    parallel([
    //        function t1 ( callback ) {
    //            setTimeout(function () {
    //                callback(null, true);
    //            }, 10);
    //        },
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(null, 256);
    //            }, 20);
    //        },
    //        function t3 ( callback ) {
    //            setTimeout(function () {
    //                callback(null, '512');
    //            }, 0);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.not.exist(error);
	//
    //        should.exist(list);
    //        should.exist(hash);
    //        list.should.containDeep([true, 256, '512']);
    //        hash.should.containDeep({t1: true, t3: '512'});
	//
    //        done();
    //    });
    //});
	//
    //it('should fail: 3 simple tasks with first failed', function ( done ) {
    //    parallel([
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(null, true);
    //            }, 10);
    //        },
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(null, 256);
    //            }, 20);
    //        },
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(true);
    //            }, 0);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.exist(error);
    //        error.should.equal(true);
	//
    //        should.not.exist(list);
    //        should.not.exist(hash);
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: 3 simple tasks with last failed', function ( done ) {
    //    parallel([
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(null, true);
    //            }, 10);
    //        },
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(123);
    //            }, 20);
    //        },
    //        function ( callback ) {
    //            setTimeout(function () {
    //                callback(null, '512');
    //            }, 0);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.exist(error);
    //        error.should.containDeep(123);
	//
    //        should.not.exist(list);
    //        should.not.exist(hash);
	//
    //        done();
    //    });
    //});
	//
    //it('should pass: 3 simple tasks with all failed', function ( done ) {
    //    parallel([
    //        function ( callback ) {
    //            callback(1);
    //        },
    //        function ( callback ) {
    //            callback(2);
    //        },
    //        function ( callback ) {
    //            callback(3);
    //        }
    //    ],
    //    function ( error, list, hash ) {
    //        should.exist(error);
    //        error.should.equal(1);
	//
    //        should.not.exist(list);
    //        should.not.exist(hash);
	//
    //        done();
    //    });
    //});

});
