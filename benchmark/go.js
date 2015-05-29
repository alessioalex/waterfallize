"use strict";

var async = require('async');
var waterfall = require('run-waterfall')
var waterfallize = require('../');

suite('waterfall alternatives', function() {
  // set('iterations', 30000);
  // set('mintime', 10000);
  // set('concurrency', 3);

  bench('async.waterfall', function(done) {
    async.waterfall([
      function (callback) {
        callback(null, 'one', 'two')
      },
      function (arg1, arg2, callback) {
        callback(null, 'three')
      },
      function (arg1, callback) {
        callback(null, 'done', 'wohoo')
      }
    ], function (err, result1, result2) {
      if (err) { throw err; }

      done();
    })
  });

  bench('run-waterfall', function(done) {
    waterfall([
      function (callback) {
        callback(null, 'one', 'two')
      },
      function (arg1, arg2, callback) {
        callback(null, 'three')
      },
      function (arg1, callback) {
        callback(null, 'done', 'wohoo')
      }
    ], function (err, result1, result2) {
      if (err) { throw err; }

      done();
    })
  });

  bench('waterfallize', function(done) {
    var next = waterfallize();

    next(function(callback) {
      callback(null, 'one', 'two');
    });

    next(function(arg1, arg2, callback) {
      callback(null, 'three');
    });

    next(function(arg1, callback) {
      callback(null, 'done', 'wohoo');
    });

    next(function(err, results) {
      if (err) { throw err; }

      done();
    });
  });
});
