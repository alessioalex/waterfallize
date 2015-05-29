"use strict";

var immediate = require('set-immediate-shim');
var slice = require('sliced');

function Series() {
  if (!(this instanceof Series)) {
    return new Series();
  }

  this.stack = [];
  this.index = 0;
  this.started = false;

  var that = this;

  immediate(function() {
    that.started = true;

    /* istanbul ignore else */
    if (that.stack.length) {
      that.iterate();
    }
  });

  return function add(fn) {
    if (that.started) {
      throw new Error('Please add all functions in the same `tick`');
    }

    that.stack.push(fn);
  }
}

Series.prototype.iterate = function() {
  var that = this;
  var args = slice(arguments);

  var cb = function cb(err) {
    if (err) {
      return that.stack[that.stack.length - 1].call(null, err);
    }

    that.index++;
    that.iterate.apply(that, slice(arguments, 1));
  };

  if (this.index < (this.stack.length - 1)) {
    args.push(cb);
  } else {
    args.unshift(null);
  }

  this.stack[this.index].apply(null, args);
};

module.exports = Series;
