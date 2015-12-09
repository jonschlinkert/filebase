/*!
 * filebase <https://github.com/jonschlinkert/filebase>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var git = require('gitty');
var utils = require('./utils');

function Filebase(options) {
  this.options = options || {};
  this.cache = {};
  this.paths = {};
}

Filebase.prototype.set = function(key, value) {
  this.files[key] = value;
  return this;
};

Filebase.prototype.get = function(key) {
  return this.files[key];
};

Filebase.prototype.has = function(key) {
  return this.files.hasOwnProperty(key);
};

Filebase.prototype.del = function(key) {
  delete this.files[key];
  return this;
};

/**
 * Initialize a new git repository in the `dest` directory.
 * ```js
 * filebase.init(function(err) {
 *   console.log(err);
 * });
 * ```
 * @param {array} `flags`
 * @param {function} `callback`
 * @api public
 */

Filebase.prototype.init = function() {
  this.repo.init.apply(this.repo, arguments);
  return this;
};

/**
 * Synchronously initialize a new git repository.
 *
 * ```js
 * filebase.initSync();
 * ```
 * @param {array} `flags`
 * @api public
 */

Filebase.prototype.initSync = function() {
  this.repo.initSync();
  return this;
};

/**
 * Persist the filebase to disk.
 *
 * ```js
 * filebase.save();
 * ```
 */

Filebase.prototype.save = function() {
  utils.writeJson.sync(this.path, this.data);
};

/**
 * Create the property key to use for getting and setting
 * the `default` value for the current locale.
 */

Filebase.prototype.defaultKey = function(locale) {
  return (locale || this.locale) + '.default';
};

/**
 * Create the property key to use for getting and setting
 * values for the current locale and cwd.
 */

Filebase.prototype.toKey = function(locale) {
  return utils.toKey(locale || this.locale, this.cwd);
};

/**
 * Visit `method` over each property on the given `value`.
 *
 * @param {String} `method` The method to call.
 * @param {Object} `val`
 * @return {Object}
 */

Filebase.prototype.visit = function(method, val) {
  return utils.visit(this, method, val);
};

/**
 * Getter/setter for cwd
 */

Object.defineProperty(Filebase.prototype, 'cwd', {
  set: function(cwd) {
    this.cache.cwd = cwd;
  },
  get: function() {
    if (this.cache.cwd) {
      return this.cache.cwd;
    }
    var cwd = this.options.cwd || process.cwd();
    return (this.cache.cwd = cwd);
  }
});

/**
 * Setter for `repo` directory
 */

Object.defineProperty(Filebase.prototype, 'repo', {
  set: function(repo) {
    throw new Error('repo is a getter based on `dest` and cannot be defined.');
  },
  get: function() {
    if (this.cache.repo) {
      return this.cache.repo;
    }
    return (this.cache.repo = git(this.dest));
  }
});

/**
 * Setter for `templates` directory
 */

Object.defineProperty(Filebase.prototype, 'templates', {
  set: function(templates) {
    throw new Error('"templates" is a private getter and cannot be defined.');
  },
  get: function() {
    return path.join(__dirname, 'support/templates');
  }
});

/**
 * Getter/setter for dest
 */

Object.defineProperty(Filebase.prototype, 'dest', {
  set: function(dest) {
    this.cache.dest = dest;
  },
  get: function() {
    if (this.cache.dest) {
      return this.cache.dest;
    }
    var dest = utils.resolveDir(this.options.dest || '~/filebase');
    return (this.cache.dest = dest);
  }
});

/**
 * Getter/setter for path
 */

Object.defineProperty(Filebase.prototype, 'path', {
  set: function(fp) {
    throw new Error('"path" is a getter based on `dest` and cannot be defined.');
  },
  get: function() {
    if (this.cache.path) {
      return this.cache.path;
    }
    var fp = path.resolve(this.dest, this.name + '.json');
    return (this.cache.path = fp);
  }
});

/**
 * Getter/setter for path
 */

Object.defineProperty(Filebase.prototype, 'locale', {
  set: function(locale) {
    this.cache.locale = locale;
  },
  get: function() {
    return this.cache.locale || this.options.locale || 'en';
  }
});

/**
 * Expose `Filebase`
 */

module.exports = Filebase;
