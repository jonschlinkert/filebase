# filebase [![NPM version](https://img.shields.io/npm/v/filebase.svg)](https://www.npmjs.com/package/filebase) [![Build Status](https://img.shields.io/travis/jonschlinkert/filebase.svg)](https://travis-ci.org/jonschlinkert/filebase)

> Git-backed file storage and versioning, with i18n support. WIP

<!-- toc -->

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm i filebase --save
```

## Usage

This project is WIP and is not ready for use!

```js
var Filebase = require('filebase');
```

## API

### [Filebase](index.js#L27)

Create an instance of `Filebase` with the given `options`

**Params**

* `options` **{Object}**

**Example**

```js
var filebase = new Filebase();
```

### [.set](index.js#L57)

Add file `key` with the given `value`

**Params**

* `key` **{String}**
* `value` **{Object}**

### [.get](index.js#L70)

Get file `key`

**Params**

* `key` **{String}**
* `returns` **{Object}**

### [.has](index.js#L82)

Return true if file `key` exists.

**Params**

* `key` **{String}**
* `returns` **{Boolean}**

### [.del](index.js#L93)

Delete file `key`

**Params**

* `key` **{String}**

### [.initSync](index.js#L146)

Synchronously initialize a new git repository.

**Example**

```js
filebase.initSync();
```

### [.save](index.js#L160)

Persist the filebase to disk.

**Example**

```js
filebase.save();
```

## Related projects

[data-store](https://www.npmjs.com/package/data-store): Easily get, set and persist config data. | [homepage](https://github.com/jonschlinkert/data-store)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/filebase/issues/new).

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016 [Jon Schlinkert](https://github.com/jonschlinkert)
Released under the MIT license.

***

_This file was generated by [verb](https://github.com/verbose/verb) on January 02, 2016._