'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('gitty');
require('resolve-dir');
require('object-visit');
require('set-value', 'set');
require('get-value', 'get');
require('mkdirp');
require('delete');
require('write');

/**
 * Restore `require`
 */

require = fn;

/**
 * Create the key to use for getting and setting values.
 * If the key contains a filepath, and the filepath has
 * dots in it, we need to escape them to ensure that
 * `set-value` doesn't split on those dots.
 */

utils.toKey = function(fp, key) {
  if (typeof fp !== 'string') {
    throw new TypeError('expected fp to be a string');
  }
  fp = fp.split('.').join('\\.');
  return fp + (key ? ('.' + key) : '');
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
