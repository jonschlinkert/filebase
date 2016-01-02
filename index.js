/*!
 * filebase <https://github.com/jonschlinkert/filebase>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var git = require('gitty');
var Emitter = require('component-emitter');
var utils = require('./utils');

/**
 * Create an instance of `Filebase` with the given `options`
 *
 * ```js
 * var filebase = new Filebase();
 * ```
 *
 * @param {Object} `options`
 * @api public
 */

function Filebase(options) {
  this.options = options || {};
  this.cache = {};
  this.paths = {};
  this.defaultConfig();
}

/**
 * Inherit `Emitter`
 */

Emitter(Filebase.prototype);

/**
 * Default configuration for Filebase
 */

Filebase.prototype.defaultConfig = function() {
  // placeholder for real messages...
  this.message('writeFile', 'Wrote file');
};

/**
 * Add file `key` with the given `value`
 *
 * @param {String} `key`
 * @param {Object} `value`
 * @api public
 */

Filebase.prototype.set = function(key, value) {
  this.files[key] = value;
  return this;
};

/**
 * Get file `key`
 *
 * @param {String} `key`
 * @return {Object}
 * @api public
 */

Filebase.prototype.get = function(key) {
  return this.files[key];
};

/**
 * Return true if file `key` exists.
 *
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Filebase.prototype.has = function(key) {
  return this.files.hasOwnProperty(key);
};

/**
 * Delete file `key`
 *
 * @param {String} `key`
 * @api public
 */

Filebase.prototype.del = function(key) {
  delete this.files[key];
  return this;
};

Filebase.prototype.message = function(key, message) {
  utils.set(this.messages, key, message);
  return this;
};

Filebase.prototype.add = function(cb) {
  this.repo.add(['.'], cb);
  return this;
};

Filebase.prototype.commit = function(message, cb) {
  if (typeof message === 'function') {
    cb = message;
    message = 'writeFile';
  }

  var msg = utils.get(this.messages, message) || message;

  this.add(function(err) {
    if (err) return cb(err);
    this.repo.commit(msg, cb);
  }.bind(this));
  return this;
};

Filebase.prototype.readFile = function(fp) {

};

Filebase.prototype.writeFile = function(filename, str, cb) {
  var dest = path.join(this.dest, filename);

  utils.writeFile(dest, str, function(err) {
    if (err) return cb(err);

    this.gitCommit('writeFile', cb);
  }.bind(this));
};

/**
 * Synchronously initialize a new git repository.
 *
 * ```js
 * filebase.initSync();
 * ```
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
 * @api public
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
 * Ensure that a directory exists.
 */

Filebase.prototype.ensureDir = function(dir) {
  if (!fs.existsSync(dir)) utils.mkdirp.sync(dir);
  return dir;
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
 * Setter for `templates` directory, used internally by Filebase for
 * generating assets.
 */

Object.defineProperty(Filebase.prototype, 'templates', {
  set: function(templates) {
    throw new Error('"templates" is a private getter and cannot be defined.');
  },
  get: function() {
    return this.ensureDir(path.join(__dirname, 'support/templates'));
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
    return (this.cache.dest = this.ensureDir(dest));
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
