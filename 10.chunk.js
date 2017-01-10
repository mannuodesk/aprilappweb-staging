webpackJsonpac__name_([10],{

/***/ "./node_modules/base64-js/index.js":
/***/ function(module, exports) {

"use strict";
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ },

/***/ "./node_modules/buffer/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = __webpack_require__("./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__("./node_modules/ieee754/index.js")
var isArray = __webpack_require__("./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/buffer/index.js").Buffer, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ },

/***/ "./node_modules/ieee754/index.js":
/***/ function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ },

/***/ "./node_modules/isarray/index.js":
/***/ function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ },

/***/ "./node_modules/jquery-ui/ui/core.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__("./node_modules/jquery/dist/jquery.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};

}));


/***/ },

/***/ "./node_modules/jquery-ui/ui/mouse.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Mouse 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
			__webpack_require__("./node_modules/jquery/dist/jquery.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/widget.js")
		], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

return $.widget("ui.mouse", {
	version: "1.11.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." + this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegate ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
				return this._mouseUp(event);

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		mouseHandled = false;
		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

}));


/***/ },

/***/ "./node_modules/jquery-ui/ui/sortable.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Sortable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/sortable/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
			__webpack_require__("./node_modules/jquery/dist/jquery.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/core.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/mouse.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/widget.js")
		], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.widget("ui.sortable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},

	_isOverAxis: function( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	},

	_isFloating: function( item ) {
		return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
	},

	_create: function() {
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		this._setHandleClassName();

		//We're ready to go
		this.ready = true;

	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "handle" ) {
			this._setHandleClassName();
		}
	},

	_setHandleClassName: function() {
		this.element.find( ".ui-sortable-handle" ).removeClass( "ui-sortable-handle" );
		$.each( this.items, function() {
			( this.instance.options.handle ?
				this.item.find( this.instance.options.handle ) : this.item )
				.addClass( "ui-sortable-handle" );
		});
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-sortable ui-sortable-disabled" )
			.find( ".ui-sortable-handle" )
				.removeClass( "ui-sortable-handle" );
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}

		return this;
	},

	_mouseCapture: function(event, overrideHandle) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type === "static") {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$(event.target).parents().each(function() {
			if($.data(this, that.widgetName + "-item") === that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + "-item") === that) {
			currentItem = $(event.target);
		}

		if(!currentItem) {
			return false;
		}
		if(this.options.handle && !overrideHandle) {
			$(this.options.handle, currentItem).find("*").addBack().each(function() {
				if(this === event.target) {
					validHandle = true;
				}
			});
			if(!validHandle) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] !== this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment) {
			this._setContainment();
		}

		if( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet = $( "<style>*{ cursor: "+o.cursor+" !important; }</style>" ).appendTo( body );
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) {
				this._storedOpacity = this.helper.css("opacity");
			}
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) {
				this._storedZIndex = this.helper.css("zIndex");
			}
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions) {
			this._cacheHelperProportions();
		}


		//Post "activate" events to possible containers
		if( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if(event.pageY - this.document.scrollTop() < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed);
				} else if(this.window.height() - (event.pageY - this.document.scrollTop()) < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed);
				}

				if(event.pageX - this.document.scrollLeft() < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed);
				} else if(this.window.width() - (event.pageX - this.document.scrollLeft()) < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed);
				}

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(this, event);
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}

		//Rearrange
		for (i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[i];
			itemElement = item.item[0];
			intersection = this._intersectsWithPointer(item);
			if (!intersection) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items from other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter between the outer and inner container.
			if (item.instance !== this.currentContainer) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if (itemElement !== this.currentItem[0] &&
				this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
				!$.contains(this.placeholder[0], itemElement) &&
				(this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		//Call callbacks
		this._trigger("sort", event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			$.ui.ddmanager.drop(this, event);
		}

		if(this.options.revert) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop);
			}
			this.reverting = true;
			$(this.helper).animate( animation, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper === "original") {
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) {
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			}
			if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
				this.helper.remove();
			}

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			str = [];
		o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
			if (res) {
				str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
			}
		});

		if(!str.length && o.key) {
			str.push(o.key + "=");
		}

		return str.join("&");

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			ret = [];

		o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t && ( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l && ( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			(this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) && // Right Half
				x2 - (this.helperProportions.width / 2) < r && // Left Half
				t < y1 + (this.helperProportions.height / 2) && // Bottom Half
				y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === "x") || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === "y") || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) {
			return false;
		}

		return this.floating ?
			( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this._setHandleClassName();
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if(connectWith && connected) {
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for ( j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
					}
				}
			}
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

		function addItems() {
			items.push( this );
		}
		for (i = queries.length - 1; i >= 0; i--){
			queries[i][0].each( addItems );
		}

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] === item.item[0]) {
					return false;
				}
			}
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
			connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for (j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				}
			}
		}

		for (i = queries.length - 1; i >= 0; i--) {
			targetData = queries[i][1];
			_queries = queries[i][0];

			for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				item = $(_queries[j]);

				item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			}
		}

	},

	refreshPositions: function(fast) {

		// Determine whether items are being displayed horizontally
		this.floating = this.items.length ?
			this.options.axis === "x" || this._isFloating( this.items[ 0 ].item ) :
			false;

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		var i, item, t, p;

		for (i = this.items.length - 1; i >= 0; i--){
			item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
				continue;
			}

			t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (i = this.containers.length - 1; i >= 0; i--){
				p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			}
		}

		return this;
	},

	_createPlaceholder: function(that) {
		that = that || this;
		var className,
			o = that.options;

		if(!o.placeholder || o.placeholder.constructor === String) {
			className = o.placeholder;
			o.placeholder = {
				element: function() {

					var nodeName = that.currentItem[0].nodeName.toLowerCase(),
						element = $( "<" + nodeName + ">", that.document[0] )
							.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
							.removeClass("ui-sortable-helper");

					if ( nodeName === "tbody" ) {
						that._createTrPlaceholder(
							that.currentItem.find( "tr" ).eq( 0 ),
							$( "<tr>", that.document[ 0 ] ).appendTo( element )
						);
					} else if ( nodeName === "tr" ) {
						that._createTrPlaceholder( that.currentItem, element );
					} else if ( nodeName === "img" ) {
						element.attr( "src", that.currentItem.attr( "src" ) );
					}

					if ( !className ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) {
						return;
					}

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
				}
			};
		}

		//Create the placeholder
		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);

	},

	_createTrPlaceholder: function( sourceTr, targetTr ) {
		var that = this;

		sourceTr.children().each(function() {
			$( "<td>&#160;</td>", that.document[ 0 ] )
				.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
				.appendTo( targetTr );
		});
	},

	_contactContainers: function(event) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, cur, nearBottom, floating, axis,
			innermostContainer = null,
			innermostIndex = null;

		// get innermost container that intersects with item
		for (i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0])) {
				continue;
			}

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
					continue;
				}

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) {
			return;
		}

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			if (!this.containers[innermostIndex].containerCache.over) {
				this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
				this.containers[innermostIndex].containerCache.over = 1;
			}
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || this._isFloating(this.currentItem);
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			axis = floating ? "clientX" : "clientY";

			for (j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
					continue;
				}
				if(this.items[j].item[0] === this.currentItem[0]) {
					continue;
				}

				cur = this.items[j].item.offset()[posProperty];
				nearBottom = false;
				if ( event[ axis ] - cur > this.items[ j ][ sizeProperty ] / 2 ) {
					nearBottom = true;
				}

				if ( Math.abs( event[ axis ] - cur ) < dist ) {
					dist = Math.abs( event[ axis ] - cur );
					itemWithLeastDistance = this.items[ j ];
					this.direction = nearBottom ? "up": "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
				return;
			}

			if(this.currentContainer === this.containers[innermostIndex]) {
				if ( !this.currentContainer.containerCache.over ) {
					this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash() );
					this.currentContainer.containerCache.over = 1;
				}
				return;
			}

			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
			this.currentContainer = this.containers[innermostIndex];

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

		//Add the helper to the DOM if that didn't happen already
		if(!helper.parents("body").length) {
			$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
		}

		if(helper[0] === this.currentItem[0]) {
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
		}

		if(!helper[0].style.width || o.forceHelperSize) {
			helper.width(this.currentItem.width());
		}
		if(!helper[0].style.height || o.forceHelperSize) {
			helper.height(this.currentItem.height());
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this information
		// with an ugly IE fix
		if( this.offsetParent[0] === this.document[0].body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if(o.containment === "parent") {
			o.containment = this.helper[0].parentNode;
		}
		if(o.containment === "document" || o.containment === "window") {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				o.containment === "document" ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left,
				(o.containment === "document" ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
			];
		}

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			ce = $(o.containment)[0];
			co = $(o.containment).offset();
			over = ($(ce).css("overflow") !== "hidden");

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
			scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition === "relative" && !(this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) {
					pageX = this.containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < this.containment[1]) {
					pageY = this.containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > this.containment[2]) {
					pageX = this.containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > this.containment[3]) {
					pageY = this.containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																// The absolute mouse position
				this.offset.click.top -													// Click offset (relative to the element)
				this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX -																// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter === this.counter) {
				this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
			}
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) {
			this.placeholder.before(this.currentItem);
		}
		this._noFinalSort = null;

		if(this.helper[0] === this.currentItem[0]) {
			for(i in this._storedCSS) {
				if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
					this._storedCSS[i] = "";
				}
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		}
		if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		function delayEvent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uiHash( instance ) );
			};
		}
		for (i = this.containers.length - 1; i >= 0; i--){
			if (!noPropagation) {
				delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
			}
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if(this._storedOpacity) {
			this.helper.css("opacity", this._storedOpacity);
		}
		if(this._storedZIndex) {
			this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
		}

		this.dragging = false;

		if(!noPropagation) {
			this._trigger("beforeStop", event, this._uiHash());
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if ( !this.cancelHelperRemoval ) {
			if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
				this.helper.remove();
			}
			this.helper = null;
		}

		if(!noPropagation) {
			for (i=0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			} //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return !this.cancelHelperRemoval;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});

}));


/***/ },

/***/ "./node_modules/jquery-ui/ui/widget.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__("./node_modules/jquery/dist/jquery.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

return $.widget;

}));


/***/ },

/***/ "./node_modules/jquery.nestable/jquery.nestable.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */
;(function($, window, document, undefined)
{
    var hasTouch = 'ontouchstart' in document;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

    var defaults = {
            listNodeName    : 'ol',
            itemNodeName    : 'li',
            rootClass       : 'dd',
            listClass       : 'dd-list',
            itemClass       : 'dd-item',
            dragClass       : 'dd-dragel',
            handleClass     : 'dd-handle',
            collapsedClass  : 'dd-collapsed',
            placeClass      : 'dd-placeholder',
            noDragClass     : 'dd-nodrag',
            emptyClass      : 'dd-empty',
            expandBtnHTML   : '<button data-action="expand" type="button">Expand</button>',
            collapseBtnHTML : '<button data-action="collapse" type="button">Collapse</button>',
            group           : 0,
            maxDepth        : 5,
            threshold       : 20
        };

    function Plugin(element, options)
    {
        this.w  = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function()
        {
            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function(k, el) {
                list.setParent($(el));
            });

            list.el.on('click', 'button', function(e) {
                if (list.dragEl) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item   = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });

            var onStartEvent = function(e)
            {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }

                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            var onMoveEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            var onEndEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener('touchstart', onStartEvent, false);
                window.addEventListener('touchmove', onMoveEvent, false);
                window.addEventListener('touchend', onEndEvent, false);
                window.addEventListener('touchcancel', onEndEvent, false);
            }

            list.el.on('mousedown', onStartEvent);
            list.w.on('mousemove', onMoveEvent);
            list.w.on('mouseup', onEndEvent);

        },

        serialize: function()
        {
            var data,
                depth = 0,
                list  = this;
                step  = function(level, depth)
                {
                    var array = [ ],
                        items = level.children(list.options.itemNodeName);
                    items.each(function()
                    {
                        var li   = $(this),
                            item = $.extend({}, li.data()),
                            sub  = li.children(list.options.listNodeName);
                        if (sub.length) {
                            item.children = step(sub, depth + 1);
                        }
                        array.push(item);
                    });
                    return array;
                };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function()
        {
            return this.serialize();
        },

        reset: function()
        {
            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.isTouch    = false;
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.hasNewRoot = false;
            this.pointEl    = null;
        },

        expandItem: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();
        },

        collapseItem: function(li)
        {
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }
        },

        expandAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.expandItem($(this));
            });
        },

        collapseAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.collapseItem($(this));
            });
        },

        setParent: function(li)
        {
            if (li.children(this.options.listNodeName).length) {
                li.prepend($(this.options.expandBtnHTML));
                li.prepend($(this.options.collapseBtnHTML));
            }
            li.children('[data-action="expand"]').hide();
        },

        unsetParent: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function(e)
        {
            var mouse    = this.mouse,
                target   = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function(e)
        {
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);

            this.dragEl.remove();
            this.el.trigger('change');
            if (this.hasNewRoot) {
                this.dragRootEl.trigger('change');
            }
            this.reset();
        },

        dragMove: function(e)
        {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx  = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                    parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function(params)
    {
        var lists  = this,
            retval = this;

        lists.each(function()
        {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(__webpack_provided_window_dot_jQuery || window.Zepto, window, document);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/messenger/build/js/messenger.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*! messenger 1.4.2 */
/*
 * This file begins the output concatenated into messenger.js
 *
 * It establishes the Messenger object while preserving whatever it was before
 * (for noConflict), and making it a callable function.
 */

(function(){
    var _prevMessenger = window.Messenger;
    var localMessenger;

    localMessenger = window.Messenger = function(){
        return localMessenger._call.apply(this, arguments);
    }

    window.Messenger.noConflict = function(){
        window.Messenger = _prevMessenger;

        return localMessenger;
    }
})();

/*
 * This file contains shims for when Underscore and Backbone
 * are not included.
 *
 * Portions taken from Underscore.js and Backbone.js
 * Both of which are Copyright (c) 2009-2013 Jeremy Ashkenas, DocumentCloud
 */
window.Messenger._ = (function() {
    if (window._)
        return window._

    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var push             = ArrayProto.push,
            slice            = ArrayProto.slice,
            concat           = ArrayProto.concat,
            toString         = ObjProto.toString,
            hasOwnProperty   = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
        nativeForEach      = ArrayProto.forEach,
        nativeMap          = ArrayProto.map,
        nativeReduce       = ArrayProto.reduce,
        nativeReduceRight  = ArrayProto.reduceRight,
        nativeFilter       = ArrayProto.filter,
        nativeEvery        = ArrayProto.every,
        nativeSome         = ArrayProto.some,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeLastIndexOf  = ArrayProto.lastIndexOf,
        nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys,
        nativeBind         = FuncProto.bind;

    // Create a safe reference to the Underscore object for use below.
    var _ = {};

    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
  
    var each = _.each = _.forEach = function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (_.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };

    _.result = function(object, property) {
        if (object == null) return null;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    };

    _.once = function(func) {
        var ran = false, memo;
        return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    _.filter = _.select = function(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
        each(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) results[results.length] = value;
        });
        return results;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    _.defaults = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] == null) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    _.extend = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    _.keys = nativeKeys || function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
        return keys;
    };

    _.bind = function(func, context) {
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        var args = slice.call(arguments, 2);
        return function() {
            return func.apply(context, args.concat(slice.call(arguments)));
        };
    };

    _.isObject = function(obj) {
        return obj === Object(obj);
    };

    return _;
})();

window.Messenger.Events = (function() {
    if (window.Backbone && Backbone.Events) {
        return Backbone.Events;
    }

    var eventsShim = function() {
        var eventSplitter = /\s+/;

        var eventsApi = function(obj, action, name, rest) {
            if (!name) return true;
            if (typeof name === 'object') {
                for (var key in name) {
                    obj[action].apply(obj, [key, name[key]].concat(rest));
                }
            } else if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0, l = names.length; i < l; i++) {
                    obj[action].apply(obj, [names[i]].concat(rest));
                }
            } else {
                return true;
            }
        };

        var triggerEvents = function(events, args) {
            var ev, i = -1, l = events.length;
            switch (args.length) {
            case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
            return;
            case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
            return;
            case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
            return;
            case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
            return;
            default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
            }
        };

        var Events = {

            on: function(name, callback, context) {
                if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
                this._events || (this._events = {});
                var list = this._events[name] || (this._events[name] = []);
                list.push({callback: callback, context: context, ctx: context || this});
                return this;
            },

            once: function(name, callback, context) {
                if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
                var self = this;
                var once = _.once(function() {
                    self.off(name, once);
                    callback.apply(this, arguments);
                });
                once._callback = callback;
                this.on(name, once, context);
                return this;
            },

            off: function(name, callback, context) {
                var list, ev, events, names, i, l, j, k;
                if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
                if (!name && !callback && !context) {
                    this._events = {};
                    return this;
                }

                names = name ? [name] : _.keys(this._events);
                for (i = 0, l = names.length; i < l; i++) {
                    name = names[i];
                    if (list = this._events[name]) {
                        events = [];
                        if (callback || context) {
                            for (j = 0, k = list.length; j < k; j++) {
                                ev = list[j];
                                if ((callback && callback !== ev.callback &&
                                                                 callback !== ev.callback._callback) ||
                                        (context && context !== ev.context)) {
                                    events.push(ev);
                                }
                            }
                        }
                        this._events[name] = events;
                    }
                }

                return this;
            },

            trigger: function(name) {
                if (!this._events) return this;
                var args = Array.prototype.slice.call(arguments, 1);
                if (!eventsApi(this, 'trigger', name, args)) return this;
                var events = this._events[name];
                var allEvents = this._events.all;
                if (events) triggerEvents(events, args);
                if (allEvents) triggerEvents(allEvents, arguments);
                return this;
            },

            listenTo: function(obj, name, callback) {
                var listeners = this._listeners || (this._listeners = {});
                var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
                listeners[id] = obj;
                obj.on(name, typeof name === 'object' ? this : callback, this);
                return this;
            },

            stopListening: function(obj, name, callback) {
                var listeners = this._listeners;
                if (!listeners) return;
                if (obj) {
                    obj.off(name, typeof name === 'object' ? this : callback, this);
                    if (!name && !callback) delete listeners[obj._listenerId];
                } else {
                    if (typeof name === 'object') callback = this;
                    for (var id in listeners) {
                        listeners[id].off(name, callback, this);
                    }
                    this._listeners = {};
                }
                return this;
            }
        };

        Events.bind   = Events.on;
        Events.unbind = Events.off;
        return Events;
    };
    return eventsShim();
})();

(function() {
  var $, ActionMessenger, BaseView, Events, RetryingMessage, _, _Message, _Messenger, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  _ = (_ref = window._) != null ? _ref : window.Messenger._;

  Events = (_ref1 = typeof Backbone !== "undefined" && Backbone !== null ? Backbone.Events : void 0) != null ? _ref1 : window.Messenger.Events;

  BaseView = (function() {

    function BaseView(options) {
      $.extend(this, Events);
      if (_.isObject(options)) {
        if (options.el) {
          this.setElement(options.el);
        }
        this.model = options.model;
      }
      this.initialize.apply(this, arguments);
    }

    BaseView.prototype.setElement = function(el) {
      this.$el = $(el);
      return this.el = this.$el[0];
    };

    BaseView.prototype.delegateEvents = function(events) {
      var delegateEventSplitter, eventName, key, match, method, selector, _results;
      if (!(events || (events = _.result(this, "events")))) {
        return;
      }
      this.undelegateEvents();
      delegateEventSplitter = /^(\S+)\s*(.*)$/;
      _results = [];
      for (key in events) {
        method = events[key];
        if (!_.isFunction(method)) {
          method = this[events[key]];
        }
        if (!method) {
          throw new Error("Method \"" + events[key] + "\" does not exist");
        }
        match = key.match(delegateEventSplitter);
        eventName = match[1];
        selector = match[2];
        method = _.bind(method, this);
        eventName += ".delegateEvents" + this.cid;
        if (selector === '') {
          _results.push(this.jqon(eventName, method));
        } else {
          _results.push(this.jqon(eventName, selector, method));
        }
      }
      return _results;
    };

    BaseView.prototype.jqon = function(eventName, selector, method) {
      var _ref2;
      if (this.$el.on != null) {
        return (_ref2 = this.$el).on.apply(_ref2, arguments);
      } else {
        if (!(method != null)) {
          method = selector;
          selector = void 0;
        }
        if (selector != null) {
          return this.$el.delegate(selector, eventName, method);
        } else {
          return this.$el.bind(eventName, method);
        }
      }
    };

    BaseView.prototype.jqoff = function(eventName) {
      var _ref2;
      if (this.$el.off != null) {
        return (_ref2 = this.$el).off.apply(_ref2, arguments);
      } else {
        this.$el.undelegate();
        return this.$el.unbind(eventName);
      }
    };

    BaseView.prototype.undelegateEvents = function() {
      return this.jqoff(".delegateEvents" + this.cid);
    };

    BaseView.prototype.remove = function() {
      this.undelegateEvents();
      return this.$el.remove();
    };

    return BaseView;

  })();

  _Message = (function(_super) {

    __extends(_Message, _super);

    function _Message() {
      return _Message.__super__.constructor.apply(this, arguments);
    }

    _Message.prototype.defaults = {
      hideAfter: 10,
      scroll: true,
      closeButtonText: "&times;",
      escapeText: false
    };

    _Message.prototype.initialize = function(opts) {
      if (opts == null) {
        opts = {};
      }
      this.shown = false;
      this.rendered = false;
      this.messenger = opts.messenger;
      return this.options = $.extend({}, this.options, opts, this.defaults);
    };

    _Message.prototype.show = function() {
      var wasShown;
      if (!this.rendered) {
        this.render();
      }
      this.$message.removeClass('messenger-hidden');
      wasShown = this.shown;
      this.shown = true;
      if (!wasShown) {
        return this.trigger('show');
      }
    };

    _Message.prototype.hide = function() {
      var wasShown;
      if (!this.rendered) {
        return;
      }
      this.$message.addClass('messenger-hidden');
      wasShown = this.shown;
      this.shown = false;
      if (wasShown) {
        return this.trigger('hide');
      }
    };

    _Message.prototype.cancel = function() {
      return this.hide();
    };

    _Message.prototype.update = function(opts) {
      var _ref2,
        _this = this;
      if (_.isString(opts)) {
        opts = {
          message: opts
        };
      }
      $.extend(this.options, opts);
      this.lastUpdate = new Date();
      this.rendered = false;
      this.events = (_ref2 = this.options.events) != null ? _ref2 : {};
      this.render();
      this.actionsToEvents();
      this.delegateEvents();
      this.checkClickable();
      if (this.options.hideAfter) {
        this.$message.addClass('messenger-will-hide-after');
        if (this._hideTimeout != null) {
          clearTimeout(this._hideTimeout);
        }
        this._hideTimeout = setTimeout(function() {
          return _this.hide();
        }, this.options.hideAfter * 1000);
      } else {
        this.$message.removeClass('messenger-will-hide-after');
      }
      if (this.options.hideOnNavigate) {
        this.$message.addClass('messenger-will-hide-on-navigate');
        if ((typeof Backbone !== "undefined" && Backbone !== null ? Backbone.history : void 0) != null) {
          Backbone.history.on('route', function() {
            return _this.hide();
          });
        }
      } else {
        this.$message.removeClass('messenger-will-hide-on-navigate');
      }
      return this.trigger('update', this);
    };

    _Message.prototype.scrollTo = function() {
      if (!this.options.scroll) {
        return;
      }
      return $.scrollTo(this.$el, {
        duration: 400,
        offset: {
          left: 0,
          top: -20
        }
      });
    };

    _Message.prototype.timeSinceUpdate = function() {
      if (this.lastUpdate) {
        return (new Date) - this.lastUpdate;
      } else {
        return null;
      }
    };

    _Message.prototype.actionsToEvents = function() {
      var act, name, _ref2, _results,
        _this = this;
      _ref2 = this.options.actions;
      _results = [];
      for (name in _ref2) {
        act = _ref2[name];
        _results.push(this.events["click [data-action=\"" + name + "\"] a"] = (function(act) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            _this.trigger("action:" + name, act, e);
            return act.action.call(_this, e, _this);
          };
        })(act));
      }
      return _results;
    };

    _Message.prototype.checkClickable = function() {
      var evt, name, _ref2, _results;
      _ref2 = this.events;
      _results = [];
      for (name in _ref2) {
        evt = _ref2[name];
        if (name === 'click') {
          _results.push(this.$message.addClass('messenger-clickable'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    _Message.prototype.undelegateEvents = function() {
      var _ref2;
      _Message.__super__.undelegateEvents.apply(this, arguments);
      return (_ref2 = this.$message) != null ? _ref2.removeClass('messenger-clickable') : void 0;
    };

    _Message.prototype.parseActions = function() {
      var act, actions, n_act, name, _ref2, _ref3;
      actions = [];
      _ref2 = this.options.actions;
      for (name in _ref2) {
        act = _ref2[name];
        n_act = $.extend({}, act);
        n_act.name = name;
        if ((_ref3 = n_act.label) == null) {
          n_act.label = name;
        }
        actions.push(n_act);
      }
      return actions;
    };

    _Message.prototype.template = function(opts) {
      var $action, $actions, $cancel, $link, $message, $text, action, _i, _len, _ref2,
        _this = this;
      $message = $("<div class='messenger-message message alert " + opts.type + " message-" + opts.type + " alert-" + opts.type + "'>");
      if (opts.showCloseButton) {
        $cancel = $('<button type="button" class="messenger-close" data-dismiss="alert">');
        $cancel.html(opts.closeButtonText);
        $cancel.click(function() {
          _this.cancel();
          return true;
        });
        $message.append($cancel);
      }
      if (opts.escapeText) {
        $text = $('<div class="messenger-message-inner"></div>').text(opts.message);
      } else {
        $text = $("<div class=\"messenger-message-inner\">" + opts.message + "</div>");
      }
      $message.append($text);
      if (opts.actions.length) {
        $actions = $('<div class="messenger-actions">');
      }
      _ref2 = opts.actions;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        action = _ref2[_i];
        $action = $('<span>');
        $action.attr('data-action', "" + action.name);
        $link = $('<a>');
        $link.html(action.label);
        $action.append($('<span class="messenger-phrase">'));
        $action.append($link);
        $actions.append($action);
      }
      $message.append($actions);
      return $message;
    };

    _Message.prototype.render = function() {
      var opts;
      if (this.rendered) {
        return;
      }
      if (!this._hasSlot) {
        this.setElement(this.messenger._reserveMessageSlot(this));
        this._hasSlot = true;
      }
      opts = $.extend({}, this.options, {
        actions: this.parseActions()
      });
      this.$message = $(this.template(opts));
      this.$el.html(this.$message);
      this.shown = true;
      this.rendered = true;
      return this.trigger('render');
    };

    return _Message;

  })(BaseView);

  RetryingMessage = (function(_super) {

    __extends(RetryingMessage, _super);

    function RetryingMessage() {
      return RetryingMessage.__super__.constructor.apply(this, arguments);
    }

    RetryingMessage.prototype.initialize = function() {
      RetryingMessage.__super__.initialize.apply(this, arguments);
      return this._timers = {};
    };

    RetryingMessage.prototype.cancel = function() {
      this.clearTimers();
      this.hide();
      if ((this._actionInstance != null) && (this._actionInstance.abort != null)) {
        return this._actionInstance.abort();
      }
    };

    RetryingMessage.prototype.clearTimers = function() {
      var name, timer, _ref2, _ref3;
      _ref2 = this._timers;
      for (name in _ref2) {
        timer = _ref2[name];
        clearTimeout(timer);
      }
      this._timers = {};
      return (_ref3 = this.$message) != null ? _ref3.removeClass('messenger-retry-soon messenger-retry-later') : void 0;
    };

    RetryingMessage.prototype.render = function() {
      var action, name, _ref2, _results;
      RetryingMessage.__super__.render.apply(this, arguments);
      this.clearTimers();
      _ref2 = this.options.actions;
      _results = [];
      for (name in _ref2) {
        action = _ref2[name];
        if (action.auto) {
          _results.push(this.startCountdown(name, action));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RetryingMessage.prototype.renderPhrase = function(action, time) {
      var phrase;
      phrase = action.phrase.replace('TIME', this.formatTime(time));
      return phrase;
    };

    RetryingMessage.prototype.formatTime = function(time) {
      var pluralize;
      pluralize = function(num, str) {
        num = Math.floor(num);
        if (num !== 1) {
          str = str + 's';
        }
        return 'in ' + num + ' ' + str;
      };
      if (Math.floor(time) === 0) {
        return 'now...';
      }
      if (time < 60) {
        return pluralize(time, 'second');
      }
      time /= 60;
      if (time < 60) {
        return pluralize(time, 'minute');
      }
      time /= 60;
      return pluralize(time, 'hour');
    };

    RetryingMessage.prototype.startCountdown = function(name, action) {
      var $phrase, remaining, tick, _ref2,
        _this = this;
      if (this._timers[name] != null) {
        return;
      }
      $phrase = this.$message.find("[data-action='" + name + "'] .messenger-phrase");
      remaining = (_ref2 = action.delay) != null ? _ref2 : 3;
      if (remaining <= 10) {
        this.$message.removeClass('messenger-retry-later');
        this.$message.addClass('messenger-retry-soon');
      } else {
        this.$message.removeClass('messenger-retry-soon');
        this.$message.addClass('messenger-retry-later');
      }
      tick = function() {
        var delta;
        $phrase.text(_this.renderPhrase(action, remaining));
        if (remaining > 0) {
          delta = Math.min(remaining, 1);
          remaining -= delta;
          return _this._timers[name] = setTimeout(tick, delta * 1000);
        } else {
          _this.$message.removeClass('messenger-retry-soon messenger-retry-later');
          delete _this._timers[name];
          return action.action();
        }
      };
      return tick();
    };

    return RetryingMessage;

  })(_Message);

  _Messenger = (function(_super) {

    __extends(_Messenger, _super);

    function _Messenger() {
      return _Messenger.__super__.constructor.apply(this, arguments);
    }

    _Messenger.prototype.tagName = 'ul';

    _Messenger.prototype.className = 'messenger';

    _Messenger.prototype.messageDefaults = {
      type: 'info'
    };

    _Messenger.prototype.initialize = function(options) {
      this.options = options != null ? options : {};
      this.history = [];
      return this.messageDefaults = $.extend({}, this.messageDefaults, this.options.messageDefaults);
    };

    _Messenger.prototype.render = function() {
      return this.updateMessageSlotClasses();
    };

    _Messenger.prototype.findById = function(id) {
      return _.filter(this.history, function(rec) {
        return rec.msg.options.id === id;
      });
    };

    _Messenger.prototype._reserveMessageSlot = function(msg) {
      var $slot, dmsg,
        _this = this;
      $slot = $('<li>');
      $slot.addClass('messenger-message-slot');
      this.$el.prepend($slot);
      this.history.push({
        msg: msg,
        $slot: $slot
      });
      this._enforceIdConstraint(msg);
      msg.on('update', function() {
        return _this._enforceIdConstraint(msg);
      });
      while (this.options.maxMessages && this.history.length > this.options.maxMessages) {
        dmsg = this.history.shift();
        dmsg.msg.remove();
        dmsg.$slot.remove();
      }
      return $slot;
    };

    _Messenger.prototype._enforceIdConstraint = function(msg) {
      var entry, _i, _len, _msg, _ref2;
      if (msg.options.id == null) {
        return;
      }
      _ref2 = this.history;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        entry = _ref2[_i];
        _msg = entry.msg;
        if ((_msg.options.id != null) && _msg.options.id === msg.options.id && msg !== _msg) {
          if (msg.options.singleton) {
            msg.hide();
            return;
          } else {
            _msg.hide();
          }
        }
      }
    };

    _Messenger.prototype.newMessage = function(opts) {
      var msg, _ref2, _ref3, _ref4,
        _this = this;
      if (opts == null) {
        opts = {};
      }
      opts.messenger = this;
      _Message = (_ref2 = (_ref3 = Messenger.themes[(_ref4 = opts.theme) != null ? _ref4 : this.options.theme]) != null ? _ref3.Message : void 0) != null ? _ref2 : RetryingMessage;
      msg = new _Message(opts);
      msg.on('show', function() {
        if (opts.scrollTo && _this.$el.css('position') !== 'fixed') {
          return msg.scrollTo();
        }
      });
      msg.on('hide show render', this.updateMessageSlotClasses, this);
      return msg;
    };

    _Messenger.prototype.updateMessageSlotClasses = function() {
      var anyShown, last, rec, willBeFirst, _i, _len, _ref2;
      willBeFirst = true;
      last = null;
      anyShown = false;
      _ref2 = this.history;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        rec = _ref2[_i];
        rec.$slot.removeClass('messenger-first messenger-last messenger-shown');
        if (rec.msg.shown && rec.msg.rendered) {
          rec.$slot.addClass('messenger-shown');
          anyShown = true;
          last = rec;
          if (willBeFirst) {
            willBeFirst = false;
            rec.$slot.addClass('messenger-first');
          }
        }
      }
      if (last != null) {
        last.$slot.addClass('messenger-last');
      }
      return this.$el["" + (anyShown ? 'remove' : 'add') + "Class"]('messenger-empty');
    };

    _Messenger.prototype.hideAll = function() {
      var rec, _i, _len, _ref2, _results;
      _ref2 = this.history;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        rec = _ref2[_i];
        _results.push(rec.msg.hide());
      }
      return _results;
    };

    _Messenger.prototype.post = function(opts) {
      var msg;
      if (_.isString(opts)) {
        opts = {
          message: opts
        };
      }
      opts = $.extend(true, {}, this.messageDefaults, opts);
      msg = this.newMessage(opts);
      msg.update(opts);
      return msg;
    };

    return _Messenger;

  })(BaseView);

  ActionMessenger = (function(_super) {

    __extends(ActionMessenger, _super);

    function ActionMessenger() {
      return ActionMessenger.__super__.constructor.apply(this, arguments);
    }

    ActionMessenger.prototype.doDefaults = {
      progressMessage: null,
      successMessage: null,
      errorMessage: "Error connecting to the server.",
      showSuccessWithoutError: true,
      retry: {
        auto: true,
        allow: true
      },
      action: $.ajax
    };

    ActionMessenger.prototype.hookBackboneAjax = function(msgr_opts) {
      var _ajax,
        _this = this;
      if (msgr_opts == null) {
        msgr_opts = {};
      }
      if (!(window.Backbone != null)) {
        throw 'Expected Backbone to be defined';
      }
      msgr_opts = _.defaults(msgr_opts, {
        id: 'BACKBONE_ACTION',
        errorMessage: false,
        successMessage: "Request completed successfully.",
        showSuccessWithoutError: false
      });
      _ajax = function(options) {
        var sync_msgr_opts;
        sync_msgr_opts = _.extend({}, msgr_opts, options.messenger);
        return _this["do"](sync_msgr_opts, options);
      };
      if (Backbone.ajax != null) {
        if (Backbone.ajax._withoutMessenger) {
          Backbone.ajax = Backbone.ajax._withoutMessenger;
        }
        if (!(msgr_opts.action != null) || msgr_opts.action === this.doDefaults.action) {
          msgr_opts.action = Backbone.ajax;
        }
        _ajax._withoutMessenger = Backbone.ajax;
        return Backbone.ajax = _ajax;
      } else {
        return Backbone.sync = _.wrap(Backbone.sync, function() {
          var args, _old_ajax, _old_sync;
          _old_sync = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          _old_ajax = $.ajax;
          $.ajax = _ajax;
          _old_sync.call.apply(_old_sync, [this].concat(__slice.call(args)));
          return $.ajax = _old_ajax;
        });
      }
    };

    ActionMessenger.prototype._getHandlerResponse = function(returnVal) {
      if (returnVal === false) {
        return false;
      }
      if (returnVal === true || !(returnVal != null)) {
        return true;
      }
      return returnVal;
    };

    ActionMessenger.prototype._parseEvents = function(events) {
      var desc, firstSpace, func, label, out, type, _ref2;
      if (events == null) {
        events = {};
      }
      out = {};
      for (label in events) {
        func = events[label];
        firstSpace = label.indexOf(' ');
        type = label.substring(0, firstSpace);
        desc = label.substring(firstSpace + 1);
        if ((_ref2 = out[type]) == null) {
          out[type] = {};
        }
        out[type][desc] = func;
      }
      return out;
    };

    ActionMessenger.prototype._normalizeResponse = function() {
      var data, elem, resp, type, xhr, _i, _len;
      resp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      type = null;
      xhr = null;
      data = null;
      for (_i = 0, _len = resp.length; _i < _len; _i++) {
        elem = resp[_i];
        if (elem === 'success' || elem === 'timeout' || elem === 'abort') {
          type = elem;
        } else if (((elem != null ? elem.readyState : void 0) != null) && ((elem != null ? elem.responseText : void 0) != null)) {
          xhr = elem;
        } else if (_.isObject(elem)) {
          data = elem;
        }
      }
      return [type, data, xhr];
    };

    ActionMessenger.prototype.run = function() {
      var args, events, getMessageText, handler, handlers, m_opts, msg, old, opts, type, _ref2,
        _this = this;
      m_opts = arguments[0], opts = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (opts == null) {
        opts = {};
      }
      m_opts = $.extend(true, {}, this.messageDefaults, this.doDefaults, m_opts != null ? m_opts : {});
      events = this._parseEvents(m_opts.events);
      getMessageText = function(type, xhr) {
        var message;
        message = m_opts[type + 'Message'];
        if (_.isFunction(message)) {
          return message.call(_this, type, xhr);
        }
        return message;
      };
      msg = (_ref2 = m_opts.messageInstance) != null ? _ref2 : this.newMessage(m_opts);
      if (m_opts.id != null) {
        msg.options.id = m_opts.id;
      }
      if (m_opts.progressMessage != null) {
        msg.update($.extend({}, m_opts, {
          message: getMessageText('progress', null),
          type: 'info'
        }));
      }
      handlers = {};
      _.each(['error', 'success'], function(type) {
        var originalHandler;
        originalHandler = opts[type];
        return handlers[type] = function() {
          var data, defaultOpts, handlerResp, msgOpts, reason, resp, responseOpts, xhr, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
          resp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _ref3 = _this._normalizeResponse.apply(_this, resp), reason = _ref3[0], data = _ref3[1], xhr = _ref3[2];
          if (type === 'success' && !(msg.errorCount != null) && m_opts.showSuccessWithoutError === false) {
            m_opts['successMessage'] = null;
          }
          if (type === 'error') {
            if ((_ref4 = m_opts.errorCount) == null) {
              m_opts.errorCount = 0;
            }
            m_opts.errorCount += 1;
          }
          handlerResp = m_opts.returnsPromise ? resp[0] : typeof originalHandler === "function" ? originalHandler.apply(null, resp) : void 0;
          responseOpts = _this._getHandlerResponse(handlerResp);
          if (_.isString(responseOpts)) {
            responseOpts = {
              message: responseOpts
            };
          }
          if (type === 'error' && ((xhr != null ? xhr.status : void 0) === 0 || reason === 'abort')) {
            msg.hide();
            return;
          }
          if (type === 'error' && ((m_opts.ignoredErrorCodes != null) && (_ref5 = xhr != null ? xhr.status : void 0, __indexOf.call(m_opts.ignoredErrorCodes, _ref5) >= 0))) {
            msg.hide();
            return;
          }
          defaultOpts = {
            message: getMessageText(type, xhr),
            type: type,
            events: (_ref6 = events[type]) != null ? _ref6 : {},
            hideOnNavigate: type === 'success'
          };
          msgOpts = $.extend({}, m_opts, defaultOpts, responseOpts);
          if (typeof ((_ref7 = msgOpts.retry) != null ? _ref7.allow : void 0) === 'number') {
            msgOpts.retry.allow--;
          }
          if (type === 'error' && (xhr != null ? xhr.status : void 0) >= 500 && ((_ref8 = msgOpts.retry) != null ? _ref8.allow : void 0)) {
            if (msgOpts.retry.delay == null) {
              if (msgOpts.errorCount < 4) {
                msgOpts.retry.delay = 10;
              } else {
                msgOpts.retry.delay = 5 * 60;
              }
            }
            if (msgOpts.hideAfter) {
              if ((_ref9 = msgOpts._hideAfter) == null) {
                msgOpts._hideAfter = msgOpts.hideAfter;
              }
              msgOpts.hideAfter = msgOpts._hideAfter + msgOpts.retry.delay;
            }
            msgOpts._retryActions = true;
            msgOpts.actions = {
              retry: {
                label: 'retry now',
                phrase: 'Retrying TIME',
                auto: msgOpts.retry.auto,
                delay: msgOpts.retry.delay,
                action: function() {
                  msgOpts.messageInstance = msg;
                  return setTimeout(function() {
                    return _this["do"].apply(_this, [msgOpts, opts].concat(__slice.call(args)));
                  }, 0);
                }
              },
              cancel: {
                action: function() {
                  return msg.cancel();
                }
              }
            };
          } else if (msgOpts._retryActions) {
            delete msgOpts.actions.retry;
            delete msgOpts.actions.cancel;
            delete m_opts._retryActions;
          }
          msg.update(msgOpts);
          if (responseOpts && msgOpts.message) {
            Messenger(_.extend({}, _this.options, {
              instance: _this
            }));
            return msg.show();
          } else {
            return msg.hide();
          }
        };
      });
      if (!m_opts.returnsPromise) {
        for (type in handlers) {
          handler = handlers[type];
          old = opts[type];
          opts[type] = handler;
        }
      }
      msg._actionInstance = m_opts.action.apply(m_opts, [opts].concat(__slice.call(args)));
      if (m_opts.returnsPromise) {
        msg._actionInstance.then(handlers.success, handlers.error);
      }
      return msg;
    };

    ActionMessenger.prototype["do"] = ActionMessenger.prototype.run;

    ActionMessenger.prototype.ajax = function() {
      var args, m_opts;
      m_opts = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      m_opts.action = $.ajax;
      return this.run.apply(this, [m_opts].concat(__slice.call(args)));
    };

    ActionMessenger.prototype.expectPromise = function(action, m_opts) {
      m_opts = _.extend({}, m_opts, {
        action: action,
        returnsPromise: true
      });
      return this.run(m_opts);
    };

    ActionMessenger.prototype.error = function(m_opts) {
      if (m_opts == null) {
        m_opts = {};
      }
      if (typeof m_opts === 'string') {
        m_opts = {
          message: m_opts
        };
      }
      m_opts.type = 'error';
      return this.post(m_opts);
    };

    ActionMessenger.prototype.info = function(m_opts) {
      if (m_opts == null) {
        m_opts = {};
      }
      if (typeof m_opts === 'string') {
        m_opts = {
          message: m_opts
        };
      }
      m_opts.type = 'info';
      return this.post(m_opts);
    };

    ActionMessenger.prototype.success = function(m_opts) {
      if (m_opts == null) {
        m_opts = {};
      }
      if (typeof m_opts === 'string') {
        m_opts = {
          message: m_opts
        };
      }
      m_opts.type = 'success';
      return this.post(m_opts);
    };

    return ActionMessenger;

  })(_Messenger);

  $.fn.messenger = function() {
    var $el, args, func, instance, opts, _ref2, _ref3, _ref4;
    func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (func == null) {
      func = {};
    }
    $el = this;
    if (!(func != null) || !_.isString(func)) {
      opts = func;
      if (!($el.data('messenger') != null)) {
        _Messenger = (_ref2 = (_ref3 = Messenger.themes[opts.theme]) != null ? _ref3.Messenger : void 0) != null ? _ref2 : ActionMessenger;
        $el.data('messenger', instance = new _Messenger($.extend({
          el: $el
        }, opts)));
        instance.render();
      }
      return $el.data('messenger');
    } else {
      return (_ref4 = $el.data('messenger'))[func].apply(_ref4, args);
    }
  };

  window.Messenger._call = function(opts) {
    var $el, $parent, choosen_loc, chosen_loc, classes, defaultOpts, inst, loc, locations, _i, _len;
    defaultOpts = {
      extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
      theme: 'future',
      maxMessages: 9,
      parentLocations: ['body']
    };
    opts = $.extend(defaultOpts, $._messengerDefaults, Messenger.options, opts);
    if (opts.theme != null) {
      opts.extraClasses += " messenger-theme-" + opts.theme;
    }
    inst = opts.instance || Messenger.instance;
    if (opts.instance == null) {
      locations = opts.parentLocations;
      $parent = null;
      choosen_loc = null;
      for (_i = 0, _len = locations.length; _i < _len; _i++) {
        loc = locations[_i];
        $parent = $(loc);
        if ($parent.length) {
          chosen_loc = loc;
          break;
        }
      }
      if (!inst) {
        $el = $('<ul>');
        $parent.prepend($el);
        inst = $el.messenger(opts);
        inst._location = chosen_loc;
        Messenger.instance = inst;
      } else if (!$(inst._location).is($(chosen_loc))) {
        inst.$el.detach();
        $parent.prepend(inst.$el);
      }
    }
    if (inst._addedClasses != null) {
      inst.$el.removeClass(inst._addedClasses);
    }
    inst.$el.addClass(classes = "" + inst.className + " " + opts.extraClasses);
    inst._addedClasses = classes;
    return inst;
  };

  $.extend(Messenger, {
    Message: RetryingMessage,
    Messenger: ActionMessenger,
    themes: (_ref2 = Messenger.themes) != null ? _ref2 : {}
  });

  $.globalMessenger = window.Messenger = Messenger;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/ng2-modal/Modal.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Modal = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function Modal() {
        this.closeOnEscape = true;
        this.closeOnOutsideClick = true;
        this.hideCloseButton = false;
        // -------------------------------------------------------------------------
        // Outputs
        // -------------------------------------------------------------------------
        this.onOpen = new core_1.EventEmitter(false);
        this.onClose = new core_1.EventEmitter(false);
        this.onSubmit = new core_1.EventEmitter(false);
        // -------------------------------------------------------------------------
        // Public properties
        // -------------------------------------------------------------------------
        this.isOpened = false;
        this.createBackDrop();
    }
    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------
    Modal.prototype.ngOnDestroy = function () {
        document.body.className = document.body.className.replace(/modal-open\b/, "");
        if (this.backdropElement && this.backdropElement.parentNode === document.body)
            document.body.removeChild(this.backdropElement);
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    Modal.prototype.open = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.isOpened)
            return;
        this.isOpened = true;
        this.onOpen.emit(args);
        document.body.appendChild(this.backdropElement);
        window.setTimeout(function () { return _this.modalRoot.nativeElement.focus(); }, 0);
        document.body.className += " modal-open";
    };
    Modal.prototype.close = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (!this.isOpened)
            return;
        this.isOpened = false;
        this.onClose.emit(args);
        document.body.removeChild(this.backdropElement);
        document.body.className = document.body.className.replace(/modal-open\b/, "");
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    Modal.prototype.preventClosing = function (event) {
        event.stopPropagation();
    };
    Modal.prototype.createBackDrop = function () {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("modal-backdrop");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "modalClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Modal.prototype, "closeOnEscape", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Modal.prototype, "closeOnOutsideClick", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "hideCloseButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "cancelButtonLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "submitButtonLabel", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "onOpen", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "onClose", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "onSubmit", void 0);
    __decorate([
        core_1.ViewChild("modalRoot"), 
        __metadata('design:type', core_1.ElementRef)
    ], Modal.prototype, "modalRoot", void 0);
    Modal = __decorate([
        core_1.Component({
            selector: "modal",
            template: "\n<div class=\"modal\" \n     tabindex=\"-1\"\n     role=\"dialog\"\n     #modalRoot\n     (keydown.esc)=\"closeOnEscape ? close() : 0\"\n     [ngClass]=\"{ in: isOpened, fade: isOpened }\"\n     [ngStyle]=\"{ display: isOpened ? 'block' : 'none' }\"\n     (click)=\"closeOnOutsideClick ? close() : 0\">\n    <div [class]=\"'modal-dialog ' + modalClass\" (click)=\"preventClosing($event)\">\n        <div class=\"modal-content\" tabindex=\"0\" *ngIf=\"isOpened\">\n            <div class=\"modal-header\">\n                <button *ngIf=\"!hideCloseButton\" type=\"button\" class=\"close\" data-dismiss=\"modal\" [attr.aria-label]=\"cancelButtonLabel || 'Close'\" (click)=\"close()\"><span aria-hidden=\"true\">&times;</span></button>\n                <h4 class=\"modal-title\" *ngIf=\"title\">{{ title }}</h4>\n                <ng-content select=\"modal-header\"></ng-content>\n            </div>\n            <div class=\"modal-body\">\n                <ng-content select=\"modal-content\"></ng-content>\n            </div>\n            <div class=\"modal-footer\">\n                <ng-content select=\"modal-footer\"></ng-content>\n                <button *ngIf=\"cancelButtonLabel\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" (click)=\"close()\">{{ cancelButtonLabel }}</button>\n                <button *ngIf=\"submitButtonLabel\" type=\"button\" class=\"btn btn-primary\" (click)=\"onSubmit.emit(undefined)\">{{ submitButtonLabel }}</button>\n            </div>\n        </div>\n    </div>\n</div>\n"
        }), 
        __metadata('design:paramtypes', [])
    ], Modal);
    return Modal;
}());
exports.Modal = Modal;

//# sourceMappingURL=Modal.js.map


/***/ },

/***/ "./node_modules/ng2-modal/RouteModal.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var RouteModal = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RouteModal(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.closeOnEscape = true;
        this.closeOnOutsideClick = true;
        this.hideCloseButton = false;
        // -------------------------------------------------------------------------
        // Outputs
        // -------------------------------------------------------------------------
        this.onOpen = new core_1.EventEmitter(false);
        this.onClose = new core_1.EventEmitter(false);
        this.onSubmit = new core_1.EventEmitter(false);
        this.isOpened = false;
        this.createBackDrop();
    }
    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------
    RouteModal.prototype.ngOnInit = function () {
        this.open();
    };
    RouteModal.prototype.ngOnDestroy = function () {
        document.body.className = document.body.className.replace(/modal-open\b/, "");
        if (this.backdropElement && this.backdropElement.parentNode === document.body)
            document.body.removeChild(this.backdropElement);
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    RouteModal.prototype.open = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.isOpened)
            return;
        this.isOpened = true;
        this.onOpen.emit(args);
        document.body.appendChild(this.backdropElement);
        window.setTimeout(function () { return _this.modalRoot.nativeElement.focus(); }, 0);
        document.body.className += " modal-open";
    };
    RouteModal.prototype.close = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (!this.isOpened)
            return;
        this.isOpened = false;
        this.onClose.emit(args);
        document.body.className = document.body.className.replace(/modal-open\b/, "");
        if (this.cancelUrl) {
            var navigationExtras = { relativeTo: this.activatedRoute };
            if (this.cancelUrlExtras) {
                navigationExtras = Object.assign(this.cancelUrlExtras);
            }
            this.router.navigate(this.cancelUrl, navigationExtras);
        }
        else {
            window.history.back();
        }
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    RouteModal.prototype.preventClosing = function (event) {
        event.stopPropagation();
    };
    RouteModal.prototype.createBackDrop = function () {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("modal-backdrop");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RouteModal.prototype, "cancelUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "cancelUrlExtras", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "modalClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RouteModal.prototype, "closeOnEscape", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RouteModal.prototype, "closeOnOutsideClick", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "hideCloseButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "cancelButtonLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "submitButtonLabel", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "onOpen", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "onClose", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "onSubmit", void 0);
    __decorate([
        core_1.ViewChild("modalRoot"), 
        __metadata('design:type', core_1.ElementRef)
    ], RouteModal.prototype, "modalRoot", void 0);
    RouteModal = __decorate([
        core_1.Component({
            selector: "route-modal",
            template: "\n<div class=\"modal route-modal\" \n     tabindex=\"-1\"\n     role=\"dialog\"\n     #modalRoot\n     (keydown.esc)=\"closeOnEscape ? close() : 0\"\n     [ngClass]=\"{ in: isOpened, fade: isOpened }\"\n     [ngStyle]=\"{ display: isOpened ? 'block' : 'none' }\"\n     (click)=\"closeOnOutsideClick ? close() : 0\">\n    <div [class]=\"'modal-dialog ' + modalClass\" (click)=\"preventClosing($event)\">\n        <div class=\"modal-content\" tabindex=\"0\" *ngIf=\"isOpened\">\n            <div class=\"modal-header\">\n                <button *ngIf=\"!hideCloseButton\" type=\"button\" class=\"close\" data-dismiss=\"modal\" [attr.aria-label]=\"cancelButtonLabel || 'Close'\" (click)=\"close()\"><span aria-hidden=\"true\">&times;</span></button>\n                <h4 class=\"modal-title\" *ngIf=\"title\">{{ title }}</h4>\n                <ng-content select=\"modal-header\"></ng-content>\n            </div>\n            <div class=\"modal-body\">\n                <ng-content select=\"modal-content\"></ng-content>\n            </div>\n            <div class=\"modal-footer\">\n                <ng-content select=\"modal-footer\"></ng-content>\n                <button *ngIf=\"cancelButtonLabel\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" (click)=\"close()\">{{ cancelButtonLabel }}</button>\n                <button *ngIf=\"submitButtonLabel\" type=\"button\" class=\"btn btn-primary\" (click)=\"onSubmit.emit(undefined)\">{{ submitButtonLabel }}</button>\n            </div>\n        </div>\n    </div>\n</div>\n"
        }), 
        __metadata('design:paramtypes', [router_1.Router, router_1.ActivatedRoute])
    ], RouteModal);
    return RouteModal;
}());
exports.RouteModal = RouteModal;

//# sourceMappingURL=RouteModal.js.map


/***/ },

/***/ "./node_modules/ng2-modal/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var Modal_1 = __webpack_require__("./node_modules/ng2-modal/Modal.js");
var RouteModal_1 = __webpack_require__("./node_modules/ng2-modal/RouteModal.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
__export(__webpack_require__("./node_modules/ng2-modal/Modal.js"));
__export(__webpack_require__("./node_modules/ng2-modal/RouteModal.js"));
var ModalHeader = (function () {
    function ModalHeader() {
    }
    ModalHeader = __decorate([
        core_1.Component({
            selector: "modal-header",
            template: "<ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [])
    ], ModalHeader);
    return ModalHeader;
}());
exports.ModalHeader = ModalHeader;
var ModalContent = (function () {
    function ModalContent() {
    }
    ModalContent = __decorate([
        core_1.Component({
            selector: "modal-content",
            template: "<ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [])
    ], ModalContent);
    return ModalContent;
}());
exports.ModalContent = ModalContent;
var ModalFooter = (function () {
    function ModalFooter() {
    }
    ModalFooter = __decorate([
        core_1.Component({
            selector: "modal-footer",
            template: "<ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [])
    ], ModalFooter);
    return ModalFooter;
}());
exports.ModalFooter = ModalFooter;
var ModalModule = (function () {
    function ModalModule() {
    }
    ModalModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                Modal_1.Modal,
                RouteModal_1.RouteModal,
                ModalHeader,
                ModalContent,
                ModalFooter,
            ],
            exports: [
                Modal_1.Modal,
                RouteModal_1.RouteModal,
                ModalHeader,
                ModalContent,
                ModalFooter,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], ModalModule);
    return ModalModule;
}());
exports.ModalModule = ModalModule;

//# sourceMappingURL=index.js.map


/***/ },

/***/ "./node_modules/ng2-select2/ng2-select2.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var select2_component_1 = __webpack_require__("./node_modules/ng2-select2/src/select2.component.js");
var select2_component_2 = __webpack_require__("./node_modules/ng2-select2/src/select2.component.js");
exports.Select2Component = select2_component_2.Select2Component;
var Select2Module = (function () {
    function Select2Module() {
    }
    Select2Module = __decorate([
        core_1.NgModule({
            exports: [select2_component_1.Select2Component],
            declarations: [select2_component_1.Select2Component],
            providers: [select2_component_1.Select2Component]
        }), 
        __metadata('design:paramtypes', [])
    ], Select2Module);
    return Select2Module;
}());
exports.Select2Module = Select2Module;


/***/ },

/***/ "./node_modules/ng2-select2/src/select2.component.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Select2Component = (function () {
    function Select2Component() {
        this.valueChanged = new core_1.EventEmitter();
        this.blur = new core_1.EventEmitter();
    }
    Select2Component.prototype.ngAfterViewInit = function () {
	console.log(this.data);
        if (this.data) {
            var that_1 = this;
            this.element = jQuery(this.selector.nativeElement);
            this.element.select2({
                data: this.data,
                templateResult: this.templateResult,
                templateSelection: this.templateSelection,
                theme: (this.theme) ? this.theme : 'default',
                width: (this.width) ? this.width : 'resolve'
            });
            if (typeof this.value !== 'undefined') {
                this.element.val(that_1.value).trigger('change');
            }
            this.element.on('select2:select', function (e) {
                that_1.valueChanged.emit({
                    value: that_1.selector.nativeElement.value
                });
            });
        }
    };
    Select2Component.prototype.ngOnDestroy = function () {
        this.element.off("select2:select");
    };
    __decorate([
        core_1.ViewChild('selector'), 
        __metadata('design:type', core_1.ElementRef)
    ], Select2Component.prototype, "selector", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], Select2Component.prototype, "data", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Select2Component.prototype, "value", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Select2Component.prototype, "valueChanged", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Select2Component.prototype, "blur", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Select2Component.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Select2Component.prototype, "theme", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], Select2Component.prototype, "templateSelection", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], Select2Component.prototype, "templateResult", void 0);
    Select2Component = __decorate([
        core_1.Component({
            selector: 'select2',
            template: '<select #selector></select>',
            styles: ["\n    .select2-container {\n    box-sizing: border-box;\n    display: inline-block;\n    margin: 0;\n    position: relative;\n    vertical-align: middle;\n    min-width: 100px; }\n.select2-container .select2-selection--single {\n    box-sizing: border-box;\n    cursor: pointer;\n    display: block;\n    height: 28px;\n    user-select: none;\n    -webkit-user-select: none; }\n.select2-container .select2-selection--single .select2-selection__rendered {\n    display: block;\n    padding-left: 8px;\n    padding-right: 20px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n.select2-container .select2-selection--single .select2-selection__clear {\n    position: relative; }\n.select2-container[dir=\"rtl\"] .select2-selection--single .select2-selection__rendered {\n    padding-right: 8px;\n    padding-left: 20px; }\n.select2-container .select2-selection--multiple {\n    box-sizing: border-box;\n    cursor: pointer;\n    display: block;\n    min-height: 32px;\n    user-select: none;\n    -webkit-user-select: none; }\n.select2-container .select2-selection--multiple .select2-selection__rendered {\n    display: inline-block;\n    overflow: hidden;\n    padding-left: 8px;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n.select2-container .select2-search--inline {\n    float: left; }\n.select2-container .select2-search--inline .select2-search__field {\n    box-sizing: border-box;\n    border: none;\n    font-size: 100%;\n    margin-top: 5px;\n    padding: 0; }\n.select2-container .select2-search--inline .select2-search__field::-webkit-search-cancel-button {\n    -webkit-appearance: none; }\n\n.select2-dropdown {\n    background-color: white;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    box-sizing: border-box;\n    display: block;\n    position: absolute;\n    left: -100000px;\n    width: 100%;\n    z-index: 1051; }\n\n.select2-results {\n    display: block; }\n\n.select2-results__options {\n    list-style: none;\n    margin: 0;\n    padding: 0; }\n\n.select2-results__option {\n    padding: 6px;\n    user-select: none;\n    -webkit-user-select: none; }\n.select2-results__option[aria-selected] {\n    cursor: pointer; }\n\n.select2-container--open .select2-dropdown {\n    left: 0; }\n\n.select2-container--open .select2-dropdown--above {\n    border-bottom: none;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0; }\n\n.select2-container--open .select2-dropdown--below {\n    border-top: none;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.select2-search--dropdown {\n    display: block;\n    padding: 4px; }\n.select2-search--dropdown .select2-search__field {\n    padding: 4px;\n    width: 100%;\n    box-sizing: border-box; }\n.select2-search--dropdown .select2-search__field::-webkit-search-cancel-button {\n    -webkit-appearance: none; }\n.select2-search--dropdown.select2-search--hide {\n    display: none; }\n\n.select2-close-mask {\n    border: 0;\n    margin: 0;\n    padding: 0;\n    display: block;\n    position: fixed;\n    left: 0;\n    top: 0;\n    min-height: 100%;\n    min-width: 100%;\n    height: auto;\n    width: auto;\n    opacity: 0;\n    z-index: 99;\n    background-color: #fff;\n    filter: alpha(opacity=0); }\n\n.select2-hidden-accessible {\n    border: 0 !important;\n    clip: rect(0 0 0 0) !important;\n    height: 1px !important;\n    margin: -1px !important;\n    overflow: hidden !important;\n    padding: 0 !important;\n    position: absolute !important;\n    width: 1px !important; }\n\n.select2-container--default .select2-selection--single {\n    background-color: #fff;\n    border: 1px solid #aaa;\n    border-radius: 4px; }\n.select2-container--default .select2-selection--single .select2-selection__rendered {\n    color: #444;\n    line-height: 28px; }\n.select2-container--default .select2-selection--single .select2-selection__clear {\n    cursor: pointer;\n    float: right;\n    font-weight: bold; }\n.select2-container--default .select2-selection--single .select2-selection__placeholder {\n    color: #999; }\n.select2-container--default .select2-selection--single .select2-selection__arrow {\n    height: 26px;\n    position: absolute;\n    top: 1px;\n    right: 1px;\n    width: 20px; }\n.select2-container--default .select2-selection--single .select2-selection__arrow b {\n    border-color: #888 transparent transparent transparent;\n    border-style: solid;\n    border-width: 5px 4px 0 4px;\n    height: 0;\n    left: 50%;\n    margin-left: -4px;\n    margin-top: -2px;\n    position: absolute;\n    top: 50%;\n    width: 0; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--single .select2-selection__clear {\n    float: left; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow {\n    left: 1px;\n    right: auto; }\n\n.select2-container--default.select2-container--disabled .select2-selection--single {\n    background-color: #eee;\n    cursor: default; }\n.select2-container--default.select2-container--disabled .select2-selection--single .select2-selection__clear {\n    display: none; }\n\n.select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {\n    border-color: transparent transparent #888 transparent;\n    border-width: 0 4px 5px 4px; }\n\n.select2-container--default .select2-selection--multiple {\n    background-color: white;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: text; }\n.select2-container--default .select2-selection--multiple .select2-selection__rendered {\n    box-sizing: border-box;\n    list-style: none;\n    margin: 0;\n    padding: 0 5px;\n    width: 100%; }\n.select2-container--default .select2-selection--multiple .select2-selection__rendered li {\n    list-style: none; }\n.select2-container--default .select2-selection--multiple .select2-selection__placeholder {\n    color: #999;\n    margin-top: 5px;\n    float: left; }\n.select2-container--default .select2-selection--multiple .select2-selection__clear {\n    cursor: pointer;\n    float: right;\n    font-weight: bold;\n    margin-top: 5px;\n    margin-right: 10px; }\n.select2-container--default .select2-selection--multiple .select2-selection__choice {\n    background-color: #e4e4e4;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: default;\n    float: left;\n    margin-right: 5px;\n    margin-top: 5px;\n    padding: 0 5px; }\n.select2-container--default .select2-selection--multiple .select2-selection__choice__remove {\n    color: #999;\n    cursor: pointer;\n    display: inline-block;\n    font-weight: bold;\n    margin-right: 2px; }\n.select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {\n    color: #333; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice, .select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__placeholder, .select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-search--inline {\n    float: right; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n    margin-left: 5px;\n    margin-right: auto; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice__remove {\n    margin-left: 2px;\n    margin-right: auto; }\n\n.select2-container--default.select2-container--focus .select2-selection--multiple {\n    border: solid black 1px;\n    outline: 0; }\n\n.select2-container--default.select2-container--disabled .select2-selection--multiple {\n    background-color: #eee;\n    cursor: default; }\n\n.select2-container--default.select2-container--disabled .select2-selection__choice__remove {\n    display: none; }\n\n.select2-container--default.select2-container--open.select2-container--above .select2-selection--single, .select2-container--default.select2-container--open.select2-container--above .select2-selection--multiple {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple {\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0; }\n\n.select2-container--default .select2-search--dropdown .select2-search__field {\n    border: 1px solid #aaa; }\n\n.select2-container--default .select2-search--inline .select2-search__field {\n    background: transparent;\n    border: none;\n    outline: 0;\n    box-shadow: none;\n    -webkit-appearance: textfield; }\n\n.select2-container--default .select2-results > .select2-results__options {\n    max-height: 200px;\n    overflow-y: auto; }\n\n.select2-container--default .select2-results__option[role=group] {\n    padding: 0; }\n\n.select2-container--default .select2-results__option[aria-disabled=true] {\n    color: #999; }\n\n.select2-container--default .select2-results__option[aria-selected=true] {\n    background-color: #ddd; }\n\n.select2-container--default .select2-results__option .select2-results__option {\n    padding-left: 1em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__group {\n    padding-left: 0; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -1em;\n    padding-left: 2em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -2em;\n    padding-left: 3em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -3em;\n    padding-left: 4em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -4em;\n    padding-left: 5em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -5em;\n    padding-left: 6em; }\n\n.select2-container--default .select2-results__option--highlighted[aria-selected] {\n    background-color: #5897fb;\n    color: white; }\n\n.select2-container--default .select2-results__group {\n    cursor: default;\n    display: block;\n    padding: 6px; }\n\n.select2-container--classic .select2-selection--single {\n    background-color: #f7f7f7;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    outline: 0;\n    background-image: -webkit-linear-gradient(top, white 50%, #eeeeee 100%);\n    background-image: -o-linear-gradient(top, white 50%, #eeeeee 100%);\n    background-image: linear-gradient(to bottom, white 50%, #eeeeee 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFFFFFF', endColorstr='#FFEEEEEE', GradientType=0); }\n.select2-container--classic .select2-selection--single:focus {\n    border: 1px solid #5897fb; }\n.select2-container--classic .select2-selection--single .select2-selection__rendered {\n    color: #444;\n    line-height: 28px; }\n.select2-container--classic .select2-selection--single .select2-selection__clear {\n    cursor: pointer;\n    float: right;\n    font-weight: bold;\n    margin-right: 10px; }\n.select2-container--classic .select2-selection--single .select2-selection__placeholder {\n    color: #999; }\n.select2-container--classic .select2-selection--single .select2-selection__arrow {\n    background-color: #ddd;\n    border: none;\n    border-left: 1px solid #aaa;\n    border-top-right-radius: 4px;\n    border-bottom-right-radius: 4px;\n    height: 26px;\n    position: absolute;\n    top: 1px;\n    right: 1px;\n    width: 20px;\n    background-image: -webkit-linear-gradient(top, #eeeeee 50%, #cccccc 100%);\n    background-image: -o-linear-gradient(top, #eeeeee 50%, #cccccc 100%);\n    background-image: linear-gradient(to bottom, #eeeeee 50%, #cccccc 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFEEEEEE', endColorstr='#FFCCCCCC', GradientType=0); }\n.select2-container--classic .select2-selection--single .select2-selection__arrow b {\n    border-color: #888 transparent transparent transparent;\n    border-style: solid;\n    border-width: 5px 4px 0 4px;\n    height: 0;\n    left: 50%;\n    margin-left: -4px;\n    margin-top: -2px;\n    position: absolute;\n    top: 50%;\n    width: 0; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--single .select2-selection__clear {\n    float: left; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow {\n    border: none;\n    border-right: 1px solid #aaa;\n    border-radius: 0;\n    border-top-left-radius: 4px;\n    border-bottom-left-radius: 4px;\n    left: 1px;\n    right: auto; }\n\n.select2-container--classic.select2-container--open .select2-selection--single {\n    border: 1px solid #5897fb; }\n.select2-container--classic.select2-container--open .select2-selection--single .select2-selection__arrow {\n    background: transparent;\n    border: none; }\n.select2-container--classic.select2-container--open .select2-selection--single .select2-selection__arrow b {\n    border-color: transparent transparent #888 transparent;\n    border-width: 0 4px 5px 4px; }\n\n.select2-container--classic.select2-container--open.select2-container--above .select2-selection--single {\n    border-top: none;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    background-image: -webkit-linear-gradient(top, white 0%, #eeeeee 50%);\n    background-image: -o-linear-gradient(top, white 0%, #eeeeee 50%);\n    background-image: linear-gradient(to bottom, white 0%, #eeeeee 50%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFFFFFF', endColorstr='#FFEEEEEE', GradientType=0); }\n\n.select2-container--classic.select2-container--open.select2-container--below .select2-selection--single {\n    border-bottom: none;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    background-image: -webkit-linear-gradient(top, #eeeeee 50%, white 100%);\n    background-image: -o-linear-gradient(top, #eeeeee 50%, white 100%);\n    background-image: linear-gradient(to bottom, #eeeeee 50%, white 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFEEEEEE', endColorstr='#FFFFFFFF', GradientType=0); }\n\n.select2-container--classic .select2-selection--multiple {\n    background-color: white;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: text;\n    outline: 0; }\n.select2-container--classic .select2-selection--multiple:focus {\n    border: 1px solid #5897fb; }\n.select2-container--classic .select2-selection--multiple .select2-selection__rendered {\n    list-style: none;\n    margin: 0;\n    padding: 0 5px; }\n.select2-container--classic .select2-selection--multiple .select2-selection__clear {\n    display: none; }\n.select2-container--classic .select2-selection--multiple .select2-selection__choice {\n    background-color: #e4e4e4;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: default;\n    float: left;\n    margin-right: 5px;\n    margin-top: 5px;\n    padding: 0 5px; }\n.select2-container--classic .select2-selection--multiple .select2-selection__choice__remove {\n    color: #888;\n    cursor: pointer;\n    display: inline-block;\n    font-weight: bold;\n    margin-right: 2px; }\n.select2-container--classic .select2-selection--multiple .select2-selection__choice__remove:hover {\n    color: #555; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n    float: right; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n    margin-left: 5px;\n    margin-right: auto; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice__remove {\n    margin-left: 2px;\n    margin-right: auto; }\n\n.select2-container--classic.select2-container--open .select2-selection--multiple {\n    border: 1px solid #5897fb; }\n\n.select2-container--classic.select2-container--open.select2-container--above .select2-selection--multiple {\n    border-top: none;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.select2-container--classic.select2-container--open.select2-container--below .select2-selection--multiple {\n    border-bottom: none;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0; }\n\n.select2-container--classic .select2-search--dropdown .select2-search__field {\n    border: 1px solid #aaa;\n    outline: 0; }\n\n.select2-container--classic .select2-search--inline .select2-search__field {\n    outline: 0;\n    box-shadow: none; }\n\n.select2-container--classic .select2-dropdown {\n    background-color: white;\n    border: 1px solid transparent; }\n\n.select2-container--classic .select2-dropdown--above {\n    border-bottom: none; }\n\n.select2-container--classic .select2-dropdown--below {\n    border-top: none; }\n\n.select2-container--classic .select2-results > .select2-results__options {\n    max-height: 200px;\n    overflow-y: auto; }\n\n.select2-container--classic .select2-results__option[role=group] {\n    padding: 0; }\n\n.select2-container--classic .select2-results__option[aria-disabled=true] {\n    color: grey; }\n\n.select2-container--classic .select2-results__option--highlighted[aria-selected] {\n    background-color: #3875d7;\n    color: white; }\n\n.select2-container--classic .select2-results__group {\n    cursor: default;\n    display: block;\n    padding: 6px; }\n\n.select2-container--classic.select2-container--open .select2-dropdown {\n    border-color: #5897fb; }\n\n    "],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], Select2Component);
    return Select2Component;
}());
exports.Select2Component = Select2Component;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/quill/dist/quill.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
 * Quill Editor v1.1.9
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Quill"] = factory();
	else
		root["Quill"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(53);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _break = __webpack_require__(30);

	var _break2 = _interopRequireDefault(_break);

	var _container = __webpack_require__(42);

	var _container2 = _interopRequireDefault(_container);

	var _cursor = __webpack_require__(34);

	var _cursor2 = _interopRequireDefault(_cursor);

	var _embed = __webpack_require__(31);

	var _embed2 = _interopRequireDefault(_embed);

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	var _scroll = __webpack_require__(43);

	var _scroll2 = _interopRequireDefault(_scroll);

	var _text = __webpack_require__(33);

	var _text2 = _interopRequireDefault(_text);

	var _clipboard = __webpack_require__(44);

	var _clipboard2 = _interopRequireDefault(_clipboard);

	var _history = __webpack_require__(51);

	var _history2 = _interopRequireDefault(_history);

	var _keyboard = __webpack_require__(52);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_quill2.default.register({
	  'blots/block': _block2.default,
	  'blots/block/embed': _block.BlockEmbed,
	  'blots/break': _break2.default,
	  'blots/container': _container2.default,
	  'blots/cursor': _cursor2.default,
	  'blots/embed': _embed2.default,
	  'blots/inline': _inline2.default,
	  'blots/scroll': _scroll2.default,
	  'blots/text': _text2.default,

	  'modules/clipboard': _clipboard2.default,
	  'modules/history': _history2.default,
	  'modules/keyboard': _keyboard2.default
	});

	_parchment2.default.register(_block2.default, _break2.default, _cursor2.default, _inline2.default, _scroll2.default, _text2.default);

	module.exports = _quill2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var container_1 = __webpack_require__(3);
	var format_1 = __webpack_require__(7);
	var leaf_1 = __webpack_require__(12);
	var scroll_1 = __webpack_require__(13);
	var inline_1 = __webpack_require__(14);
	var block_1 = __webpack_require__(15);
	var embed_1 = __webpack_require__(16);
	var text_1 = __webpack_require__(17);
	var attributor_1 = __webpack_require__(8);
	var class_1 = __webpack_require__(10);
	var style_1 = __webpack_require__(11);
	var store_1 = __webpack_require__(9);
	var Registry = __webpack_require__(6);
	var Parchment = {
	    Scope: Registry.Scope,
	    create: Registry.create,
	    find: Registry.find,
	    query: Registry.query,
	    register: Registry.register,
	    Container: container_1.default,
	    Format: format_1.default,
	    Leaf: leaf_1.default,
	    Embed: embed_1.default,
	    Scroll: scroll_1.default,
	    Block: block_1.default,
	    Inline: inline_1.default,
	    Text: text_1.default,
	    Attributor: {
	        Attribute: attributor_1.default,
	        Class: class_1.default,
	        Style: style_1.default,
	        Store: store_1.default
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Parchment;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var linked_list_1 = __webpack_require__(4);
	var shadow_1 = __webpack_require__(5);
	var Registry = __webpack_require__(6);
	var ContainerBlot = (function (_super) {
	    __extends(ContainerBlot, _super);
	    function ContainerBlot() {
	        return _super.apply(this, arguments) || this;
	    }
	    ContainerBlot.prototype.appendChild = function (other) {
	        this.insertBefore(other);
	    };
	    ContainerBlot.prototype.attach = function () {
	        var _this = this;
	        _super.prototype.attach.call(this);
	        this.children = new linked_list_1.default();
	        // Need to be reversed for if DOM nodes already in order
	        [].slice.call(this.domNode.childNodes).reverse().forEach(function (node) {
	            try {
	                var child = makeBlot(node);
	                _this.insertBefore(child, _this.children.head);
	            }
	            catch (err) {
	                if (err instanceof Registry.ParchmentError)
	                    return;
	                else
	                    throw err;
	            }
	        });
	    };
	    ContainerBlot.prototype.deleteAt = function (index, length) {
	        if (index === 0 && length === this.length()) {
	            return this.remove();
	        }
	        this.children.forEachAt(index, length, function (child, offset, length) {
	            child.deleteAt(offset, length);
	        });
	    };
	    ContainerBlot.prototype.descendant = function (criteria, index) {
	        var _a = this.children.find(index), child = _a[0], offset = _a[1];
	        if ((criteria.blotName == null && criteria(child)) ||
	            (criteria.blotName != null && child instanceof criteria)) {
	            return [child, offset];
	        }
	        else if (child instanceof ContainerBlot) {
	            return child.descendant(criteria, offset);
	        }
	        else {
	            return [null, -1];
	        }
	    };
	    ContainerBlot.prototype.descendants = function (criteria, index, length) {
	        if (index === void 0) { index = 0; }
	        if (length === void 0) { length = Number.MAX_VALUE; }
	        var descendants = [], lengthLeft = length;
	        this.children.forEachAt(index, length, function (child, index, length) {
	            if ((criteria.blotName == null && criteria(child)) ||
	                (criteria.blotName != null && child instanceof criteria)) {
	                descendants.push(child);
	            }
	            if (child instanceof ContainerBlot) {
	                descendants = descendants.concat(child.descendants(criteria, index, lengthLeft));
	            }
	            lengthLeft -= length;
	        });
	        return descendants;
	    };
	    ContainerBlot.prototype.detach = function () {
	        this.children.forEach(function (child) {
	            child.detach();
	        });
	        _super.prototype.detach.call(this);
	    };
	    ContainerBlot.prototype.formatAt = function (index, length, name, value) {
	        this.children.forEachAt(index, length, function (child, offset, length) {
	            child.formatAt(offset, length, name, value);
	        });
	    };
	    ContainerBlot.prototype.insertAt = function (index, value, def) {
	        var _a = this.children.find(index), child = _a[0], offset = _a[1];
	        if (child) {
	            child.insertAt(offset, value, def);
	        }
	        else {
	            var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
	            this.appendChild(blot);
	        }
	    };
	    ContainerBlot.prototype.insertBefore = function (childBlot, refBlot) {
	        if (this.statics.allowedChildren != null && !this.statics.allowedChildren.some(function (child) {
	            return childBlot instanceof child;
	        })) {
	            throw new Registry.ParchmentError("Cannot insert " + childBlot.statics.blotName + " into " + this.statics.blotName);
	        }
	        childBlot.insertInto(this, refBlot);
	    };
	    ContainerBlot.prototype.length = function () {
	        return this.children.reduce(function (memo, child) {
	            return memo + child.length();
	        }, 0);
	    };
	    ContainerBlot.prototype.moveChildren = function (targetParent, refNode) {
	        this.children.forEach(function (child) {
	            targetParent.insertBefore(child, refNode);
	        });
	    };
	    ContainerBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        if (this.children.length === 0) {
	            if (this.statics.defaultChild != null) {
	                var child = Registry.create(this.statics.defaultChild);
	                this.appendChild(child);
	                child.optimize();
	            }
	            else {
	                this.remove();
	            }
	        }
	    };
	    ContainerBlot.prototype.path = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        var _a = this.children.find(index, inclusive), child = _a[0], offset = _a[1];
	        var position = [[this, index]];
	        if (child instanceof ContainerBlot) {
	            return position.concat(child.path(offset, inclusive));
	        }
	        else if (child != null) {
	            position.push([child, offset]);
	        }
	        return position;
	    };
	    ContainerBlot.prototype.removeChild = function (child) {
	        this.children.remove(child);
	    };
	    ContainerBlot.prototype.replace = function (target) {
	        if (target instanceof ContainerBlot) {
	            target.moveChildren(this);
	        }
	        _super.prototype.replace.call(this, target);
	    };
	    ContainerBlot.prototype.split = function (index, force) {
	        if (force === void 0) { force = false; }
	        if (!force) {
	            if (index === 0)
	                return this;
	            if (index === this.length())
	                return this.next;
	        }
	        var after = this.clone();
	        this.parent.insertBefore(after, this.next);
	        this.children.forEachAt(index, this.length(), function (child, offset, length) {
	            child = child.split(offset, force);
	            after.appendChild(child);
	        });
	        return after;
	    };
	    ContainerBlot.prototype.unwrap = function () {
	        this.moveChildren(this.parent, this.next);
	        this.remove();
	    };
	    ContainerBlot.prototype.update = function (mutations) {
	        var _this = this;
	        var addedNodes = [], removedNodes = [];
	        mutations.forEach(function (mutation) {
	            if (mutation.target === _this.domNode && mutation.type === 'childList') {
	                addedNodes.push.apply(addedNodes, mutation.addedNodes);
	                removedNodes.push.apply(removedNodes, mutation.removedNodes);
	            }
	        });
	        removedNodes.forEach(function (node) {
	            // Check node has actually been removed
	            // One exception is Chrome does not immediately remove IFRAMEs
	            // from DOM but MutationRecord is correct in its reported removal
	            if (node.parentNode != null && node.tagName !== 'IFRAME' &&
	                (document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
	                return;
	            }
	            var blot = Registry.find(node);
	            if (blot == null)
	                return;
	            if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
	                blot.detach();
	            }
	        });
	        addedNodes.filter(function (node) {
	            return node.parentNode == _this.domNode;
	        }).sort(function (a, b) {
	            if (a === b)
	                return 0;
	            if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
	                return 1;
	            }
	            return -1;
	        }).forEach(function (node) {
	            var refBlot = null;
	            if (node.nextSibling != null) {
	                refBlot = Registry.find(node.nextSibling);
	            }
	            var blot = makeBlot(node);
	            if (blot.next != refBlot || blot.next == null) {
	                if (blot.parent != null) {
	                    blot.parent.removeChild(_this);
	                }
	                _this.insertBefore(blot, refBlot);
	            }
	        });
	    };
	    return ContainerBlot;
	}(shadow_1.default));
	function makeBlot(node) {
	    var blot = Registry.find(node);
	    if (blot == null) {
	        try {
	            blot = Registry.create(node);
	        }
	        catch (e) {
	            blot = Registry.create(Registry.Scope.INLINE);
	            [].slice.call(node.childNodes).forEach(function (child) {
	                blot.domNode.appendChild(child);
	            });
	            node.parentNode.replaceChild(blot.domNode, node);
	            blot.attach();
	        }
	    }
	    return blot;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ContainerBlot;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var LinkedList = (function () {
	    function LinkedList() {
	        this.head = this.tail = undefined;
	        this.length = 0;
	    }
	    LinkedList.prototype.append = function () {
	        var nodes = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            nodes[_i] = arguments[_i];
	        }
	        this.insertBefore(nodes[0], undefined);
	        if (nodes.length > 1) {
	            this.append.apply(this, nodes.slice(1));
	        }
	    };
	    LinkedList.prototype.contains = function (node) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            if (cur === node)
	                return true;
	        }
	        return false;
	    };
	    LinkedList.prototype.insertBefore = function (node, refNode) {
	        node.next = refNode;
	        if (refNode != null) {
	            node.prev = refNode.prev;
	            if (refNode.prev != null) {
	                refNode.prev.next = node;
	            }
	            refNode.prev = node;
	            if (refNode === this.head) {
	                this.head = node;
	            }
	        }
	        else if (this.tail != null) {
	            this.tail.next = node;
	            node.prev = this.tail;
	            this.tail = node;
	        }
	        else {
	            node.prev = undefined;
	            this.head = this.tail = node;
	        }
	        this.length += 1;
	    };
	    LinkedList.prototype.offset = function (target) {
	        var index = 0, cur = this.head;
	        while (cur != null) {
	            if (cur === target)
	                return index;
	            index += cur.length();
	            cur = cur.next;
	        }
	        return -1;
	    };
	    LinkedList.prototype.remove = function (node) {
	        if (!this.contains(node))
	            return;
	        if (node.prev != null)
	            node.prev.next = node.next;
	        if (node.next != null)
	            node.next.prev = node.prev;
	        if (node === this.head)
	            this.head = node.next;
	        if (node === this.tail)
	            this.tail = node.prev;
	        this.length -= 1;
	    };
	    LinkedList.prototype.iterator = function (curNode) {
	        if (curNode === void 0) { curNode = this.head; }
	        // TODO use yield when we can
	        return function () {
	            var ret = curNode;
	            if (curNode != null)
	                curNode = curNode.next;
	            return ret;
	        };
	    };
	    LinkedList.prototype.find = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            var length_1 = cur.length();
	            if (index < length_1 || (inclusive && index === length_1 && (cur.next == null || cur.next.length() !== 0))) {
	                return [cur, index];
	            }
	            index -= length_1;
	        }
	        return [null, 0];
	    };
	    LinkedList.prototype.forEach = function (callback) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            callback(cur);
	        }
	    };
	    LinkedList.prototype.forEachAt = function (index, length, callback) {
	        if (length <= 0)
	            return;
	        var _a = this.find(index), startNode = _a[0], offset = _a[1];
	        var cur, curIndex = index - offset, next = this.iterator(startNode);
	        while ((cur = next()) && curIndex < index + length) {
	            var curLength = cur.length();
	            if (index > curIndex) {
	                callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
	            }
	            else {
	                callback(cur, 0, Math.min(curLength, index + length - curIndex));
	            }
	            curIndex += curLength;
	        }
	    };
	    LinkedList.prototype.map = function (callback) {
	        return this.reduce(function (memo, cur) {
	            memo.push(callback(cur));
	            return memo;
	        }, []);
	    };
	    LinkedList.prototype.reduce = function (callback, memo) {
	        var cur, next = this.iterator();
	        while (cur = next()) {
	            memo = callback(memo, cur);
	        }
	        return memo;
	    };
	    return LinkedList;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LinkedList;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Registry = __webpack_require__(6);
	var ShadowBlot = (function () {
	    function ShadowBlot(domNode) {
	        this.domNode = domNode;
	        this.attach();
	    }
	    Object.defineProperty(ShadowBlot.prototype, "statics", {
	        // Hack for accessing inherited static methods
	        get: function () {
	            return this.constructor;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ShadowBlot.create = function (value) {
	        if (this.tagName == null) {
	            throw new Registry.ParchmentError('Blot definition missing tagName');
	        }
	        var node;
	        if (Array.isArray(this.tagName)) {
	            if (typeof value === 'string') {
	                value = value.toUpperCase();
	                if (parseInt(value).toString() === value) {
	                    value = parseInt(value);
	                }
	            }
	            if (typeof value === 'number') {
	                node = document.createElement(this.tagName[value - 1]);
	            }
	            else if (this.tagName.indexOf(value) > -1) {
	                node = document.createElement(value);
	            }
	            else {
	                node = document.createElement(this.tagName[0]);
	            }
	        }
	        else {
	            node = document.createElement(this.tagName);
	        }
	        if (this.className) {
	            node.classList.add(this.className);
	        }
	        return node;
	    };
	    ShadowBlot.prototype.attach = function () {
	        this.domNode[Registry.DATA_KEY] = { blot: this };
	    };
	    ShadowBlot.prototype.clone = function () {
	        var domNode = this.domNode.cloneNode();
	        return Registry.create(domNode);
	    };
	    ShadowBlot.prototype.detach = function () {
	        if (this.parent != null)
	            this.parent.removeChild(this);
	        delete this.domNode[Registry.DATA_KEY];
	    };
	    ShadowBlot.prototype.deleteAt = function (index, length) {
	        var blot = this.isolate(index, length);
	        blot.remove();
	    };
	    ShadowBlot.prototype.formatAt = function (index, length, name, value) {
	        var blot = this.isolate(index, length);
	        if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
	            blot.wrap(name, value);
	        }
	        else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
	            var parent_1 = Registry.create(this.statics.scope);
	            blot.wrap(parent_1);
	            parent_1.format(name, value);
	        }
	    };
	    ShadowBlot.prototype.insertAt = function (index, value, def) {
	        var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
	        var ref = this.split(index);
	        this.parent.insertBefore(blot, ref);
	    };
	    ShadowBlot.prototype.insertInto = function (parentBlot, refBlot) {
	        if (this.parent != null) {
	            this.parent.children.remove(this);
	        }
	        parentBlot.children.insertBefore(this, refBlot);
	        if (refBlot != null) {
	            var refDomNode = refBlot.domNode;
	        }
	        if (this.next == null || this.domNode.nextSibling != refDomNode) {
	            parentBlot.domNode.insertBefore(this.domNode, (typeof refDomNode !== 'undefined') ? refDomNode : null);
	        }
	        this.parent = parentBlot;
	    };
	    ShadowBlot.prototype.isolate = function (index, length) {
	        var target = this.split(index);
	        target.split(length);
	        return target;
	    };
	    ShadowBlot.prototype.length = function () {
	        return 1;
	    };
	    ;
	    ShadowBlot.prototype.offset = function (root) {
	        if (root === void 0) { root = this.parent; }
	        if (this.parent == null || this == root)
	            return 0;
	        return this.parent.children.offset(this) + this.parent.offset(root);
	    };
	    ShadowBlot.prototype.optimize = function () {
	        // TODO clean up once we use WeakMap
	        if (this.domNode[Registry.DATA_KEY] != null) {
	            delete this.domNode[Registry.DATA_KEY].mutations;
	        }
	    };
	    ShadowBlot.prototype.remove = function () {
	        if (this.domNode.parentNode != null) {
	            this.domNode.parentNode.removeChild(this.domNode);
	        }
	        this.detach();
	    };
	    ShadowBlot.prototype.replace = function (target) {
	        if (target.parent == null)
	            return;
	        target.parent.insertBefore(this, target.next);
	        target.remove();
	    };
	    ShadowBlot.prototype.replaceWith = function (name, value) {
	        var replacement = typeof name === 'string' ? Registry.create(name, value) : name;
	        replacement.replace(this);
	        return replacement;
	    };
	    ShadowBlot.prototype.split = function (index, force) {
	        return index === 0 ? this : this.next;
	    };
	    ShadowBlot.prototype.update = function (mutations) {
	        if (mutations === void 0) { mutations = []; }
	        // Nothing to do by default
	    };
	    ShadowBlot.prototype.wrap = function (name, value) {
	        var wrapper = typeof name === 'string' ? Registry.create(name, value) : name;
	        if (this.parent != null) {
	            this.parent.insertBefore(wrapper, this.next);
	        }
	        wrapper.appendChild(this);
	        return wrapper;
	    };
	    return ShadowBlot;
	}());
	ShadowBlot.blotName = 'abstract';
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ShadowBlot;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ParchmentError = (function (_super) {
	    __extends(ParchmentError, _super);
	    function ParchmentError(message) {
	        var _this;
	        message = '[Parchment] ' + message;
	        _this = _super.call(this, message) || this;
	        _this.message = message;
	        _this.name = _this.constructor.name;
	        return _this;
	    }
	    return ParchmentError;
	}(Error));
	exports.ParchmentError = ParchmentError;
	var attributes = {};
	var classes = {};
	var tags = {};
	var types = {};
	exports.DATA_KEY = '__blot';
	var Scope;
	(function (Scope) {
	    Scope[Scope["TYPE"] = 3] = "TYPE";
	    Scope[Scope["LEVEL"] = 12] = "LEVEL";
	    Scope[Scope["ATTRIBUTE"] = 13] = "ATTRIBUTE";
	    Scope[Scope["BLOT"] = 14] = "BLOT";
	    Scope[Scope["INLINE"] = 7] = "INLINE";
	    Scope[Scope["BLOCK"] = 11] = "BLOCK";
	    Scope[Scope["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
	    Scope[Scope["INLINE_BLOT"] = 6] = "INLINE_BLOT";
	    Scope[Scope["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
	    Scope[Scope["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
	    Scope[Scope["ANY"] = 15] = "ANY";
	})(Scope = exports.Scope || (exports.Scope = {}));
	;
	function create(input, value) {
	    var match = query(input);
	    if (match == null) {
	        throw new ParchmentError("Unable to create " + input + " blot");
	    }
	    var BlotClass = match;
	    var node = input instanceof Node ? input : BlotClass.create(value);
	    return new BlotClass(node, value);
	}
	exports.create = create;
	function find(node, bubble) {
	    if (bubble === void 0) { bubble = false; }
	    if (node == null)
	        return null;
	    if (node[exports.DATA_KEY] != null)
	        return node[exports.DATA_KEY].blot;
	    if (bubble)
	        return find(node.parentNode, bubble);
	    return null;
	}
	exports.find = find;
	function query(query, scope) {
	    if (scope === void 0) { scope = Scope.ANY; }
	    var match;
	    if (typeof query === 'string') {
	        match = types[query] || attributes[query];
	    }
	    else if (query instanceof Text) {
	        match = types['text'];
	    }
	    else if (typeof query === 'number') {
	        if (query & Scope.LEVEL & Scope.BLOCK) {
	            match = types['block'];
	        }
	        else if (query & Scope.LEVEL & Scope.INLINE) {
	            match = types['inline'];
	        }
	    }
	    else if (query instanceof HTMLElement) {
	        var names = (query.getAttribute('class') || '').split(/\s+/);
	        for (var i in names) {
	            match = classes[names[i]];
	            if (match)
	                break;
	        }
	        match = match || tags[query.tagName];
	    }
	    if (match == null)
	        return null;
	    if ((scope & Scope.LEVEL & match.scope) && (scope & Scope.TYPE & match.scope))
	        return match;
	    return null;
	}
	exports.query = query;
	function register() {
	    var Definitions = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        Definitions[_i] = arguments[_i];
	    }
	    if (Definitions.length > 1) {
	        return Definitions.map(function (d) {
	            return register(d);
	        });
	    }
	    var Definition = Definitions[0];
	    if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
	        throw new ParchmentError('Invalid definition');
	    }
	    else if (Definition.blotName === 'abstract') {
	        throw new ParchmentError('Cannot register abstract class');
	    }
	    types[Definition.blotName || Definition.attrName] = Definition;
	    if (typeof Definition.keyName === 'string') {
	        attributes[Definition.keyName] = Definition;
	    }
	    else {
	        if (Definition.className != null) {
	            classes[Definition.className] = Definition;
	        }
	        if (Definition.tagName != null) {
	            if (Array.isArray(Definition.tagName)) {
	                Definition.tagName = Definition.tagName.map(function (tagName) {
	                    return tagName.toUpperCase();
	                });
	            }
	            else {
	                Definition.tagName = Definition.tagName.toUpperCase();
	            }
	            var tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
	            tagNames.forEach(function (tag) {
	                if (tags[tag] == null || Definition.className == null) {
	                    tags[tag] = Definition;
	                }
	            });
	        }
	    }
	    return Definition;
	}
	exports.register = register;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(8);
	var store_1 = __webpack_require__(9);
	var container_1 = __webpack_require__(3);
	var Registry = __webpack_require__(6);
	var FormatBlot = (function (_super) {
	    __extends(FormatBlot, _super);
	    function FormatBlot() {
	        return _super.apply(this, arguments) || this;
	    }
	    FormatBlot.formats = function (domNode) {
	        if (typeof this.tagName === 'string') {
	            return true;
	        }
	        else if (Array.isArray(this.tagName)) {
	            return domNode.tagName.toLowerCase();
	        }
	        return undefined;
	    };
	    FormatBlot.prototype.attach = function () {
	        _super.prototype.attach.call(this);
	        this.attributes = new store_1.default(this.domNode);
	    };
	    FormatBlot.prototype.format = function (name, value) {
	        var format = Registry.query(name);
	        if (format instanceof attributor_1.default) {
	            this.attributes.attribute(format, value);
	        }
	        else if (value) {
	            if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
	                this.replaceWith(name, value);
	            }
	        }
	    };
	    FormatBlot.prototype.formats = function () {
	        var formats = this.attributes.values();
	        var format = this.statics.formats(this.domNode);
	        if (format != null) {
	            formats[this.statics.blotName] = format;
	        }
	        return formats;
	    };
	    FormatBlot.prototype.replaceWith = function (name, value) {
	        var replacement = _super.prototype.replaceWith.call(this, name, value);
	        this.attributes.copy(replacement);
	        return replacement;
	    };
	    FormatBlot.prototype.update = function (mutations) {
	        var _this = this;
	        _super.prototype.update.call(this, mutations);
	        if (mutations.some(function (mutation) {
	            return mutation.target === _this.domNode && mutation.type === 'attributes';
	        })) {
	            this.attributes.build();
	        }
	    };
	    FormatBlot.prototype.wrap = function (name, value) {
	        var wrapper = _super.prototype.wrap.call(this, name, value);
	        if (wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
	            this.attributes.move(wrapper);
	        }
	        return wrapper;
	    };
	    return FormatBlot;
	}(container_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = FormatBlot;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Registry = __webpack_require__(6);
	var Attributor = (function () {
	    function Attributor(attrName, keyName, options) {
	        if (options === void 0) { options = {}; }
	        this.attrName = attrName;
	        this.keyName = keyName;
	        var attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
	        if (options.scope != null) {
	            // Ignore type bits, force attribute bit
	            this.scope = (options.scope & Registry.Scope.LEVEL) | attributeBit;
	        }
	        else {
	            this.scope = Registry.Scope.ATTRIBUTE;
	        }
	        if (options.whitelist != null)
	            this.whitelist = options.whitelist;
	    }
	    Attributor.keys = function (node) {
	        return [].map.call(node.attributes, function (item) {
	            return item.name;
	        });
	    };
	    Attributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        node.setAttribute(this.keyName, value);
	        return true;
	    };
	    Attributor.prototype.canAdd = function (node, value) {
	        var match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
	        if (match != null && (this.whitelist == null || this.whitelist.indexOf(value) > -1)) {
	            return true;
	        }
	        return false;
	    };
	    Attributor.prototype.remove = function (node) {
	        node.removeAttribute(this.keyName);
	    };
	    Attributor.prototype.value = function (node) {
	        var value = node.getAttribute(this.keyName);
	        return this.canAdd(node, value) ? value : '';
	    };
	    return Attributor;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Attributor;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var attributor_1 = __webpack_require__(8);
	var class_1 = __webpack_require__(10);
	var style_1 = __webpack_require__(11);
	var Registry = __webpack_require__(6);
	var AttributorStore = (function () {
	    function AttributorStore(domNode) {
	        this.attributes = {};
	        this.domNode = domNode;
	        this.build();
	    }
	    AttributorStore.prototype.attribute = function (attribute, value) {
	        if (value) {
	            if (attribute.add(this.domNode, value)) {
	                if (attribute.value(this.domNode) != null) {
	                    this.attributes[attribute.attrName] = attribute;
	                }
	                else {
	                    delete this.attributes[attribute.attrName];
	                }
	            }
	        }
	        else {
	            attribute.remove(this.domNode);
	            delete this.attributes[attribute.attrName];
	        }
	    };
	    AttributorStore.prototype.build = function () {
	        var _this = this;
	        this.attributes = {};
	        var attributes = attributor_1.default.keys(this.domNode);
	        var classes = class_1.default.keys(this.domNode);
	        var styles = style_1.default.keys(this.domNode);
	        attributes.concat(classes).concat(styles).forEach(function (name) {
	            var attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
	            if (attr instanceof attributor_1.default) {
	                _this.attributes[attr.attrName] = attr;
	            }
	        });
	    };
	    AttributorStore.prototype.copy = function (target) {
	        var _this = this;
	        Object.keys(this.attributes).forEach(function (key) {
	            var value = _this.attributes[key].value(_this.domNode);
	            target.format(key, value);
	        });
	    };
	    AttributorStore.prototype.move = function (target) {
	        var _this = this;
	        this.copy(target);
	        Object.keys(this.attributes).forEach(function (key) {
	            _this.attributes[key].remove(_this.domNode);
	        });
	        this.attributes = {};
	    };
	    AttributorStore.prototype.values = function () {
	        var _this = this;
	        return Object.keys(this.attributes).reduce(function (attributes, name) {
	            attributes[name] = _this.attributes[name].value(_this.domNode);
	            return attributes;
	        }, {});
	    };
	    return AttributorStore;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AttributorStore;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(8);
	function match(node, prefix) {
	    var className = node.getAttribute('class') || '';
	    return className.split(/\s+/).filter(function (name) {
	        return name.indexOf(prefix + "-") === 0;
	    });
	}
	var ClassAttributor = (function (_super) {
	    __extends(ClassAttributor, _super);
	    function ClassAttributor() {
	        return _super.apply(this, arguments) || this;
	    }
	    ClassAttributor.keys = function (node) {
	        return (node.getAttribute('class') || '').split(/\s+/).map(function (name) {
	            return name.split('-').slice(0, -1).join('-');
	        });
	    };
	    ClassAttributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        this.remove(node);
	        node.classList.add(this.keyName + "-" + value);
	        return true;
	    };
	    ClassAttributor.prototype.remove = function (node) {
	        var matches = match(node, this.keyName);
	        matches.forEach(function (name) {
	            node.classList.remove(name);
	        });
	        if (node.classList.length === 0) {
	            node.removeAttribute('class');
	        }
	    };
	    ClassAttributor.prototype.value = function (node) {
	        var result = match(node, this.keyName)[0] || '';
	        var value = result.slice(this.keyName.length + 1); // +1 for hyphen
	        return this.canAdd(node, value) ? value : '';
	    };
	    return ClassAttributor;
	}(attributor_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ClassAttributor;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var attributor_1 = __webpack_require__(8);
	function camelize(name) {
	    var parts = name.split('-');
	    var rest = parts.slice(1).map(function (part) {
	        return part[0].toUpperCase() + part.slice(1);
	    }).join('');
	    return parts[0] + rest;
	}
	var StyleAttributor = (function (_super) {
	    __extends(StyleAttributor, _super);
	    function StyleAttributor() {
	        return _super.apply(this, arguments) || this;
	    }
	    StyleAttributor.keys = function (node) {
	        return (node.getAttribute('style') || '').split(';').map(function (value) {
	            var arr = value.split(':');
	            return arr[0].trim();
	        });
	    };
	    StyleAttributor.prototype.add = function (node, value) {
	        if (!this.canAdd(node, value))
	            return false;
	        node.style[camelize(this.keyName)] = value;
	        return true;
	    };
	    StyleAttributor.prototype.remove = function (node) {
	        node.style[camelize(this.keyName)] = '';
	        if (!node.getAttribute('style')) {
	            node.removeAttribute('style');
	        }
	    };
	    StyleAttributor.prototype.value = function (node) {
	        var value = node.style[camelize(this.keyName)];
	        return this.canAdd(node, value) ? value : '';
	    };
	    return StyleAttributor;
	}(attributor_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StyleAttributor;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var shadow_1 = __webpack_require__(5);
	var Registry = __webpack_require__(6);
	var LeafBlot = (function (_super) {
	    __extends(LeafBlot, _super);
	    function LeafBlot() {
	        return _super.apply(this, arguments) || this;
	    }
	    LeafBlot.value = function (domNode) {
	        return true;
	    };
	    LeafBlot.prototype.index = function (node, offset) {
	        if (node !== this.domNode)
	            return -1;
	        return Math.min(offset, 1);
	    };
	    LeafBlot.prototype.position = function (index, inclusive) {
	        var offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
	        if (index > 0)
	            offset += 1;
	        return [this.parent.domNode, offset];
	    };
	    LeafBlot.prototype.value = function () {
	        return _a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a;
	        var _a;
	    };
	    return LeafBlot;
	}(shadow_1.default));
	LeafBlot.scope = Registry.Scope.INLINE_BLOT;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LeafBlot;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var container_1 = __webpack_require__(3);
	var Registry = __webpack_require__(6);
	var OBSERVER_CONFIG = {
	    attributes: true,
	    characterData: true,
	    characterDataOldValue: true,
	    childList: true,
	    subtree: true
	};
	var MAX_OPTIMIZE_ITERATIONS = 100;
	var ScrollBlot = (function (_super) {
	    __extends(ScrollBlot, _super);
	    function ScrollBlot(node) {
	        var _this = _super.call(this, node) || this;
	        _this.parent = null;
	        _this.observer = new MutationObserver(function (mutations) {
	            _this.update(mutations);
	        });
	        _this.observer.observe(_this.domNode, OBSERVER_CONFIG);
	        return _this;
	    }
	    ScrollBlot.prototype.detach = function () {
	        _super.prototype.detach.call(this);
	        this.observer.disconnect();
	    };
	    ScrollBlot.prototype.deleteAt = function (index, length) {
	        this.update();
	        if (index === 0 && length === this.length()) {
	            this.children.forEach(function (child) {
	                child.remove();
	            });
	        }
	        else {
	            _super.prototype.deleteAt.call(this, index, length);
	        }
	    };
	    ScrollBlot.prototype.formatAt = function (index, length, name, value) {
	        this.update();
	        _super.prototype.formatAt.call(this, index, length, name, value);
	    };
	    ScrollBlot.prototype.insertAt = function (index, value, def) {
	        this.update();
	        _super.prototype.insertAt.call(this, index, value, def);
	    };
	    ScrollBlot.prototype.optimize = function (mutations) {
	        var _this = this;
	        if (mutations === void 0) { mutations = []; }
	        _super.prototype.optimize.call(this);
	        // We must modify mutations directly, cannot make copy and then modify
	        var records = [].slice.call(this.observer.takeRecords());
	        // Array.push currently seems to be implemented by a non-tail recursive function
	        // so we cannot just mutations.push.apply(mutations, this.observer.takeRecords());
	        while (records.length > 0)
	            mutations.push(records.pop());
	        // TODO use WeakMap
	        var mark = function (blot, markParent) {
	            if (markParent === void 0) { markParent = true; }
	            if (blot == null || blot === _this)
	                return;
	            if (blot.domNode.parentNode == null)
	                return;
	            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
	                blot.domNode[Registry.DATA_KEY].mutations = [];
	            }
	            if (markParent)
	                mark(blot.parent);
	        };
	        var optimize = function (blot) {
	            if (blot.domNode[Registry.DATA_KEY] == null || blot.domNode[Registry.DATA_KEY].mutations == null) {
	                return;
	            }
	            if (blot instanceof container_1.default) {
	                blot.children.forEach(optimize);
	            }
	            blot.optimize();
	        };
	        var remaining = mutations;
	        for (var i = 0; remaining.length > 0; i += 1) {
	            if (i >= MAX_OPTIMIZE_ITERATIONS) {
	                throw new Error('[Parchment] Maximum optimize iterations reached');
	            }
	            remaining.forEach(function (mutation) {
	                var blot = Registry.find(mutation.target, true);
	                if (blot == null)
	                    return;
	                if (blot.domNode === mutation.target) {
	                    if (mutation.type === 'childList') {
	                        mark(Registry.find(mutation.previousSibling, false));
	                        [].forEach.call(mutation.addedNodes, function (node) {
	                            var child = Registry.find(node, false);
	                            mark(child, false);
	                            if (child instanceof container_1.default) {
	                                child.children.forEach(function (grandChild) {
	                                    mark(grandChild, false);
	                                });
	                            }
	                        });
	                    }
	                    else if (mutation.type === 'attributes') {
	                        mark(blot.prev);
	                    }
	                }
	                mark(blot);
	            });
	            this.children.forEach(optimize);
	            remaining = [].slice.call(this.observer.takeRecords());
	            records = remaining.slice();
	            while (records.length > 0)
	                mutations.push(records.pop());
	        }
	    };
	    ScrollBlot.prototype.update = function (mutations) {
	        var _this = this;
	        mutations = mutations || this.observer.takeRecords();
	        // TODO use WeakMap
	        mutations.map(function (mutation) {
	            var blot = Registry.find(mutation.target, true);
	            if (blot == null)
	                return;
	            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
	                blot.domNode[Registry.DATA_KEY].mutations = [mutation];
	                return blot;
	            }
	            else {
	                blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
	                return null;
	            }
	        }).forEach(function (blot) {
	            if (blot == null || blot === _this || blot.domNode[Registry.DATA_KEY] == null)
	                return;
	            blot.update(blot.domNode[Registry.DATA_KEY].mutations || []);
	        });
	        if (this.domNode[Registry.DATA_KEY].mutations != null) {
	            _super.prototype.update.call(this, this.domNode[Registry.DATA_KEY].mutations);
	        }
	        this.optimize(mutations);
	    };
	    return ScrollBlot;
	}(container_1.default));
	ScrollBlot.blotName = 'scroll';
	ScrollBlot.defaultChild = 'block';
	ScrollBlot.scope = Registry.Scope.BLOCK_BLOT;
	ScrollBlot.tagName = 'DIV';
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScrollBlot;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var format_1 = __webpack_require__(7);
	var Registry = __webpack_require__(6);
	// Shallow object comparison
	function isEqual(obj1, obj2) {
	    if (Object.keys(obj1).length !== Object.keys(obj2).length)
	        return false;
	    for (var prop in obj1) {
	        if (obj1[prop] !== obj2[prop])
	            return false;
	    }
	    return true;
	}
	var InlineBlot = (function (_super) {
	    __extends(InlineBlot, _super);
	    function InlineBlot() {
	        return _super.apply(this, arguments) || this;
	    }
	    InlineBlot.formats = function (domNode) {
	        if (domNode.tagName === InlineBlot.tagName)
	            return undefined;
	        return _super.formats.call(this, domNode);
	    };
	    InlineBlot.prototype.format = function (name, value) {
	        var _this = this;
	        if (name === this.statics.blotName && !value) {
	            this.children.forEach(function (child) {
	                if (!(child instanceof format_1.default)) {
	                    child = child.wrap(InlineBlot.blotName, true);
	                }
	                _this.attributes.copy(child);
	            });
	            this.unwrap();
	        }
	        else {
	            _super.prototype.format.call(this, name, value);
	        }
	    };
	    InlineBlot.prototype.formatAt = function (index, length, name, value) {
	        if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
	            var blot = this.isolate(index, length);
	            blot.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    InlineBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        var formats = this.formats();
	        if (Object.keys(formats).length === 0) {
	            return this.unwrap(); // unformatted span
	        }
	        var next = this.next;
	        if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
	            next.moveChildren(this);
	            next.remove();
	        }
	    };
	    return InlineBlot;
	}(format_1.default));
	InlineBlot.blotName = 'inline';
	InlineBlot.scope = Registry.Scope.INLINE_BLOT;
	InlineBlot.tagName = 'SPAN';
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = InlineBlot;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var format_1 = __webpack_require__(7);
	var Registry = __webpack_require__(6);
	var BlockBlot = (function (_super) {
	    __extends(BlockBlot, _super);
	    function BlockBlot() {
	        return _super.apply(this, arguments) || this;
	    }
	    BlockBlot.formats = function (domNode) {
	        var tagName = Registry.query(BlockBlot.blotName).tagName;
	        if (domNode.tagName === tagName)
	            return undefined;
	        return _super.formats.call(this, domNode);
	    };
	    BlockBlot.prototype.format = function (name, value) {
	        if (Registry.query(name, Registry.Scope.BLOCK) == null) {
	            return;
	        }
	        else if (name === this.statics.blotName && !value) {
	            this.replaceWith(BlockBlot.blotName);
	        }
	        else {
	            _super.prototype.format.call(this, name, value);
	        }
	    };
	    BlockBlot.prototype.formatAt = function (index, length, name, value) {
	        if (Registry.query(name, Registry.Scope.BLOCK) != null) {
	            this.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    BlockBlot.prototype.insertAt = function (index, value, def) {
	        if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
	            // Insert text or inline
	            _super.prototype.insertAt.call(this, index, value, def);
	        }
	        else {
	            var after = this.split(index);
	            var blot = Registry.create(value, def);
	            after.parent.insertBefore(blot, after);
	        }
	    };
	    BlockBlot.prototype.update = function (mutations) {
	        if (navigator.userAgent.match(/Trident/)) {
	            this.attach();
	        }
	        else {
	            _super.prototype.update.call(this, mutations);
	        }
	    };
	    return BlockBlot;
	}(format_1.default));
	BlockBlot.blotName = 'block';
	BlockBlot.scope = Registry.Scope.BLOCK_BLOT;
	BlockBlot.tagName = 'P';
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BlockBlot;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var leaf_1 = __webpack_require__(12);
	var EmbedBlot = (function (_super) {
	    __extends(EmbedBlot, _super);
	    function EmbedBlot() {
	        return _super.apply(this, arguments) || this;
	    }
	    EmbedBlot.formats = function (domNode) {
	        return undefined;
	    };
	    EmbedBlot.prototype.format = function (name, value) {
	        // super.formatAt wraps, which is what we want in general,
	        // but this allows subclasses to overwrite for formats
	        // that just apply to particular embeds
	        _super.prototype.formatAt.call(this, 0, this.length(), name, value);
	    };
	    EmbedBlot.prototype.formatAt = function (index, length, name, value) {
	        if (index === 0 && length === this.length()) {
	            this.format(name, value);
	        }
	        else {
	            _super.prototype.formatAt.call(this, index, length, name, value);
	        }
	    };
	    EmbedBlot.prototype.formats = function () {
	        return this.statics.formats(this.domNode);
	    };
	    return EmbedBlot;
	}(leaf_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EmbedBlot;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var leaf_1 = __webpack_require__(12);
	var Registry = __webpack_require__(6);
	var TextBlot = (function (_super) {
	    __extends(TextBlot, _super);
	    function TextBlot(node) {
	        var _this = _super.call(this, node) || this;
	        _this.text = _this.statics.value(_this.domNode);
	        return _this;
	    }
	    TextBlot.create = function (value) {
	        return document.createTextNode(value);
	    };
	    TextBlot.value = function (domNode) {
	        return domNode.data;
	    };
	    TextBlot.prototype.deleteAt = function (index, length) {
	        this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
	    };
	    TextBlot.prototype.index = function (node, offset) {
	        if (this.domNode === node) {
	            return offset;
	        }
	        return -1;
	    };
	    TextBlot.prototype.insertAt = function (index, value, def) {
	        if (def == null) {
	            this.text = this.text.slice(0, index) + value + this.text.slice(index);
	            this.domNode.data = this.text;
	        }
	        else {
	            _super.prototype.insertAt.call(this, index, value, def);
	        }
	    };
	    TextBlot.prototype.length = function () {
	        return this.text.length;
	    };
	    TextBlot.prototype.optimize = function () {
	        _super.prototype.optimize.call(this);
	        this.text = this.statics.value(this.domNode);
	        if (this.text.length === 0) {
	            this.remove();
	        }
	        else if (this.next instanceof TextBlot && this.next.prev === this) {
	            this.insertAt(this.length(), this.next.value());
	            this.next.remove();
	        }
	    };
	    TextBlot.prototype.position = function (index, inclusive) {
	        if (inclusive === void 0) { inclusive = false; }
	        return [this.domNode, index];
	    };
	    TextBlot.prototype.split = function (index, force) {
	        if (force === void 0) { force = false; }
	        if (!force) {
	            if (index === 0)
	                return this;
	            if (index === this.length())
	                return this.next;
	        }
	        var after = Registry.create(this.domNode.splitText(index));
	        this.parent.insertBefore(after, this.next);
	        this.text = this.statics.value(this.domNode);
	        return after;
	    };
	    TextBlot.prototype.update = function (mutations) {
	        var _this = this;
	        if (mutations.some(function (mutation) {
	            return mutation.type === 'characterData' && mutation.target === _this.domNode;
	        })) {
	            this.text = this.statics.value(this.domNode);
	        }
	    };
	    TextBlot.prototype.value = function () {
	        return this.text;
	    };
	    return TextBlot;
	}(leaf_1.default));
	TextBlot.blotName = 'text';
	TextBlot.scope = Registry.Scope.INLINE_BLOT;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TextBlot;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.overload = exports.expandConfig = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(19);

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _editor = __webpack_require__(27);

	var _editor2 = _interopRequireDefault(_editor);

	var _emitter3 = __webpack_require__(35);

	var _emitter4 = _interopRequireDefault(_emitter3);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _selection = __webpack_require__(40);

	var _selection2 = _interopRequireDefault(_selection);

	var _extend = __webpack_require__(25);

	var _extend2 = _interopRequireDefault(_extend);

	var _logger = __webpack_require__(37);

	var _logger2 = _interopRequireDefault(_logger);

	var _theme = __webpack_require__(41);

	var _theme2 = _interopRequireDefault(_theme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = (0, _logger2.default)('quill');

	var Quill = function () {
	  _createClass(Quill, null, [{
	    key: 'debug',
	    value: function debug(limit) {
	      if (limit === true) {
	        limit = 'log';
	      }
	      _logger2.default.level(limit);
	    }
	  }, {
	    key: 'import',
	    value: function _import(name) {
	      if (this.imports[name] == null) {
	        debug.error('Cannot import ' + name + '. Are you sure it was registered?');
	      }
	      return this.imports[name];
	    }
	  }, {
	    key: 'register',
	    value: function register(path, target) {
	      var _this = this;

	      var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	      if (typeof path !== 'string') {
	        var name = path.attrName || path.blotName;
	        if (typeof name === 'string') {
	          // register(Blot | Attributor, overwrite)
	          this.register('formats/' + name, path, target);
	        } else {
	          Object.keys(path).forEach(function (key) {
	            _this.register(key, path[key], target);
	          });
	        }
	      } else {
	        if (this.imports[path] != null && !overwrite) {
	          debug.warn('Overwriting ' + path + ' with', target);
	        }
	        this.imports[path] = target;
	        if ((path.startsWith('blots/') || path.startsWith('formats/')) && target.blotName !== 'abstract') {
	          _parchment2.default.register(target);
	        }
	      }
	    }
	  }]);

	  function Quill(container) {
	    var _this2 = this;

	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Quill);

	    this.options = expandConfig(container, options);
	    this.container = this.options.container;
	    this.scrollingContainer = this.options.scrollingContainer || document.body;
	    if (this.container == null) {
	      return debug.error('Invalid Quill container', container);
	    }
	    if (this.options.debug) {
	      Quill.debug(this.options.debug);
	    }
	    var html = this.container.innerHTML.trim();
	    this.container.classList.add('ql-container');
	    this.container.innerHTML = '';
	    this.root = this.addContainer('ql-editor');
	    this.root.classList.add('ql-blank');
	    this.emitter = new _emitter4.default();
	    this.scroll = _parchment2.default.create(this.root, {
	      emitter: this.emitter,
	      whitelist: this.options.formats
	    });
	    this.editor = new _editor2.default(this.scroll);
	    this.selection = new _selection2.default(this.scroll, this.emitter);
	    this.theme = new this.options.theme(this, this.options);
	    this.keyboard = this.theme.addModule('keyboard');
	    this.clipboard = this.theme.addModule('clipboard');
	    this.history = this.theme.addModule('history');
	    this.theme.init();
	    this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function (type) {
	      if (type === _emitter4.default.events.TEXT_CHANGE) {
	        _this2.root.classList.toggle('ql-blank', _this2.editor.isBlank());
	      }
	    });
	    this.emitter.on(_emitter4.default.events.SCROLL_UPDATE, function (source, mutations) {
	      var range = _this2.selection.lastRange;
	      var index = range && range.length === 0 ? range.index : undefined;
	      modify.call(_this2, function () {
	        return _this2.editor.update(null, mutations, index);
	      }, source);
	    });
	    var contents = this.clipboard.convert('<div class=\'ql-editor\' style="white-space: normal;">' + html + '<p><br></p></div>');
	    this.setContents(contents);
	    this.history.clear();
	    if (this.options.placeholder) {
	      this.root.setAttribute('data-placeholder', this.options.placeholder);
	    }
	    if (this.options.readOnly) {
	      this.disable();
	    }
	  }

	  _createClass(Quill, [{
	    key: 'addContainer',
	    value: function addContainer(container) {
	      var refNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      if (typeof container === 'string') {
	        var className = container;
	        container = document.createElement('div');
	        container.classList.add(className);
	      }
	      this.container.insertBefore(container, refNode);
	      return container;
	    }
	  }, {
	    key: 'blur',
	    value: function blur() {
	      this.selection.setRange(null);
	    }
	  }, {
	    key: 'deleteText',
	    value: function deleteText(index, length, source) {
	      var _this3 = this;

	      var _overload = overload(index, length, source);

	      var _overload2 = _slicedToArray(_overload, 4);

	      index = _overload2[0];
	      length = _overload2[1];
	      source = _overload2[3];

	      return modify.call(this, function () {
	        return _this3.editor.deleteText(index, length);
	      }, source, index, -1 * length);
	    }
	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.enable(false);
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      this.scroll.enable(enabled);
	      this.container.classList.toggle('ql-disabled', !enabled);
	      if (!enabled) {
	        this.blur();
	      }
	    }
	  }, {
	    key: 'focus',
	    value: function focus() {
	      var scrollTop = this.scrollingContainer.scrollTop;
	      this.selection.focus();
	      this.scrollingContainer.scrollTop = scrollTop;
	      this.selection.scrollIntoView();
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      var _this4 = this;

	      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter4.default.sources.API;

	      return modify.call(this, function () {
	        var range = _this4.getSelection(true);
	        var change = new _quillDelta2.default();
	        if (range == null) {
	          return change;
	        } else if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
	          change = _this4.editor.formatLine(range.index, range.length, _defineProperty({}, name, value));
	        } else if (range.length === 0) {
	          _this4.selection.format(name, value);
	          return change;
	        } else {
	          change = _this4.editor.formatText(range.index, range.length, _defineProperty({}, name, value));
	        }
	        _this4.setSelection(range, _emitter4.default.sources.SILENT);
	        return change;
	      }, source);
	    }
	  }, {
	    key: 'formatLine',
	    value: function formatLine(index, length, name, value, source) {
	      var _this5 = this;

	      var formats = void 0;

	      var _overload3 = overload(index, length, name, value, source);

	      var _overload4 = _slicedToArray(_overload3, 4);

	      index = _overload4[0];
	      length = _overload4[1];
	      formats = _overload4[2];
	      source = _overload4[3];

	      return modify.call(this, function () {
	        return _this5.editor.formatLine(index, length, formats);
	      }, source, index, 0);
	    }
	  }, {
	    key: 'formatText',
	    value: function formatText(index, length, name, value, source) {
	      var _this6 = this;

	      var formats = void 0;

	      var _overload5 = overload(index, length, name, value, source);

	      var _overload6 = _slicedToArray(_overload5, 4);

	      index = _overload6[0];
	      length = _overload6[1];
	      formats = _overload6[2];
	      source = _overload6[3];

	      return modify.call(this, function () {
	        return _this6.editor.formatText(index, length, formats);
	      }, source, index, 0);
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds(index) {
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      if (typeof index === 'number') {
	        return this.selection.getBounds(index, length);
	      } else {
	        return this.selection.getBounds(index.index, index.length);
	      }
	    }
	  }, {
	    key: 'getContents',
	    value: function getContents() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;

	      var _overload7 = overload(index, length);

	      var _overload8 = _slicedToArray(_overload7, 2);

	      index = _overload8[0];
	      length = _overload8[1];

	      return this.editor.getContents(index, length);
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSelection();
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      if (typeof index === 'number') {
	        return this.editor.getFormat(index, length);
	      } else {
	        return this.editor.getFormat(index.index, index.length);
	      }
	    }
	  }, {
	    key: 'getLength',
	    value: function getLength() {
	      return this.scroll.length();
	    }
	  }, {
	    key: 'getModule',
	    value: function getModule(name) {
	      return this.theme.modules[name];
	    }
	  }, {
	    key: 'getSelection',
	    value: function getSelection() {
	      var focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      if (focus) this.focus();
	      this.update(); // Make sure we access getRange with editor in consistent state
	      return this.selection.getRange()[0];
	    }
	  }, {
	    key: 'getText',
	    value: function getText() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;

	      var _overload9 = overload(index, length);

	      var _overload10 = _slicedToArray(_overload9, 2);

	      index = _overload10[0];
	      length = _overload10[1];

	      return this.editor.getText(index, length);
	    }
	  }, {
	    key: 'hasFocus',
	    value: function hasFocus() {
	      return this.selection.hasFocus();
	    }
	  }, {
	    key: 'insertEmbed',
	    value: function insertEmbed(index, embed, value) {
	      var _this7 = this;

	      var source = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Quill.sources.API;

	      return modify.call(this, function () {
	        return _this7.editor.insertEmbed(index, embed, value);
	      }, source, index);
	    }
	  }, {
	    key: 'insertText',
	    value: function insertText(index, text, name, value, source) {
	      var _this8 = this;

	      var formats = void 0;

	      var _overload11 = overload(index, 0, name, value, source);

	      var _overload12 = _slicedToArray(_overload11, 4);

	      index = _overload12[0];
	      formats = _overload12[2];
	      source = _overload12[3];

	      return modify.call(this, function () {
	        return _this8.editor.insertText(index, text, formats);
	      }, source, index, text.length);
	    }
	  }, {
	    key: 'isEnabled',
	    value: function isEnabled() {
	      return !this.container.classList.contains('ql-disabled');
	    }
	  }, {
	    key: 'off',
	    value: function off() {
	      return this.emitter.off.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'on',
	    value: function on() {
	      return this.emitter.on.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'once',
	    value: function once() {
	      return this.emitter.once.apply(this.emitter, arguments);
	    }
	  }, {
	    key: 'pasteHTML',
	    value: function pasteHTML(index, html, source) {
	      this.clipboard.dangerouslyPasteHTML(index, html, source);
	    }
	  }, {
	    key: 'removeFormat',
	    value: function removeFormat(index, length, source) {
	      var _this9 = this;

	      var _overload13 = overload(index, length, source);

	      var _overload14 = _slicedToArray(_overload13, 4);

	      index = _overload14[0];
	      length = _overload14[1];
	      source = _overload14[3];

	      return modify.call(this, function () {
	        return _this9.editor.removeFormat(index, length);
	      }, source, index);
	    }
	  }, {
	    key: 'setContents',
	    value: function setContents(delta) {
	      var _this10 = this;

	      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter4.default.sources.API;

	      return modify.call(this, function () {
	        delta = new _quillDelta2.default(delta);
	        var length = _this10.getLength();
	        var deleted = _this10.editor.deleteText(0, length);
	        var applied = _this10.editor.applyDelta(delta);
	        var lastOp = applied.ops[applied.ops.length - 1];
	        if (lastOp != null && typeof lastOp.insert === 'string' && lastOp.insert[lastOp.insert.length - 1] === '\n') {
	          _this10.editor.deleteText(_this10.getLength() - 1, 1);
	          applied.delete(1);
	        }
	        var ret = deleted.compose(applied);
	        return ret;
	      }, source);
	    }
	  }, {
	    key: 'setSelection',
	    value: function setSelection(index, length, source) {
	      if (index == null) {
	        this.selection.setRange(null, length || Quill.sources.API);
	      } else {
	        var _overload15 = overload(index, length, source);

	        var _overload16 = _slicedToArray(_overload15, 4);

	        index = _overload16[0];
	        length = _overload16[1];
	        source = _overload16[3];

	        this.selection.setRange(new _selection.Range(index, length), source);
	      }
	      this.selection.scrollIntoView();
	    }
	  }, {
	    key: 'setText',
	    value: function setText(text) {
	      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter4.default.sources.API;

	      var delta = new _quillDelta2.default().insert(text);
	      return this.setContents(delta, source);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter4.default.sources.USER;

	      var change = this.scroll.update(source); // Will update selection before selection.update() does if text changes
	      this.selection.update(source);
	      return change;
	    }
	  }, {
	    key: 'updateContents',
	    value: function updateContents(delta) {
	      var _this11 = this;

	      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter4.default.sources.API;

	      return modify.call(this, function () {
	        delta = new _quillDelta2.default(delta);
	        return _this11.editor.applyDelta(delta, source);
	      }, source, true);
	    }
	  }]);

	  return Quill;
	}();

	Quill.DEFAULTS = {
	  bounds: null,
	  formats: null,
	  modules: {},
	  placeholder: '',
	  readOnly: false,
	  scrollingContainer: null,
	  strict: true,
	  theme: 'default'
	};
	Quill.events = _emitter4.default.events;
	Quill.sources = _emitter4.default.sources;
	// eslint-disable-next-line no-undef
	Quill.version =  false ? 'dev' : ("1.1.9");

	Quill.imports = {
	  'delta': _quillDelta2.default,
	  'parchment': _parchment2.default,
	  'core/module': _module2.default,
	  'core/theme': _theme2.default
	};

	function expandConfig(container, userConfig) {
	  userConfig = (0, _extend2.default)(true, {
	    container: container,
	    modules: {
	      clipboard: true,
	      keyboard: true,
	      history: true
	    }
	  }, userConfig);
	  if (!userConfig.theme || userConfig.theme === Quill.DEFAULTS.theme) {
	    userConfig.theme = _theme2.default;
	  } else {
	    userConfig.theme = Quill.import('themes/' + userConfig.theme);
	    if (userConfig.theme == null) {
	      throw new Error('Invalid theme ' + userConfig.theme + '. Did you register it?');
	    }
	  }
	  var themeConfig = (0, _extend2.default)(true, {}, userConfig.theme.DEFAULTS);
	  [themeConfig, userConfig].forEach(function (config) {
	    config.modules = config.modules || {};
	    Object.keys(config.modules).forEach(function (module) {
	      if (config.modules[module] === true) {
	        config.modules[module] = {};
	      }
	    });
	  });
	  var moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
	  var moduleConfig = moduleNames.reduce(function (config, name) {
	    var moduleClass = Quill.import('modules/' + name);
	    if (moduleClass == null) {
	      debug.error('Cannot load ' + name + ' module. Are you sure you registered it?');
	    } else {
	      config[name] = moduleClass.DEFAULTS || {};
	    }
	    return config;
	  }, {});
	  // Special case toolbar shorthand
	  if (userConfig.modules != null && userConfig.modules.toolbar && userConfig.modules.toolbar.constructor !== Object) {
	    userConfig.modules.toolbar = {
	      container: userConfig.modules.toolbar
	    };
	  }
	  userConfig = (0, _extend2.default)(true, {}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, userConfig);
	  ['bounds', 'container', 'scrollingContainer'].forEach(function (key) {
	    if (typeof userConfig[key] === 'string') {
	      userConfig[key] = document.querySelector(userConfig[key]);
	    }
	  });
	  userConfig.modules = Object.keys(userConfig.modules).reduce(function (config, name) {
	    if (userConfig.modules[name]) {
	      config[name] = userConfig.modules[name];
	    }
	    return config;
	  }, {});
	  return userConfig;
	}

	// Handle selection preservation and TEXT_CHANGE emission
	// common to modification APIs
	function modify(modifier, source, index, shift) {
	  if (this.options.strict && !this.isEnabled() && source === _emitter4.default.sources.USER) {
	    return new _quillDelta2.default();
	  }
	  var range = index == null ? null : this.getSelection();
	  var oldDelta = this.editor.delta;
	  var change = modifier();
	  if (range != null && source === _emitter4.default.sources.USER) {
	    if (index === true) index = range.index;
	    if (shift == null) {
	      range = shiftRange(range, change, source);
	    } else if (shift !== 0) {
	      range = shiftRange(range, index, shift, source);
	    }
	    this.setSelection(range, _emitter4.default.sources.SILENT);
	  }
	  if (change.length() > 0) {
	    var _emitter;

	    var args = [_emitter4.default.events.TEXT_CHANGE, change, oldDelta, source];
	    (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
	    if (source !== _emitter4.default.sources.SILENT) {
	      var _emitter2;

	      (_emitter2 = this.emitter).emit.apply(_emitter2, args);
	    }
	  }
	  return change;
	}

	function overload(index, length, name, value, source) {
	  var formats = {};
	  if (typeof index.index === 'number' && typeof index.length === 'number') {
	    // Allow for throwaway end (used by insertText/insertEmbed)
	    if (typeof length !== 'number') {
	      source = value, value = name, name = length, length = index.length, index = index.index;
	    } else {
	      length = index.length, index = index.index;
	    }
	  } else if (typeof length !== 'number') {
	    source = value, value = name, name = length, length = 0;
	  }
	  // Handle format being object, two format name/value strings or excluded
	  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
	    formats = name;
	    source = value;
	  } else if (typeof name === 'string') {
	    if (value != null) {
	      formats[name] = value;
	    } else {
	      source = name;
	    }
	  }
	  // Handle optional source
	  source = source || _emitter4.default.sources.API;
	  return [index, length, formats, source];
	}

	function shiftRange(range, index, length, source) {
	  if (range == null) return null;
	  var start = void 0,
	      end = void 0;
	  if (index instanceof _quillDelta2.default) {
	    var _map = [range.index, range.index + range.length].map(function (pos) {
	      return index.transformPosition(pos, source === _emitter4.default.sources.USER);
	    });

	    var _map2 = _slicedToArray(_map, 2);

	    start = _map2[0];
	    end = _map2[1];
	  } else {
	    var _map3 = [range.index, range.index + range.length].map(function (pos) {
	      if (pos < index || pos === index && source !== _emitter4.default.sources.USER) return pos;
	      if (length >= 0) {
	        return pos + length;
	      } else {
	        return Math.max(index, pos + length);
	      }
	    });

	    var _map4 = _slicedToArray(_map3, 2);

	    start = _map4[0];
	    end = _map4[1];
	  }
	  return new _selection.Range(start, end - start);
	}

	exports.expandConfig = expandConfig;
	exports.overload = overload;
	exports.default = Quill;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	var elem = document.createElement('div');
	elem.classList.toggle('test-class', false);
	if (elem.classList.contains('test-class')) {
	  (function () {
	    var _toggle = DOMTokenList.prototype.toggle;
	    DOMTokenList.prototype.toggle = function (token, force) {
	      if (arguments.length > 1 && !this.contains(token) === !force) {
	        return force;
	      } else {
	        return _toggle.call(this, token);
	      }
	    };
	  })();
	}

	if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function (searchString, position) {
	    position = position || 0;
	    return this.substr(position, searchString.length) === searchString;
	  };
	}

	if (!String.prototype.endsWith) {
	  String.prototype.endsWith = function (searchString, position) {
	    var subjectString = this.toString();
	    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
	      position = subjectString.length;
	    }
	    position -= searchString.length;
	    var lastIndex = subjectString.indexOf(searchString, position);
	    return lastIndex !== -1 && lastIndex === position;
	  };
	}

	if (!Array.prototype.find) {
	  Object.defineProperty(Array.prototype, "find", {
	    value: function value(predicate) {
	      if (this === null) {
	        throw new TypeError('Array.prototype.find called on null or undefined');
	      }
	      if (typeof predicate !== 'function') {
	        throw new TypeError('predicate must be a function');
	      }
	      var list = Object(this);
	      var length = list.length >>> 0;
	      var thisArg = arguments[1];
	      var value;

	      for (var i = 0; i < length; i++) {
	        value = list[i];
	        if (predicate.call(thisArg, value, i, list)) {
	          return value;
	        }
	      }
	      return undefined;
	    }
	  });
	}

	// Disable resizing in Firefox
	document.addEventListener("DOMContentLoaded", function () {
	  document.execCommand("enableObjectResizing", false, false);
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var diff = __webpack_require__(21);
	var equal = __webpack_require__(22);
	var extend = __webpack_require__(25);
	var op = __webpack_require__(26);


	var NULL_CHARACTER = String.fromCharCode(0);  // Placeholder char for embed in diff()


	var Delta = function (ops) {
	  // Assume we are given a well formed ops
	  if (Array.isArray(ops)) {
	    this.ops = ops;
	  } else if (ops != null && Array.isArray(ops.ops)) {
	    this.ops = ops.ops;
	  } else {
	    this.ops = [];
	  }
	};


	Delta.prototype.insert = function (text, attributes) {
	  var newOp = {};
	  if (text.length === 0) return this;
	  newOp.insert = text;
	  if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
	    newOp.attributes = attributes;
	  }
	  return this.push(newOp);
	};

	Delta.prototype['delete'] = function (length) {
	  if (length <= 0) return this;
	  return this.push({ 'delete': length });
	};

	Delta.prototype.retain = function (length, attributes) {
	  if (length <= 0) return this;
	  var newOp = { retain: length };
	  if (attributes != null && typeof attributes === 'object' && Object.keys(attributes).length > 0) {
	    newOp.attributes = attributes;
	  }
	  return this.push(newOp);
	};

	Delta.prototype.push = function (newOp) {
	  var index = this.ops.length;
	  var lastOp = this.ops[index - 1];
	  newOp = extend(true, {}, newOp);
	  if (typeof lastOp === 'object') {
	    if (typeof newOp['delete'] === 'number' && typeof lastOp['delete'] === 'number') {
	      this.ops[index - 1] = { 'delete': lastOp['delete'] + newOp['delete'] };
	      return this;
	    }
	    // Since it does not matter if we insert before or after deleting at the same index,
	    // always prefer to insert first
	    if (typeof lastOp['delete'] === 'number' && newOp.insert != null) {
	      index -= 1;
	      lastOp = this.ops[index - 1];
	      if (typeof lastOp !== 'object') {
	        this.ops.unshift(newOp);
	        return this;
	      }
	    }
	    if (equal(newOp.attributes, lastOp.attributes)) {
	      if (typeof newOp.insert === 'string' && typeof lastOp.insert === 'string') {
	        this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
	        if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes
	        return this;
	      } else if (typeof newOp.retain === 'number' && typeof lastOp.retain === 'number') {
	        this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
	        if (typeof newOp.attributes === 'object') this.ops[index - 1].attributes = newOp.attributes
	        return this;
	      }
	    }
	  }
	  if (index === this.ops.length) {
	    this.ops.push(newOp);
	  } else {
	    this.ops.splice(index, 0, newOp);
	  }
	  return this;
	};

	Delta.prototype.filter = function (predicate) {
	  return this.ops.filter(predicate);
	};

	Delta.prototype.forEach = function (predicate) {
	  this.ops.forEach(predicate);
	};

	Delta.prototype.map = function (predicate) {
	  return this.ops.map(predicate);
	};

	Delta.prototype.partition = function (predicate) {
	  var passed = [], failed = [];
	  this.forEach(function(op) {
	    var target = predicate(op) ? passed : failed;
	    target.push(op);
	  });
	  return [passed, failed];
	};

	Delta.prototype.reduce = function (predicate, initial) {
	  return this.ops.reduce(predicate, initial);
	};

	Delta.prototype.chop = function () {
	  var lastOp = this.ops[this.ops.length - 1];
	  if (lastOp && lastOp.retain && !lastOp.attributes) {
	    this.ops.pop();
	  }
	  return this;
	};

	Delta.prototype.length = function () {
	  return this.reduce(function (length, elem) {
	    return length + op.length(elem);
	  }, 0);
	};

	Delta.prototype.slice = function (start, end) {
	  start = start || 0;
	  if (typeof end !== 'number') end = Infinity;
	  var ops = [];
	  var iter = op.iterator(this.ops);
	  var index = 0;
	  while (index < end && iter.hasNext()) {
	    var nextOp;
	    if (index < start) {
	      nextOp = iter.next(start - index);
	    } else {
	      nextOp = iter.next(end - index);
	      ops.push(nextOp);
	    }
	    index += op.length(nextOp);
	  }
	  return new Delta(ops);
	};


	Delta.prototype.compose = function (other) {
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  var delta = new Delta();
	  while (thisIter.hasNext() || otherIter.hasNext()) {
	    if (otherIter.peekType() === 'insert') {
	      delta.push(otherIter.next());
	    } else if (thisIter.peekType() === 'delete') {
	      delta.push(thisIter.next());
	    } else {
	      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
	      var thisOp = thisIter.next(length);
	      var otherOp = otherIter.next(length);
	      if (typeof otherOp.retain === 'number') {
	        var newOp = {};
	        if (typeof thisOp.retain === 'number') {
	          newOp.retain = length;
	        } else {
	          newOp.insert = thisOp.insert;
	        }
	        // Preserve null when composing with a retain, otherwise remove it for inserts
	        var attributes = op.attributes.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === 'number');
	        if (attributes) newOp.attributes = attributes;
	        delta.push(newOp);
	      // Other op should be delete, we could be an insert or retain
	      // Insert + delete cancels out
	      } else if (typeof otherOp['delete'] === 'number' && typeof thisOp.retain === 'number') {
	        delta.push(otherOp);
	      }
	    }
	  }
	  return delta.chop();
	};

	Delta.prototype.concat = function (other) {
	  var delta = new Delta(this.ops.slice());
	  if (other.ops.length > 0) {
	    delta.push(other.ops[0]);
	    delta.ops = delta.ops.concat(other.ops.slice(1));
	  }
	  return delta;
	};

	Delta.prototype.diff = function (other, index) {
	  if (this.ops === other.ops) {
	    return new Delta();
	  }
	  var strings = [this, other].map(function (delta) {
	    return delta.map(function (op) {
	      if (op.insert != null) {
	        return typeof op.insert === 'string' ? op.insert : NULL_CHARACTER;
	      }
	      var prep = (ops === other.ops) ? 'on' : 'with';
	      throw new Error('diff() called ' + prep + ' non-document');
	    }).join('');
	  });
	  var delta = new Delta();
	  var diffResult = diff(strings[0], strings[1], index);
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  diffResult.forEach(function (component) {
	    var length = component[1].length;
	    while (length > 0) {
	      var opLength = 0;
	      switch (component[0]) {
	        case diff.INSERT:
	          opLength = Math.min(otherIter.peekLength(), length);
	          delta.push(otherIter.next(opLength));
	          break;
	        case diff.DELETE:
	          opLength = Math.min(length, thisIter.peekLength());
	          thisIter.next(opLength);
	          delta['delete'](opLength);
	          break;
	        case diff.EQUAL:
	          opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
	          var thisOp = thisIter.next(opLength);
	          var otherOp = otherIter.next(opLength);
	          if (equal(thisOp.insert, otherOp.insert)) {
	            delta.retain(opLength, op.attributes.diff(thisOp.attributes, otherOp.attributes));
	          } else {
	            delta.push(otherOp)['delete'](opLength);
	          }
	          break;
	      }
	      length -= opLength;
	    }
	  });
	  return delta.chop();
	};

	Delta.prototype.eachLine = function (predicate, newline) {
	  newline = newline || '\n';
	  var iter = op.iterator(this.ops);
	  var line = new Delta();
	  while (iter.hasNext()) {
	    if (iter.peekType() !== 'insert') return;
	    var thisOp = iter.peek();
	    var start = op.length(thisOp) - iter.peekLength();
	    var index = typeof thisOp.insert === 'string' ?
	      thisOp.insert.indexOf(newline, start) - start : -1;
	    if (index < 0) {
	      line.push(iter.next());
	    } else if (index > 0) {
	      line.push(iter.next(index));
	    } else {
	      predicate(line, iter.next(1).attributes || {});
	      line = new Delta();
	    }
	  }
	  if (line.length() > 0) {
	    predicate(line, {});
	  }
	};

	Delta.prototype.transform = function (other, priority) {
	  priority = !!priority;
	  if (typeof other === 'number') {
	    return this.transformPosition(other, priority);
	  }
	  var thisIter = op.iterator(this.ops);
	  var otherIter = op.iterator(other.ops);
	  var delta = new Delta();
	  while (thisIter.hasNext() || otherIter.hasNext()) {
	    if (thisIter.peekType() === 'insert' && (priority || otherIter.peekType() !== 'insert')) {
	      delta.retain(op.length(thisIter.next()));
	    } else if (otherIter.peekType() === 'insert') {
	      delta.push(otherIter.next());
	    } else {
	      var length = Math.min(thisIter.peekLength(), otherIter.peekLength());
	      var thisOp = thisIter.next(length);
	      var otherOp = otherIter.next(length);
	      if (thisOp['delete']) {
	        // Our delete either makes their delete redundant or removes their retain
	        continue;
	      } else if (otherOp['delete']) {
	        delta.push(otherOp);
	      } else {
	        // We retain either their retain or insert
	        delta.retain(length, op.attributes.transform(thisOp.attributes, otherOp.attributes, priority));
	      }
	    }
	  }
	  return delta.chop();
	};

	Delta.prototype.transformPosition = function (index, priority) {
	  priority = !!priority;
	  var thisIter = op.iterator(this.ops);
	  var offset = 0;
	  while (thisIter.hasNext() && offset <= index) {
	    var length = thisIter.peekLength();
	    var nextType = thisIter.peekType();
	    thisIter.next();
	    if (nextType === 'delete') {
	      index -= Math.min(length, index - offset);
	      continue;
	    } else if (nextType === 'insert' && (offset < index || !priority)) {
	      index += length;
	    }
	    offset += length;
	  }
	  return index;
	};


	module.exports = Delta;


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * This library modifies the diff-patch-match library by Neil Fraser
	 * by removing the patch and match functionality and certain advanced
	 * options in the diff function. The original license is as follows:
	 *
	 * ===
	 *
	 * Diff Match and Patch
	 *
	 * Copyright 2006 Google Inc.
	 * http://code.google.com/p/google-diff-match-patch/
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/**
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;


	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {Int} cursor_pos Expected edit position in text1 (optional)
	 * @return {Array} Array of diff tuples.
	 */
	function diff_main(text1, text2, cursor_pos) {
	  // Check for equality (speedup).
	  if (text1 == text2) {
	    if (text1) {
	      return [[DIFF_EQUAL, text1]];
	    }
	    return [];
	  }

	  // Check cursor_pos within bounds
	  if (cursor_pos < 0 || text1.length < cursor_pos) {
	    cursor_pos = null;
	  }

	  // Trim off common prefix (speedup).
	  var commonlength = diff_commonPrefix(text1, text2);
	  var commonprefix = text1.substring(0, commonlength);
	  text1 = text1.substring(commonlength);
	  text2 = text2.substring(commonlength);

	  // Trim off common suffix (speedup).
	  commonlength = diff_commonSuffix(text1, text2);
	  var commonsuffix = text1.substring(text1.length - commonlength);
	  text1 = text1.substring(0, text1.length - commonlength);
	  text2 = text2.substring(0, text2.length - commonlength);

	  // Compute the diff on the middle block.
	  var diffs = diff_compute_(text1, text2);

	  // Restore the prefix and suffix.
	  if (commonprefix) {
	    diffs.unshift([DIFF_EQUAL, commonprefix]);
	  }
	  if (commonsuffix) {
	    diffs.push([DIFF_EQUAL, commonsuffix]);
	  }
	  diff_cleanupMerge(diffs);
	  if (cursor_pos != null) {
	    diffs = fix_cursor(diffs, cursor_pos);
	  }
	  return diffs;
	};


	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_compute_(text1, text2) {
	  var diffs;

	  if (!text1) {
	    // Just add some text (speedup).
	    return [[DIFF_INSERT, text2]];
	  }

	  if (!text2) {
	    // Just delete some text (speedup).
	    return [[DIFF_DELETE, text1]];
	  }

	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  var i = longtext.indexOf(shorttext);
	  if (i != -1) {
	    // Shorter text is inside the longer text (speedup).
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
	             [DIFF_EQUAL, shorttext],
	             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
	    // Swap insertions for deletions if diff is reversed.
	    if (text1.length > text2.length) {
	      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
	    }
	    return diffs;
	  }

	  if (shorttext.length == 1) {
	    // Single character string.
	    // After the previous speedup, the character can't be an equality.
	    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	  }

	  // Check to see if the problem can be split in two.
	  var hm = diff_halfMatch_(text1, text2);
	  if (hm) {
	    // A half-match was found, sort out the return data.
	    var text1_a = hm[0];
	    var text1_b = hm[1];
	    var text2_a = hm[2];
	    var text2_b = hm[3];
	    var mid_common = hm[4];
	    // Send both pairs off for separate processing.
	    var diffs_a = diff_main(text1_a, text2_a);
	    var diffs_b = diff_main(text1_b, text2_b);
	    // Merge the results.
	    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
	  }

	  return diff_bisect_(text1, text2);
	};


	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 * @private
	 */
	function diff_bisect_(text1, text2) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  var max_d = Math.ceil((text1_length + text2_length) / 2);
	  var v_offset = max_d;
	  var v_length = 2 * max_d;
	  var v1 = new Array(v_length);
	  var v2 = new Array(v_length);
	  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
	  // integers and undefined.
	  for (var x = 0; x < v_length; x++) {
	    v1[x] = -1;
	    v2[x] = -1;
	  }
	  v1[v_offset + 1] = 0;
	  v2[v_offset + 1] = 0;
	  var delta = text1_length - text2_length;
	  // If the total number of characters is odd, then the front path will collide
	  // with the reverse path.
	  var front = (delta % 2 != 0);
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length &&
	             text1.charAt(x1) == text2.charAt(y1)) {
	        x1++;
	        y1++;
	      }
	      v1[k1_offset] = x1;
	      if (x1 > text1_length) {
	        // Ran off the right of the graph.
	        k1end += 2;
	      } else if (y1 > text2_length) {
	        // Ran off the bottom of the graph.
	        k1start += 2;
	      } else if (front) {
	        var k2_offset = v_offset + delta - k1;
	        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
	          // Mirror x2 onto top-left coordinate system.
	          var x2 = text1_length - v2[k2_offset];
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }

	    // Walk the reverse path one step.
	    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
	      var k2_offset = v_offset + k2;
	      var x2;
	      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length &&
	             text1.charAt(text1_length - x2 - 1) ==
	             text2.charAt(text2_length - y2 - 1)) {
	        x2++;
	        y2++;
	      }
	      v2[k2_offset] = x2;
	      if (x2 > text1_length) {
	        // Ran off the left of the graph.
	        k2end += 2;
	      } else if (y2 > text2_length) {
	        // Ran off the top of the graph.
	        k2start += 2;
	      } else if (!front) {
	        var k1_offset = v_offset + delta - k2;
	        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
	          var x1 = v1[k1_offset];
	          var y1 = v_offset + x1 - k1_offset;
	          // Mirror x2 onto top-left coordinate system.
	          x2 = text1_length - x2;
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }
	  }
	  // Diff took too long and hit the deadline or
	  // number of diffs equals number of characters, no commonality at all.
	  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	};


	/**
	 * Given the location of the 'middle snake', split the diff in two parts
	 * and recurse.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} x Index of split point in text1.
	 * @param {number} y Index of split point in text2.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_bisectSplit_(text1, text2, x, y) {
	  var text1a = text1.substring(0, x);
	  var text2a = text2.substring(0, y);
	  var text1b = text1.substring(x);
	  var text2b = text2.substring(y);

	  // Compute both diffs serially.
	  var diffs = diff_main(text1a, text2a);
	  var diffsb = diff_main(text1b, text2b);

	  return diffs.concat(diffsb);
	};


	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	function diff_commonPrefix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerstart = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(pointerstart, pointermid) ==
	        text2.substring(pointerstart, pointermid)) {
	      pointermin = pointermid;
	      pointerstart = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Determine the common suffix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of each string.
	 */
	function diff_commonSuffix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 ||
	      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
	        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
	      pointermin = pointermid;
	      pointerend = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 */
	function diff_halfMatch_(text1, text2) {
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null;  // Pointless.
	  }

	  /**
	   * Does a substring of shorttext exist within longtext such that the substring
	   * is at least half the length of longtext?
	   * Closure, but does not reference any external variables.
	   * @param {string} longtext Longer string.
	   * @param {string} shorttext Shorter string.
	   * @param {number} i Start index of quarter length substring within longtext.
	   * @return {Array.<string>} Five element Array, containing the prefix of
	   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
	   *     of shorttext and the common middle.  Or null if there was no match.
	   * @private
	   */
	  function diff_halfMatchI_(longtext, shorttext, i) {
	    // Start with a 1/4 length substring at position i as a seed.
	    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
	    var j = -1;
	    var best_common = '';
	    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
	    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
	      var prefixLength = diff_commonPrefix(longtext.substring(i),
	                                           shorttext.substring(j));
	      var suffixLength = diff_commonSuffix(longtext.substring(0, i),
	                                           shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) +
	            shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b,
	              best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }

	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 2));
	  var hm;
	  if (!hm1 && !hm2) {
	    return null;
	  } else if (!hm2) {
	    hm = hm1;
	  } else if (!hm1) {
	    hm = hm2;
	  } else {
	    // Both matched.  Select the longest.
	    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
	  }

	  // A half-match was found, sort out the return data.
	  var text1_a, text1_b, text2_a, text2_b;
	  if (text1.length > text2.length) {
	    text1_a = hm[0];
	    text1_b = hm[1];
	    text2_a = hm[2];
	    text2_b = hm[3];
	  } else {
	    text2_a = hm[0];
	    text2_b = hm[1];
	    text1_a = hm[2];
	    text1_b = hm[3];
	  }
	  var mid_common = hm[4];
	  return [text1_a, text1_b, text2_a, text2_b, mid_common];
	};


	/**
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {Array} diffs Array of diff tuples.
	 */
	function diff_cleanupMerge(diffs) {
	  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  var commonlength;
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete + count_insert > 1) {
	          if (count_delete !== 0 && count_insert !== 0) {
	            // Factor out any common prefixies.
	            commonlength = diff_commonPrefix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              if ((pointer - count_delete - count_insert) > 0 &&
	                  diffs[pointer - count_delete - count_insert - 1][0] ==
	                  DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] +=
	                    text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL,
	                                    text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length -
	                  commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length -
	                  commonlength);
	              text_delete = text_delete.substring(0, text_delete.length -
	                  commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_insert,
	                count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete,
	                count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert,
	                count_delete + count_insert, [DIFF_DELETE, text_delete],
	                [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert +
	                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
	        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
	          // Merge this equality with the previous one.
	          diffs[pointer - 1][1] += diffs[pointer][1];
	          diffs.splice(pointer, 1);
	        } else {
	          pointer++;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	  }
	  if (diffs[diffs.length - 1][1] === '') {
	    diffs.pop();  // Remove the dummy entry at the end.
	  }

	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
	        diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length -
	          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] +
	            diffs[pointer][1].substring(0, diffs[pointer][1].length -
	                                        diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
	          diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] =
	            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
	            diffs[pointer + 1][1];
	        diffs.splice(pointer + 1, 1);
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	  // If shifts were made, the diff needs reordering and another shift sweep.
	  if (changes) {
	    diff_cleanupMerge(diffs);
	  }
	};


	var diff = diff_main;
	diff.INSERT = DIFF_INSERT;
	diff.DELETE = DIFF_DELETE;
	diff.EQUAL = DIFF_EQUAL;

	module.exports = diff;

	/*
	 * Modify a diff such that the cursor position points to the start of a change:
	 * E.g.
	 *   cursor_normalize_diff([[DIFF_EQUAL, 'abc']], 1)
	 *     => [1, [[DIFF_EQUAL, 'a'], [DIFF_EQUAL, 'bc']]]
	 *   cursor_normalize_diff([[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xyz']], 2)
	 *     => [2, [[DIFF_INSERT, 'new'], [DIFF_DELETE, 'xy'], [DIFF_DELETE, 'z']]]
	 *
	 * @param {Array} diffs Array of diff tuples
	 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
	 * @return {Array} A tuple [cursor location in the modified diff, modified diff]
	 */
	function cursor_normalize_diff (diffs, cursor_pos) {
	  if (cursor_pos === 0) {
	    return [DIFF_EQUAL, diffs];
	  }
	  for (var current_pos = 0, i = 0; i < diffs.length; i++) {
	    var d = diffs[i];
	    if (d[0] === DIFF_DELETE || d[0] === DIFF_EQUAL) {
	      var next_pos = current_pos + d[1].length;
	      if (cursor_pos === next_pos) {
	        return [i + 1, diffs];
	      } else if (cursor_pos < next_pos) {
	        // copy to prevent side effects
	        diffs = diffs.slice();
	        // split d into two diff changes
	        var split_pos = cursor_pos - current_pos;
	        var d_left = [d[0], d[1].slice(0, split_pos)];
	        var d_right = [d[0], d[1].slice(split_pos)];
	        diffs.splice(i, 1, d_left, d_right);
	        return [i + 1, diffs];
	      } else {
	        current_pos = next_pos;
	      }
	    }
	  }
	  throw new Error('cursor_pos is out of bounds!')
	}

	/*
	 * Modify a diff such that the edit position is "shifted" to the proposed edit location (cursor_position).
	 *
	 * Case 1)
	 *   Check if a naive shift is possible:
	 *     [0, X], [ 1, Y] -> [ 1, Y], [0, X]    (if X + Y === Y + X)
	 *     [0, X], [-1, Y] -> [-1, Y], [0, X]    (if X + Y === Y + X) - holds same result
	 * Case 2)
	 *   Check if the following shifts are possible:
	 *     [0, 'pre'], [ 1, 'prefix'] -> [ 1, 'pre'], [0, 'pre'], [ 1, 'fix']
	 *     [0, 'pre'], [-1, 'prefix'] -> [-1, 'pre'], [0, 'pre'], [-1, 'fix']
	 *         ^            ^
	 *         d          d_next
	 *
	 * @param {Array} diffs Array of diff tuples
	 * @param {Int} cursor_pos Suggested edit position. Must not be out of bounds!
	 * @return {Array} Array of diff tuples
	 */
	function fix_cursor (diffs, cursor_pos) {
	  var norm = cursor_normalize_diff(diffs, cursor_pos);
	  var ndiffs = norm[1];
	  var cursor_pointer = norm[0];
	  var d = ndiffs[cursor_pointer];
	  var d_next = ndiffs[cursor_pointer + 1];

	  if (d == null) {
	    // Text was deleted from end of original string,
	    // cursor is now out of bounds in new string
	    return diffs;
	  } else if (d[0] !== DIFF_EQUAL) {
	    // A modification happened at the cursor location.
	    // This is the expected outcome, so we can return the original diff.
	    return diffs;
	  } else {
	    if (d_next != null && d[1] + d_next[1] === d_next[1] + d[1]) {
	      // Case 1)
	      // It is possible to perform a naive shift
	      ndiffs.splice(cursor_pointer, 2, d_next, d)
	      return merge_tuples(ndiffs, cursor_pointer, 2)
	    } else if (d_next != null && d_next[1].indexOf(d[1]) === 0) {
	      // Case 2)
	      // d[1] is a prefix of d_next[1]
	      // We can assume that d_next[0] !== 0, since d[0] === 0
	      // Shift edit locations..
	      ndiffs.splice(cursor_pointer, 2, [d_next[0], d[1]], [0, d[1]]);
	      var suffix = d_next[1].slice(d[1].length);
	      if (suffix.length > 0) {
	        ndiffs.splice(cursor_pointer + 2, 0, [d_next[0], suffix]);
	      }
	      return merge_tuples(ndiffs, cursor_pointer, 3)
	    } else {
	      // Not possible to perform any modification
	      return diffs;
	    }
	  }

	}

	/*
	 * Try to merge tuples with their neigbors in a given range.
	 * E.g. [0, 'a'], [0, 'b'] -> [0, 'ab']
	 *
	 * @param {Array} diffs Array of diff tuples.
	 * @param {Int} start Position of the first element to merge (diffs[start] is also merged with diffs[start - 1]).
	 * @param {Int} length Number of consecutive elements to check.
	 * @return {Array} Array of merged diff tuples.
	 */
	function merge_tuples (diffs, start, length) {
	  // Check from (start-1) to (start+length).
	  for (var i = start + length - 1; i >= 0 && i >= start - 1; i--) {
	    if (i + 1 < diffs.length) {
	      var left_d = diffs[i];
	      var right_d = diffs[i+1];
	      if (left_d[0] === right_d[1]) {
	        diffs.splice(i, 2, [left_d[0], left_d[1] + right_d[1]]);
	      }
	    }
	  }
	  return diffs;
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(23);
	var isArguments = __webpack_require__(24);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;

	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var equal = __webpack_require__(22);
	var extend = __webpack_require__(25);


	var lib = {
	  attributes: {
	    compose: function (a, b, keepNull) {
	      if (typeof a !== 'object') a = {};
	      if (typeof b !== 'object') b = {};
	      var attributes = extend(true, {}, b);
	      if (!keepNull) {
	        attributes = Object.keys(attributes).reduce(function (copy, key) {
	          if (attributes[key] != null) {
	            copy[key] = attributes[key];
	          }
	          return copy;
	        }, {});
	      }
	      for (var key in a) {
	        if (a[key] !== undefined && b[key] === undefined) {
	          attributes[key] = a[key];
	        }
	      }
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    },

	    diff: function(a, b) {
	      if (typeof a !== 'object') a = {};
	      if (typeof b !== 'object') b = {};
	      var attributes = Object.keys(a).concat(Object.keys(b)).reduce(function (attributes, key) {
	        if (!equal(a[key], b[key])) {
	          attributes[key] = b[key] === undefined ? null : b[key];
	        }
	        return attributes;
	      }, {});
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    },

	    transform: function (a, b, priority) {
	      if (typeof a !== 'object') return b;
	      if (typeof b !== 'object') return undefined;
	      if (!priority) return b;  // b simply overwrites us without priority
	      var attributes = Object.keys(b).reduce(function (attributes, key) {
	        if (a[key] === undefined) attributes[key] = b[key];  // null is a valid value
	        return attributes;
	      }, {});
	      return Object.keys(attributes).length > 0 ? attributes : undefined;
	    }
	  },

	  iterator: function (ops) {
	    return new Iterator(ops);
	  },

	  length: function (op) {
	    if (typeof op['delete'] === 'number') {
	      return op['delete'];
	    } else if (typeof op.retain === 'number') {
	      return op.retain;
	    } else {
	      return typeof op.insert === 'string' ? op.insert.length : 1;
	    }
	  }
	};


	function Iterator(ops) {
	  this.ops = ops;
	  this.index = 0;
	  this.offset = 0;
	};

	Iterator.prototype.hasNext = function () {
	  return this.peekLength() < Infinity;
	};

	Iterator.prototype.next = function (length) {
	  if (!length) length = Infinity;
	  var nextOp = this.ops[this.index];
	  if (nextOp) {
	    var offset = this.offset;
	    var opLength = lib.length(nextOp)
	    if (length >= opLength - offset) {
	      length = opLength - offset;
	      this.index += 1;
	      this.offset = 0;
	    } else {
	      this.offset += length;
	    }
	    if (typeof nextOp['delete'] === 'number') {
	      return { 'delete': length };
	    } else {
	      var retOp = {};
	      if (nextOp.attributes) {
	        retOp.attributes = nextOp.attributes;
	      }
	      if (typeof nextOp.retain === 'number') {
	        retOp.retain = length;
	      } else if (typeof nextOp.insert === 'string') {
	        retOp.insert = nextOp.insert.substr(offset, length);
	      } else {
	        // offset should === 0, length should === 1
	        retOp.insert = nextOp.insert;
	      }
	      return retOp;
	    }
	  } else {
	    return { retain: Infinity };
	  }
	};

	Iterator.prototype.peek = function () {
	  return this.ops[this.index];
	};

	Iterator.prototype.peekLength = function () {
	  if (this.ops[this.index]) {
	    // Should never return 0 if our index is being managed correctly
	    return lib.length(this.ops[this.index]) - this.offset;
	  } else {
	    return Infinity;
	  }
	};

	Iterator.prototype.peekType = function () {
	  if (this.ops[this.index]) {
	    if (typeof this.ops[this.index]['delete'] === 'number') {
	      return 'delete';
	    } else if (typeof this.ops[this.index].retain === 'number') {
	      return 'retain';
	    } else {
	      return 'insert';
	    }
	  }
	  return 'retain';
	};


	module.exports = lib;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _op = __webpack_require__(26);

	var _op2 = _interopRequireDefault(_op);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	var _cursor = __webpack_require__(34);

	var _cursor2 = _interopRequireDefault(_cursor);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _clone = __webpack_require__(38);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(22);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _extend = __webpack_require__(25);

	var _extend2 = _interopRequireDefault(_extend);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Editor = function () {
	  function Editor(scroll) {
	    _classCallCheck(this, Editor);

	    this.scroll = scroll;
	    this.delta = this.getDelta();
	  }

	  _createClass(Editor, [{
	    key: 'applyDelta',
	    value: function applyDelta(delta) {
	      var _this = this;

	      var consumeNextNewline = false;
	      this.scroll.update();
	      var scrollLength = this.scroll.length();
	      this.scroll.batch = true;
	      delta = normalizeDelta(delta);
	      delta.reduce(function (index, op) {
	        var length = op.retain || op.delete || op.insert.length || 1;
	        var attributes = op.attributes || {};
	        if (op.insert != null) {
	          if (typeof op.insert === 'string') {
	            var text = op.insert;
	            if (text.endsWith('\n') && consumeNextNewline) {
	              consumeNextNewline = false;
	              text = text.slice(0, -1);
	            }
	            if (index >= scrollLength && !text.endsWith('\n')) {
	              consumeNextNewline = true;
	            }
	            _this.scroll.insertAt(index, text);

	            var _scroll$line = _this.scroll.line(index),
	                _scroll$line2 = _slicedToArray(_scroll$line, 2),
	                line = _scroll$line2[0],
	                offset = _scroll$line2[1];

	            var formats = (0, _extend2.default)({}, (0, _block.bubbleFormats)(line));
	            if (line instanceof _block2.default) {
	              var _line$descendant = line.descendant(_parchment2.default.Leaf, offset),
	                  _line$descendant2 = _slicedToArray(_line$descendant, 1),
	                  leaf = _line$descendant2[0];

	              formats = (0, _extend2.default)(formats, (0, _block.bubbleFormats)(leaf));
	            }
	            attributes = _op2.default.attributes.diff(formats, attributes) || {};
	          } else if (_typeof(op.insert) === 'object') {
	            var key = Object.keys(op.insert)[0]; // There should only be one key
	            if (key == null) return index;
	            _this.scroll.insertAt(index, key, op.insert[key]);
	          }
	          scrollLength += length;
	        }
	        Object.keys(attributes).forEach(function (name) {
	          _this.scroll.formatAt(index, length, name, attributes[name]);
	        });
	        return index + length;
	      }, 0);
	      delta.reduce(function (index, op) {
	        if (typeof op.delete === 'number') {
	          _this.scroll.deleteAt(index, op.delete);
	          return index;
	        }
	        return index + (op.retain || op.insert.length || 1);
	      }, 0);
	      this.scroll.batch = false;
	      this.scroll.optimize();
	      return this.update(delta);
	    }
	  }, {
	    key: 'deleteText',
	    value: function deleteText(index, length) {
	      this.scroll.deleteAt(index, length);
	      return this.update(new _quillDelta2.default().retain(index).delete(length));
	    }
	  }, {
	    key: 'formatLine',
	    value: function formatLine(index, length) {
	      var _this2 = this;

	      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      this.scroll.update();
	      Object.keys(formats).forEach(function (format) {
	        var lines = _this2.scroll.lines(index, Math.max(length, 1));
	        var lengthRemaining = length;
	        lines.forEach(function (line) {
	          var lineLength = line.length();
	          if (!(line instanceof _code2.default)) {
	            line.format(format, formats[format]);
	          } else {
	            var codeIndex = index - line.offset(_this2.scroll);
	            var codeLength = line.newlineIndex(codeIndex + lengthRemaining) - codeIndex + 1;
	            line.formatAt(codeIndex, codeLength, format, formats[format]);
	          }
	          lengthRemaining -= lineLength;
	        });
	      });
	      this.scroll.optimize();
	      return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
	    }
	  }, {
	    key: 'formatText',
	    value: function formatText(index, length) {
	      var _this3 = this;

	      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      Object.keys(formats).forEach(function (format) {
	        _this3.scroll.formatAt(index, length, format, formats[format]);
	      });
	      return this.update(new _quillDelta2.default().retain(index).retain(length, (0, _clone2.default)(formats)));
	    }
	  }, {
	    key: 'getContents',
	    value: function getContents(index, length) {
	      return this.delta.slice(index, index + length);
	    }
	  }, {
	    key: 'getDelta',
	    value: function getDelta() {
	      return this.scroll.lines().reduce(function (delta, line) {
	        return delta.concat(line.delta());
	      }, new _quillDelta2.default());
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat(index) {
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      var lines = [],
	          leaves = [];
	      if (length === 0) {
	        this.scroll.path(index).forEach(function (path) {
	          var _path = _slicedToArray(path, 1),
	              blot = _path[0];

	          if (blot instanceof _block2.default) {
	            lines.push(blot);
	          } else if (blot instanceof _parchment2.default.Leaf) {
	            leaves.push(blot);
	          }
	        });
	      } else {
	        lines = this.scroll.lines(index, length);
	        leaves = this.scroll.descendants(_parchment2.default.Leaf, index, length);
	      }
	      var formatsArr = [lines, leaves].map(function (blots) {
	        if (blots.length === 0) return {};
	        var formats = (0, _block.bubbleFormats)(blots.shift());
	        while (Object.keys(formats).length > 0) {
	          var blot = blots.shift();
	          if (blot == null) return formats;
	          formats = combineFormats((0, _block.bubbleFormats)(blot), formats);
	        }
	        return formats;
	      });
	      return _extend2.default.apply(_extend2.default, formatsArr);
	    }
	  }, {
	    key: 'getText',
	    value: function getText(index, length) {
	      return this.getContents(index, length).filter(function (op) {
	        return typeof op.insert === 'string';
	      }).map(function (op) {
	        return op.insert;
	      }).join('');
	    }
	  }, {
	    key: 'insertEmbed',
	    value: function insertEmbed(index, embed, value) {
	      this.scroll.insertAt(index, embed, value);
	      return this.update(new _quillDelta2.default().retain(index).insert(_defineProperty({}, embed, value)));
	    }
	  }, {
	    key: 'insertText',
	    value: function insertText(index, text) {
	      var _this4 = this;

	      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	      this.scroll.insertAt(index, text);
	      Object.keys(formats).forEach(function (format) {
	        _this4.scroll.formatAt(index, text.length, format, formats[format]);
	      });
	      return this.update(new _quillDelta2.default().retain(index).insert(text, (0, _clone2.default)(formats)));
	    }
	  }, {
	    key: 'isBlank',
	    value: function isBlank() {
	      if (this.scroll.children.length == 0) return true;
	      if (this.scroll.children.length > 1) return false;
	      var child = this.scroll.children.head;
	      return child.length() <= 1 && Object.keys(child.formats()).length == 0;
	    }
	  }, {
	    key: 'removeFormat',
	    value: function removeFormat(index, length) {
	      var text = this.getText(index, length);

	      var _scroll$line3 = this.scroll.line(index + length),
	          _scroll$line4 = _slicedToArray(_scroll$line3, 2),
	          line = _scroll$line4[0],
	          offset = _scroll$line4[1];

	      var suffixLength = 0,
	          suffix = new _quillDelta2.default();
	      if (line != null) {
	        if (!(line instanceof _code2.default)) {
	          suffixLength = line.length() - offset;
	        } else {
	          suffixLength = line.newlineIndex(offset) - offset + 1;
	        }
	        suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
	      }
	      var contents = this.getContents(index, length + suffixLength);
	      var diff = contents.diff(new _quillDelta2.default().insert(text).concat(suffix));
	      var delta = new _quillDelta2.default().retain(index).concat(diff);
	      return this.applyDelta(delta);
	    }
	  }, {
	    key: 'update',
	    value: function update(change) {
	      var _this5 = this;

	      var mutations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	      var cursorIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

	      var oldDelta = this.delta;
	      if (mutations.length === 1 && mutations[0].type === 'characterData' && _parchment2.default.find(mutations[0].target)) {
	        (function () {
	          // Optimization for character changes
	          var textBlot = _parchment2.default.find(mutations[0].target);
	          var formats = (0, _block.bubbleFormats)(textBlot);
	          var index = textBlot.offset(_this5.scroll);
	          var oldValue = mutations[0].oldValue.replace(_cursor2.default.CONTENTS, '');
	          var oldText = new _quillDelta2.default().insert(oldValue);
	          var newText = new _quillDelta2.default().insert(textBlot.value());
	          var diffDelta = new _quillDelta2.default().retain(index).concat(oldText.diff(newText, cursorIndex));
	          change = diffDelta.reduce(function (delta, op) {
	            if (op.insert) {
	              return delta.insert(op.insert, formats);
	            } else {
	              return delta.push(op);
	            }
	          }, new _quillDelta2.default());
	          _this5.delta = oldDelta.compose(change);
	        })();
	      } else {
	        this.delta = this.getDelta();
	        if (!change || !(0, _deepEqual2.default)(oldDelta.compose(change), this.delta)) {
	          change = oldDelta.diff(this.delta, cursorIndex);
	        }
	      }
	      return change;
	    }
	  }]);

	  return Editor;
	}();

	function combineFormats(formats, combined) {
	  return Object.keys(combined).reduce(function (merged, name) {
	    if (formats[name] == null) return merged;
	    if (combined[name] === formats[name]) {
	      merged[name] = combined[name];
	    } else if (Array.isArray(combined[name])) {
	      if (combined[name].indexOf(formats[name]) < 0) {
	        merged[name] = combined[name].concat([formats[name]]);
	      }
	    } else {
	      merged[name] = [combined[name], formats[name]];
	    }
	    return merged;
	  }, {});
	}

	function normalizeDelta(delta) {
	  return delta.reduce(function (delta, op) {
	    if (op.insert === 1) {
	      var attributes = (0, _clone2.default)(op.attributes);
	      delete attributes['image'];
	      return delta.insert({ image: op.attributes.image }, attributes);
	    }
	    if (op.attributes != null && (op.attributes.list === true || op.attributes.bullet === true)) {
	      op = (0, _clone2.default)(op);
	      if (op.attributes.list) {
	        op.attributes.list = 'ordered';
	      } else {
	        op.attributes.list = 'bullet';
	        delete op.attributes.bullet;
	      }
	    }
	    if (typeof op.insert === 'string') {
	      var text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	      return delta.insert(text, op.attributes);
	    }
	    return delta.push(op);
	  }, new _quillDelta2.default());
	}

	exports.default = Editor;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.Code = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	var _text = __webpack_require__(33);

	var _text2 = _interopRequireDefault(_text);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Code = function (_Inline) {
	  _inherits(Code, _Inline);

	  function Code() {
	    _classCallCheck(this, Code);

	    return _possibleConstructorReturn(this, (Code.__proto__ || Object.getPrototypeOf(Code)).apply(this, arguments));
	  }

	  return Code;
	}(_inline2.default);

	Code.blotName = 'code';
	Code.tagName = 'CODE';

	var CodeBlock = function (_Block) {
	  _inherits(CodeBlock, _Block);

	  function CodeBlock() {
	    _classCallCheck(this, CodeBlock);

	    return _possibleConstructorReturn(this, (CodeBlock.__proto__ || Object.getPrototypeOf(CodeBlock)).apply(this, arguments));
	  }

	  _createClass(CodeBlock, [{
	    key: 'delta',
	    value: function delta() {
	      var _this3 = this;

	      var text = this.domNode.textContent;
	      if (text.endsWith('\n')) {
	        // Should always be true
	        text = text.slice(0, -1);
	      }
	      return text.split('\n').reduce(function (delta, frag) {
	        return delta.insert(frag).insert('\n', _this3.formats());
	      }, new _quillDelta2.default());
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      if (name === this.statics.blotName && value) return;

	      var _descendant = this.descendant(_text2.default, this.length() - 1),
	          _descendant2 = _slicedToArray(_descendant, 1),
	          text = _descendant2[0];

	      if (text != null) {
	        text.deleteAt(text.length() - 1, 1);
	      }
	      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'format', this).call(this, name, value);
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (length === 0) return;
	      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK) == null || name === this.statics.blotName && value === this.statics.formats(this.domNode)) {
	        return;
	      }
	      var nextNewline = this.newlineIndex(index);
	      if (nextNewline < 0 || nextNewline >= index + length) return;
	      var prevNewline = this.newlineIndex(index, true) + 1;
	      var isolateLength = nextNewline - prevNewline + 1;
	      var blot = this.isolate(prevNewline, isolateLength);
	      var next = blot.next;
	      blot.format(name, value);
	      if (next instanceof CodeBlock) {
	        next.formatAt(0, index - prevNewline + length - isolateLength, name, value);
	      }
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null) return;

	      var _descendant3 = this.descendant(_text2.default, index),
	          _descendant4 = _slicedToArray(_descendant3, 2),
	          text = _descendant4[0],
	          offset = _descendant4[1];

	      text.insertAt(offset, value);
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      var length = this.domNode.textContent.length;
	      if (!this.domNode.textContent.endsWith('\n')) {
	        return length + 1;
	      }
	      return length;
	    }
	  }, {
	    key: 'newlineIndex',
	    value: function newlineIndex(searchIndex) {
	      var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	      if (!reverse) {
	        var offset = this.domNode.textContent.slice(searchIndex).indexOf('\n');
	        return offset > -1 ? searchIndex + offset : -1;
	      } else {
	        return this.domNode.textContent.slice(0, searchIndex).lastIndexOf('\n');
	      }
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      if (!this.domNode.textContent.endsWith('\n')) {
	        this.appendChild(_parchment2.default.create('text', '\n'));
	      }
	      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'optimize', this).call(this);
	      var next = this.next;
	      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && this.statics.formats(this.domNode) === next.statics.formats(next.domNode)) {
	        next.optimize();
	        next.moveChildren(this);
	        next.remove();
	      }
	    }
	  }, {
	    key: 'replace',
	    value: function replace(target) {
	      _get(CodeBlock.prototype.__proto__ || Object.getPrototypeOf(CodeBlock.prototype), 'replace', this).call(this, target);
	      [].slice.call(this.domNode.querySelectorAll('*')).forEach(function (node) {
	        var blot = _parchment2.default.find(node);
	        if (blot == null) {
	          node.parentNode.removeChild(node);
	        } else if (blot instanceof _parchment2.default.Embed) {
	          blot.remove();
	        } else {
	          blot.unwrap();
	        }
	      });
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var domNode = _get(CodeBlock.__proto__ || Object.getPrototypeOf(CodeBlock), 'create', this).call(this, value);
	      domNode.setAttribute('spellcheck', false);
	      return domNode;
	    }
	  }, {
	    key: 'formats',
	    value: function formats() {
	      return true;
	    }
	  }]);

	  return CodeBlock;
	}(_block2.default);

	CodeBlock.blotName = 'code-block';
	CodeBlock.tagName = 'PRE';
	CodeBlock.TAB = '  ';

	exports.Code = Code;
	exports.default = CodeBlock;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.BlockEmbed = exports.bubbleFormats = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(25);

	var _extend2 = _interopRequireDefault(_extend);

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _break = __webpack_require__(30);

	var _break2 = _interopRequireDefault(_break);

	var _embed = __webpack_require__(31);

	var _embed2 = _interopRequireDefault(_embed);

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	var _text = __webpack_require__(33);

	var _text2 = _interopRequireDefault(_text);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var NEWLINE_LENGTH = 1;

	var BlockEmbed = function (_Embed) {
	  _inherits(BlockEmbed, _Embed);

	  function BlockEmbed() {
	    _classCallCheck(this, BlockEmbed);

	    return _possibleConstructorReturn(this, (BlockEmbed.__proto__ || Object.getPrototypeOf(BlockEmbed)).apply(this, arguments));
	  }

	  _createClass(BlockEmbed, [{
	    key: 'attach',
	    value: function attach() {
	      _get(BlockEmbed.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed.prototype), 'attach', this).call(this);
	      this.attributes = new _parchment2.default.Attributor.Store(this.domNode);
	    }
	  }, {
	    key: 'delta',
	    value: function delta() {
	      return new _quillDelta2.default().insert(this.value(), (0, _extend2.default)(this.formats(), this.attributes.values()));
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      var attribute = _parchment2.default.query(name, _parchment2.default.Scope.BLOCK_ATTRIBUTE);
	      if (attribute != null) {
	        this.attributes.attribute(attribute, value);
	      }
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      this.format(name, value);
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (typeof value === 'string' && value.endsWith('\n')) {
	        var block = _parchment2.default.create(Block.blotName);
	        this.parent.insertBefore(block, index === 0 ? this : this.next);
	        block.insertAt(0, value.slice(0, -1));
	      } else {
	        _get(BlockEmbed.prototype.__proto__ || Object.getPrototypeOf(BlockEmbed.prototype), 'insertAt', this).call(this, index, value, def);
	      }
	    }
	  }]);

	  return BlockEmbed;
	}(_embed2.default);

	BlockEmbed.scope = _parchment2.default.Scope.BLOCK_BLOT;
	// It is important for cursor behavior BlockEmbeds use tags that are block level elements


	var Block = function (_Parchment$Block) {
	  _inherits(Block, _Parchment$Block);

	  function Block(domNode) {
	    _classCallCheck(this, Block);

	    var _this2 = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, domNode));

	    _this2.cache = {};
	    return _this2;
	  }

	  _createClass(Block, [{
	    key: 'delta',
	    value: function delta() {
	      if (this.cache.delta == null) {
	        this.cache.delta = this.descendants(_parchment2.default.Leaf).reduce(function (delta, leaf) {
	          if (leaf.length() === 0) {
	            return delta;
	          } else {
	            return delta.insert(leaf.value(), bubbleFormats(leaf));
	          }
	        }, new _quillDelta2.default()).insert('\n', bubbleFormats(this));
	      }
	      return this.cache.delta;
	    }
	  }, {
	    key: 'deleteAt',
	    value: function deleteAt(index, length) {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'deleteAt', this).call(this, index, length);
	      this.cache = {};
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (length <= 0) return;
	      if (_parchment2.default.query(name, _parchment2.default.Scope.BLOCK)) {
	        if (index + length === this.length()) {
	          this.format(name, value);
	        }
	      } else {
	        _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'formatAt', this).call(this, index, Math.min(length, this.length() - index - 1), name, value);
	      }
	      this.cache = {};
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null) return _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, index, value, def);
	      if (value.length === 0) return;
	      var lines = value.split('\n');
	      var text = lines.shift();
	      if (text.length > 0) {
	        if (index < this.length() - 1 || this.children.tail == null) {
	          _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertAt', this).call(this, Math.min(index, this.length() - 1), text);
	        } else {
	          this.children.tail.insertAt(this.children.tail.length(), text);
	        }
	        this.cache = {};
	      }
	      var block = this;
	      lines.reduce(function (index, line) {
	        block = block.split(index, true);
	        block.insertAt(0, line);
	        return line.length;
	      }, index + text.length);
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      var head = this.children.head;
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'insertBefore', this).call(this, blot, ref);
	      if (head instanceof _break2.default) {
	        head.remove();
	      }
	      this.cache = {};
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      if (this.cache.length == null) {
	        this.cache.length = _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'length', this).call(this) + NEWLINE_LENGTH;
	      }
	      return this.cache.length;
	    }
	  }, {
	    key: 'moveChildren',
	    value: function moveChildren(target, ref) {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'moveChildren', this).call(this, target, ref);
	      this.cache = {};
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'optimize', this).call(this);
	      this.cache = {};
	    }
	  }, {
	    key: 'path',
	    value: function path(index) {
	      return _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'path', this).call(this, index, true);
	    }
	  }, {
	    key: 'removeChild',
	    value: function removeChild(child) {
	      _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'removeChild', this).call(this, child);
	      this.cache = {};
	    }
	  }, {
	    key: 'split',
	    value: function split(index) {
	      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	      if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
	        var clone = this.clone();
	        if (index === 0) {
	          this.parent.insertBefore(clone, this);
	          return this;
	        } else {
	          this.parent.insertBefore(clone, this.next);
	          return clone;
	        }
	      } else {
	        var next = _get(Block.prototype.__proto__ || Object.getPrototypeOf(Block.prototype), 'split', this).call(this, index, force);
	        this.cache = {};
	        return next;
	      }
	    }
	  }]);

	  return Block;
	}(_parchment2.default.Block);

	Block.blotName = 'block';
	Block.tagName = 'P';
	Block.defaultChild = 'break';
	Block.allowedChildren = [_inline2.default, _embed2.default, _text2.default];

	function bubbleFormats(blot) {
	  var formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (blot == null) return formats;
	  if (typeof blot.formats === 'function') {
	    formats = (0, _extend2.default)(formats, blot.formats());
	  }
	  if (blot.parent == null || blot.parent.blotName == 'scroll' || blot.parent.statics.scope !== blot.statics.scope) {
	    return formats;
	  }
	  return bubbleFormats(blot.parent, formats);
	}

	exports.bubbleFormats = bubbleFormats;
	exports.BlockEmbed = BlockEmbed;
	exports.default = Block;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(31);

	var _embed2 = _interopRequireDefault(_embed);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Break = function (_Embed) {
	  _inherits(Break, _Embed);

	  function Break() {
	    _classCallCheck(this, Break);

	    return _possibleConstructorReturn(this, (Break.__proto__ || Object.getPrototypeOf(Break)).apply(this, arguments));
	  }

	  _createClass(Break, [{
	    key: 'insertInto',
	    value: function insertInto(parent, ref) {
	      if (parent.children.length === 0) {
	        _get(Break.prototype.__proto__ || Object.getPrototypeOf(Break.prototype), 'insertInto', this).call(this, parent, ref);
	      } else {
	        this.remove();
	      }
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return 0;
	    }
	  }, {
	    key: 'value',
	    value: function value() {
	      return '';
	    }
	  }], [{
	    key: 'value',
	    value: function value() {
	      return undefined;
	    }
	  }]);

	  return Break;
	}(_embed2.default);

	Break.blotName = 'break';
	Break.tagName = 'BR';

	exports.default = Break;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Embed = function (_Parchment$Embed) {
	  _inherits(Embed, _Parchment$Embed);

	  function Embed() {
	    _classCallCheck(this, Embed);

	    return _possibleConstructorReturn(this, (Embed.__proto__ || Object.getPrototypeOf(Embed)).apply(this, arguments));
	  }

	  return Embed;
	}(_parchment2.default.Embed);

	exports.default = Embed;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(31);

	var _embed2 = _interopRequireDefault(_embed);

	var _text = __webpack_require__(33);

	var _text2 = _interopRequireDefault(_text);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Inline = function (_Parchment$Inline) {
	  _inherits(Inline, _Parchment$Inline);

	  function Inline() {
	    _classCallCheck(this, Inline);

	    return _possibleConstructorReturn(this, (Inline.__proto__ || Object.getPrototypeOf(Inline)).apply(this, arguments));
	  }

	  _createClass(Inline, [{
	    key: 'formatAt',
	    value: function formatAt(index, length, name, value) {
	      if (Inline.compare(this.statics.blotName, name) < 0 && _parchment2.default.query(name, _parchment2.default.Scope.BLOT)) {
	        var blot = this.isolate(index, length);
	        if (value) {
	          blot.wrap(name, value);
	        }
	      } else {
	        _get(Inline.prototype.__proto__ || Object.getPrototypeOf(Inline.prototype), 'formatAt', this).call(this, index, length, name, value);
	      }
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      _get(Inline.prototype.__proto__ || Object.getPrototypeOf(Inline.prototype), 'optimize', this).call(this);
	      if (this.parent instanceof Inline && Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
	        var parent = this.parent.isolate(this.offset(), this.length());
	        this.moveChildren(parent);
	        parent.wrap(this);
	      }
	    }
	  }], [{
	    key: 'compare',
	    value: function compare(self, other) {
	      var selfIndex = Inline.order.indexOf(self);
	      var otherIndex = Inline.order.indexOf(other);
	      if (selfIndex >= 0 || otherIndex >= 0) {
	        return selfIndex - otherIndex;
	      } else if (self === other) {
	        return 0;
	      } else if (self < other) {
	        return -1;
	      } else {
	        return 1;
	      }
	    }
	  }]);

	  return Inline;
	}(_parchment2.default.Inline);

	Inline.allowedChildren = [Inline, _embed2.default, _text2.default];
	// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
	Inline.order = ['cursor', 'inline', // Must be lower
	'code', 'underline', 'strike', 'italic', 'bold', 'script', 'link' // Must be higher
	];

	exports.default = Inline;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TextBlot = function (_Parchment$Text) {
	  _inherits(TextBlot, _Parchment$Text);

	  function TextBlot() {
	    _classCallCheck(this, TextBlot);

	    return _possibleConstructorReturn(this, (TextBlot.__proto__ || Object.getPrototypeOf(TextBlot)).apply(this, arguments));
	  }

	  return TextBlot;
	}(_parchment2.default.Text);

	exports.default = TextBlot;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _embed = __webpack_require__(31);

	var _embed2 = _interopRequireDefault(_embed);

	var _text = __webpack_require__(33);

	var _text2 = _interopRequireDefault(_text);

	var _emitter = __webpack_require__(35);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Cursor = function (_Embed) {
	  _inherits(Cursor, _Embed);

	  _createClass(Cursor, null, [{
	    key: 'value',
	    value: function value() {
	      return undefined;
	    }
	  }]);

	  function Cursor(domNode, selection) {
	    _classCallCheck(this, Cursor);

	    var _this = _possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this, domNode));

	    _this.selection = selection;
	    _this.textNode = document.createTextNode(Cursor.CONTENTS);
	    _this.domNode.appendChild(_this.textNode);
	    _this._length = 0;
	    return _this;
	  }

	  _createClass(Cursor, [{
	    key: 'detach',
	    value: function detach() {
	      // super.detach() will also clear domNode.__blot
	      if (this.parent != null) this.parent.removeChild(this);
	    }
	  }, {
	    key: 'format',
	    value: function format(name, value) {
	      if (this._length !== 0) {
	        return _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'format', this).call(this, name, value);
	      }
	      var target = this,
	          index = 0;
	      while (target != null && target.statics.scope !== _parchment2.default.Scope.BLOCK_BLOT) {
	        index += target.offset(target.parent);
	        target = target.parent;
	      }
	      if (target != null) {
	        this._length = Cursor.CONTENTS.length;
	        target.optimize();
	        target.formatAt(index, Cursor.CONTENTS.length, name, value);
	        this._length = 0;
	      }
	    }
	  }, {
	    key: 'index',
	    value: function index(node, offset) {
	      if (node === this.textNode) return 0;
	      return _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'index', this).call(this, node, offset);
	    }
	  }, {
	    key: 'length',
	    value: function length() {
	      return this._length;
	    }
	  }, {
	    key: 'position',
	    value: function position() {
	      return [this.textNode, this.textNode.data.length];
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _get(Cursor.prototype.__proto__ || Object.getPrototypeOf(Cursor.prototype), 'remove', this).call(this);
	      this.parent = null;
	    }
	  }, {
	    key: 'restore',
	    value: function restore() {
	      var _this2 = this;

	      if (this.selection.composing) return;
	      if (this.parent == null) return;
	      var textNode = this.textNode;
	      var range = this.selection.getNativeRange();
	      var restoreText = void 0,
	          start = void 0,
	          end = void 0;
	      if (range != null && range.start.node === textNode && range.end.node === textNode) {
	        var _ref = [textNode, range.start.offset, range.end.offset];
	        restoreText = _ref[0];
	        start = _ref[1];
	        end = _ref[2];
	      }
	      // Link format will insert text outside of anchor tag
	      while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
	        this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
	      }
	      if (this.textNode.data !== Cursor.CONTENTS) {
	        var text = this.textNode.data.split(Cursor.CONTENTS).join('');
	        if (this.next instanceof _text2.default) {
	          restoreText = this.next.domNode;
	          this.next.insertAt(0, text);
	          this.textNode.data = Cursor.CONTENTS;
	        } else {
	          this.textNode.data = text;
	          this.parent.insertBefore(_parchment2.default.create(this.textNode), this);
	          this.textNode = document.createTextNode(Cursor.CONTENTS);
	          this.domNode.appendChild(this.textNode);
	        }
	      }
	      this.remove();
	      if (start == null) return;
	      this.selection.emitter.once(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
	        var _map = [start, end].map(function (offset) {
	          return Math.max(0, Math.min(restoreText.data.length, offset - 1));
	        });

	        var _map2 = _slicedToArray(_map, 2);

	        start = _map2[0];
	        end = _map2[1];

	        _this2.selection.setNativeRange(restoreText, start, restoreText, end);
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update(mutations) {
	      var _this3 = this;

	      mutations.forEach(function (mutation) {
	        if (mutation.type === 'characterData' && mutation.target === _this3.textNode) {
	          _this3.restore();
	        }
	      });
	    }
	  }, {
	    key: 'value',
	    value: function value() {
	      return '';
	    }
	  }]);

	  return Cursor;
	}(_embed2.default);

	Cursor.blotName = 'cursor';
	Cursor.className = 'ql-cursor';
	Cursor.tagName = 'span';
	Cursor.CONTENTS = '\uFEFF'; // Zero width no break space


	exports.default = Cursor;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _eventemitter = __webpack_require__(36);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _logger = __webpack_require__(37);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:events');

	var Emitter = function (_EventEmitter) {
	  _inherits(Emitter, _EventEmitter);

	  function Emitter() {
	    _classCallCheck(this, Emitter);

	    var _this = _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this));

	    _this.on('error', debug.error);
	    return _this;
	  }

	  _createClass(Emitter, [{
	    key: 'emit',
	    value: function emit() {
	      debug.log.apply(debug, arguments);
	      _get(Emitter.prototype.__proto__ || Object.getPrototypeOf(Emitter.prototype), 'emit', this).apply(this, arguments);
	    }
	  }]);

	  return Emitter;
	}(_eventemitter2.default);

	Emitter.events = {
	  EDITOR_CHANGE: 'editor-change',
	  SCROLL_BEFORE_UPDATE: 'scroll-before-update',
	  SCROLL_OPTIMIZE: 'scroll-optimize',
	  SCROLL_UPDATE: 'scroll-update',
	  SELECTION_CHANGE: 'selection-change',
	  TEXT_CHANGE: 'text-change'
	};
	Emitter.sources = {
	  API: 'api',
	  SILENT: 'silent',
	  USER: 'user'
	};

	exports.default = Emitter;

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty
	  , prefix = '~';

	/**
	 * Constructor to create a storage for our `EE` objects.
	 * An `Events` instance is a plain object whose properties are event names.
	 *
	 * @constructor
	 * @api private
	 */
	function Events() {}

	//
	// We try to not inherit from `Object.prototype`. In some engines creating an
	// instance in this way is faster than calling `Object.create(null)` directly.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// character to make sure that the built-in object properties are not
	// overridden or used as an attack vector.
	//
	if (Object.create) {
	  Events.prototype = Object.create(null);

	  //
	  // This hack is needed because the `__proto__` property is still inherited in
	  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
	  //
	  if (!new Events().__proto__) prefix = false;
	}

	/**
	 * Representation of a single event listener.
	 *
	 * @param {Function} fn The listener function.
	 * @param {Mixed} context The context to invoke the listener with.
	 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	 * @constructor
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal `EventEmitter` interface that is molded against the Node.js
	 * `EventEmitter` interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() {
	  this._events = new Events();
	  this._eventsCount = 0;
	}

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var names = []
	    , events
	    , name;

	  if (this._eventsCount === 0) return names;

	  for (name in (events = this._events)) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return the listeners registered for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Boolean} exists Only check if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events[evt];

	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];

	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }

	  return ee;
	};

	/**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if (listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Add a listener for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {Mixed} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
	  else if (!this._events[evt].fn) this._events[evt].push(listener);
	  else this._events[evt] = [this._events[evt], listener];

	  return this;
	};

	/**
	 * Add a one-time listener for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {Mixed} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
	  else if (!this._events[evt].fn) this._events[evt].push(listener);
	  else this._events[evt] = [this._events[evt], listener];

	  return this;
	};

	/**
	 * Remove the listeners of a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {Mixed} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return this;
	  if (!fn) {
	    if (--this._eventsCount === 0) this._events = new Events();
	    else delete this._events[evt];
	    return this;
	  }

	  var listeners = this._events[evt];

	  if (listeners.fn) {
	    if (
	         listeners.fn === fn
	      && (!once || listeners.once)
	      && (!context || listeners.context === context)
	    ) {
	      if (--this._eventsCount === 0) this._events = new Events();
	      else delete this._events[evt];
	    }
	  } else {
	    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
	      if (
	           listeners[i].fn !== fn
	        || (once && !listeners[i].once)
	        || (context && listeners[i].context !== context)
	      ) {
	        events.push(listeners[i]);
	      }
	    }

	    //
	    // Reset the array, or remove it completely if we have no more listeners.
	    //
	    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
	    else if (--this._eventsCount === 0) this._events = new Events();
	    else delete this._events[evt];
	  }

	  return this;
	};

	/**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {String|Symbol} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  var evt;

	  if (event) {
	    evt = prefix ? prefix + event : event;
	    if (this._events[evt]) {
	      if (--this._eventsCount === 0) this._events = new Events();
	      else delete this._events[evt];
	    }
	  } else {
	    this._events = new Events();
	    this._eventsCount = 0;
	  }

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Allow `EventEmitter` to be imported as module namespace.
	//
	EventEmitter.EventEmitter = EventEmitter;

	//
	// Expose the module.
	//
	if ('undefined' !== typeof module) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var levels = ['error', 'warn', 'log', 'info'];
	var level = 'warn';

	function debug(method) {
	  if (levels.indexOf(method) <= levels.indexOf(level)) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    console[method].apply(console, args); // eslint-disable-line no-console
	  }
	}

	function namespace(ns) {
	  return levels.reduce(function (logger, method) {
	    logger[method] = debug.bind(console, method, ns);
	    return logger;
	  }, {});
	}

	debug.level = namespace.level = function (newLevel) {
	  level = newLevel;
	};

	exports.default = namespace;

/***/ },
/* 38 */
/***/ function(module, exports) {

	var clone = (function() {
	'use strict';

	var nativeMap;
	try {
	  nativeMap = Map;
	} catch(_) {
	  // maybe a reference error because no `Map`. Give it a dummy value that no
	  // value will ever be an instanceof.
	  nativeMap = function() {};
	}

	var nativeSet;
	try {
	  nativeSet = Set;
	} catch(_) {
	  nativeSet = function() {};
	}

	var nativePromise;
	try {
	  nativePromise = Promise;
	} catch(_) {
	  nativePromise = function() {};
	}

	/**
	 * Clones (copies) an Object using deep copying.
	 *
	 * This function supports circular references by default, but if you are certain
	 * there are no circular references in your object, you can save some CPU time
	 * by calling clone(obj, false).
	 *
	 * Caution: if `circular` is false and `parent` contains circular references,
	 * your program may enter an infinite loop and crash.
	 *
	 * @param `parent` - the object to be cloned
	 * @param `circular` - set to true if the object to be cloned may contain
	 *    circular references. (optional - true by default)
	 * @param `depth` - set to a number if the object is only to be cloned to
	 *    a particular depth. (optional - defaults to Infinity)
	 * @param `prototype` - sets the prototype to be used when cloning an object.
	 *    (optional - defaults to parent prototype).
	 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
	 *    should be cloned as well. Non-enumerable properties on the prototype
	 *    chain will be ignored. (optional - false by default)
	*/
	function clone(parent, circular, depth, prototype, includeNonEnumerable) {
	  if (typeof circular === 'object') {
	    depth = circular.depth;
	    prototype = circular.prototype;
	    includeNonEnumerable = circular.includeNonEnumerable;
	    circular = circular.circular;
	  }
	  // maintain two arrays for circular references, where corresponding parents
	  // and children have the same index
	  var allParents = [];
	  var allChildren = [];

	  var useBuffer = typeof Buffer != 'undefined';

	  if (typeof circular == 'undefined')
	    circular = true;

	  if (typeof depth == 'undefined')
	    depth = Infinity;

	  // recurse this function so we don't reset allParents and allChildren
	  function _clone(parent, depth) {
	    // cloning null always returns null
	    if (parent === null)
	      return null;

	    if (depth === 0)
	      return parent;

	    var child;
	    var proto;
	    if (typeof parent != 'object') {
	      return parent;
	    }

	    if (parent instanceof nativeMap) {
	      child = new nativeMap();
	    } else if (parent instanceof nativeSet) {
	      child = new nativeSet();
	    } else if (parent instanceof nativePromise) {
	      child = new nativePromise(function (resolve, reject) {
	        parent.then(function(value) {
	          resolve(_clone(value, depth - 1));
	        }, function(err) {
	          reject(_clone(err, depth - 1));
	        });
	      });
	    } else if (clone.__isArray(parent)) {
	      child = [];
	    } else if (clone.__isRegExp(parent)) {
	      child = new RegExp(parent.source, __getRegExpFlags(parent));
	      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	    } else if (clone.__isDate(parent)) {
	      child = new Date(parent.getTime());
	    } else if (useBuffer && Buffer.isBuffer(parent)) {
	      child = new Buffer(parent.length);
	      parent.copy(child);
	      return child;
	    } else if (parent instanceof Error) {
	      child = Object.create(parent);
	    } else {
	      if (typeof prototype == 'undefined') {
	        proto = Object.getPrototypeOf(parent);
	        child = Object.create(proto);
	      }
	      else {
	        child = Object.create(prototype);
	        proto = prototype;
	      }
	    }

	    if (circular) {
	      var index = allParents.indexOf(parent);

	      if (index != -1) {
	        return allChildren[index];
	      }
	      allParents.push(parent);
	      allChildren.push(child);
	    }

	    if (parent instanceof nativeMap) {
	      var keyIterator = parent.keys();
	      while(true) {
	        var next = keyIterator.next();
	        if (next.done) {
	          break;
	        }
	        var keyChild = _clone(next.value, depth - 1);
	        var valueChild = _clone(parent.get(next.value), depth - 1);
	        child.set(keyChild, valueChild);
	      }
	    }
	    if (parent instanceof nativeSet) {
	      var iterator = parent.keys();
	      while(true) {
	        var next = iterator.next();
	        if (next.done) {
	          break;
	        }
	        var entryChild = _clone(next.value, depth - 1);
	        child.add(entryChild);
	      }
	    }

	    for (var i in parent) {
	      var attrs;
	      if (proto) {
	        attrs = Object.getOwnPropertyDescriptor(proto, i);
	      }

	      if (attrs && attrs.set == null) {
	        continue;
	      }
	      child[i] = _clone(parent[i], depth - 1);
	    }

	    if (Object.getOwnPropertySymbols) {
	      var symbols = Object.getOwnPropertySymbols(parent);
	      for (var i = 0; i < symbols.length; i++) {
	        // Don't need to worry about cloning a symbol because it is a primitive,
	        // like a number or string.
	        var symbol = symbols[i];
	        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
	        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
	          continue;
	        }
	        child[symbol] = _clone(parent[symbol], depth - 1);
	        if (!descriptor.enumerable) {
	          Object.defineProperty(child, symbol, {
	            enumerable: false
	          });
	        }
	      }
	    }

	    if (includeNonEnumerable) {
	      var allPropertyNames = Object.getOwnPropertyNames(parent);
	      for (var i = 0; i < allPropertyNames.length; i++) {
	        var propertyName = allPropertyNames[i];
	        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
	        if (descriptor && descriptor.enumerable) {
	          continue;
	        }
	        child[propertyName] = _clone(parent[propertyName], depth - 1);
	        Object.defineProperty(child, propertyName, {
	          enumerable: false
	        });
	      }
	    }

	    return child;
	  }

	  return _clone(parent, depth);
	}

	/**
	 * Simple flat clone using prototype, accepts only objects, usefull for property
	 * override on FLAT configuration object (no nested props).
	 *
	 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	 * works.
	 */
	clone.clonePrototype = function clonePrototype(parent) {
	  if (parent === null)
	    return null;

	  var c = function () {};
	  c.prototype = parent;
	  return new c();
	};

	// private utility functions

	function __objToStr(o) {
	  return Object.prototype.toString.call(o);
	}
	clone.__objToStr = __objToStr;

	function __isDate(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Date]';
	}
	clone.__isDate = __isDate;

	function __isArray(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object Array]';
	}
	clone.__isArray = __isArray;

	function __isRegExp(o) {
	  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
	}
	clone.__isRegExp = __isRegExp;

	function __getRegExpFlags(re) {
	  var flags = '';
	  if (re.global) flags += 'g';
	  if (re.ignoreCase) flags += 'i';
	  if (re.multiline) flags += 'm';
	  return flags;
	}
	clone.__getRegExpFlags = __getRegExpFlags;

	return clone;
	})();

	if (typeof module === 'object' && module.exports) {
	  module.exports = clone;
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Module = function Module(quill) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  _classCallCheck(this, Module);

	  this.quill = quill;
	  this.options = options;
	};

	Module.DEFAULTS = {};

	exports.default = Module;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.Range = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _clone = __webpack_require__(38);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(22);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _emitter3 = __webpack_require__(35);

	var _emitter4 = _interopRequireDefault(_emitter3);

	var _logger = __webpack_require__(37);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = (0, _logger2.default)('quill:selection');

	var Range = function Range(index) {
	  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	  _classCallCheck(this, Range);

	  this.index = index;
	  this.length = length;
	};

	var Selection = function () {
	  function Selection(scroll, emitter) {
	    var _this = this;

	    _classCallCheck(this, Selection);

	    this.emitter = emitter;
	    this.scroll = scroll;
	    this.composing = false;
	    this.root = this.scroll.domNode;
	    this.root.addEventListener('compositionstart', function () {
	      _this.composing = true;
	    });
	    this.root.addEventListener('compositionend', function () {
	      _this.composing = false;
	    });
	    this.cursor = _parchment2.default.create('cursor', this);
	    // savedRange is last non-null range
	    this.lastRange = this.savedRange = new Range(0, 0);
	    ['keyup', 'mouseup', 'mouseleave', 'touchend', 'touchleave', 'focus', 'blur'].forEach(function (eventName) {
	      _this.root.addEventListener(eventName, function () {
	        // When range used to be a selection and user click within the selection,
	        // the range now being a cursor has not updated yet without setTimeout
	        setTimeout(_this.update.bind(_this, _emitter4.default.sources.USER), 100);
	      });
	    });
	    this.emitter.on(_emitter4.default.events.EDITOR_CHANGE, function (type, delta) {
	      if (type === _emitter4.default.events.TEXT_CHANGE && delta.length() > 0) {
	        _this.update(_emitter4.default.sources.SILENT);
	      }
	    });
	    this.emitter.on(_emitter4.default.events.SCROLL_BEFORE_UPDATE, function () {
	      var native = _this.getNativeRange();
	      if (native == null) return;
	      if (native.start.node === _this.cursor.textNode) return; // cursor.restore() will handle
	      // TODO unclear if this has negative side effects
	      _this.emitter.once(_emitter4.default.events.SCROLL_UPDATE, function () {
	        try {
	          _this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
	        } catch (ignored) {}
	      });
	    });
	    this.update(_emitter4.default.sources.SILENT);
	  }

	  _createClass(Selection, [{
	    key: 'focus',
	    value: function focus() {
	      if (this.hasFocus()) return;
	      this.root.focus();
	      this.setRange(this.savedRange);
	    }
	  }, {
	    key: 'format',
	    value: function format(_format, value) {
	      if (this.scroll.whitelist != null && !this.scroll.whitelist[_format]) return;
	      this.scroll.update();
	      var nativeRange = this.getNativeRange();
	      if (nativeRange == null || !nativeRange.native.collapsed || _parchment2.default.query(_format, _parchment2.default.Scope.BLOCK)) return;
	      if (nativeRange.start.node !== this.cursor.textNode) {
	        var blot = _parchment2.default.find(nativeRange.start.node, false);
	        if (blot == null) return;
	        // TODO Give blot ability to not split
	        if (blot instanceof _parchment2.default.Leaf) {
	          var after = blot.split(nativeRange.start.offset);
	          blot.parent.insertBefore(this.cursor, after);
	        } else {
	          blot.insertBefore(this.cursor, nativeRange.start.node); // Should never happen
	        }
	        this.cursor.attach();
	      }
	      this.cursor.format(_format, value);
	      this.scroll.optimize();
	      this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
	      this.update();
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds(index) {
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      var scrollLength = this.scroll.length();
	      index = Math.min(index, scrollLength - 1);
	      length = Math.min(index + length, scrollLength - 1) - index;
	      var bounds = void 0,
	          node = void 0,
	          _scroll$leaf = this.scroll.leaf(index),
	          _scroll$leaf2 = _slicedToArray(_scroll$leaf, 2),
	          leaf = _scroll$leaf2[0],
	          offset = _scroll$leaf2[1];
	      if (leaf == null) return null;

	      var _leaf$position = leaf.position(offset, true);

	      var _leaf$position2 = _slicedToArray(_leaf$position, 2);

	      node = _leaf$position2[0];
	      offset = _leaf$position2[1];

	      var range = document.createRange();
	      if (length > 0) {
	        range.setStart(node, offset);

	        var _scroll$leaf3 = this.scroll.leaf(index + length);

	        var _scroll$leaf4 = _slicedToArray(_scroll$leaf3, 2);

	        leaf = _scroll$leaf4[0];
	        offset = _scroll$leaf4[1];

	        if (leaf == null) return null;

	        var _leaf$position3 = leaf.position(offset, true);

	        var _leaf$position4 = _slicedToArray(_leaf$position3, 2);

	        node = _leaf$position4[0];
	        offset = _leaf$position4[1];

	        range.setEnd(node, offset);
	        bounds = range.getBoundingClientRect();
	      } else {
	        var side = 'left';
	        var rect = void 0;
	        if (node instanceof Text) {
	          if (offset < node.data.length) {
	            range.setStart(node, offset);
	            range.setEnd(node, offset + 1);
	          } else {
	            range.setStart(node, offset - 1);
	            range.setEnd(node, offset);
	            side = 'right';
	          }
	          rect = range.getBoundingClientRect();
	        } else {
	          rect = leaf.domNode.getBoundingClientRect();
	          if (offset > 0) side = 'right';
	        }
	        bounds = {
	          height: rect.height,
	          left: rect[side],
	          width: 0,
	          top: rect.top
	        };
	      }
	      var containerBounds = this.root.parentNode.getBoundingClientRect();
	      return {
	        left: bounds.left - containerBounds.left,
	        right: bounds.left + bounds.width - containerBounds.left,
	        top: bounds.top - containerBounds.top,
	        bottom: bounds.top + bounds.height - containerBounds.top,
	        height: bounds.height,
	        width: bounds.width
	      };
	    }
	  }, {
	    key: 'getNativeRange',
	    value: function getNativeRange() {
	      var selection = document.getSelection();
	      if (selection == null || selection.rangeCount <= 0) return null;
	      var nativeRange = selection.getRangeAt(0);
	      if (nativeRange == null) return null;
	      if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
	        return null;
	      }
	      var range = {
	        start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
	        end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
	        native: nativeRange
	      };
	      [range.start, range.end].forEach(function (position) {
	        var node = position.node,
	            offset = position.offset;
	        while (!(node instanceof Text) && node.childNodes.length > 0) {
	          if (node.childNodes.length > offset) {
	            node = node.childNodes[offset];
	            offset = 0;
	          } else if (node.childNodes.length === offset) {
	            node = node.lastChild;
	            offset = node instanceof Text ? node.data.length : node.childNodes.length + 1;
	          } else {
	            break;
	          }
	        }
	        position.node = node, position.offset = offset;
	      });
	      debug.info('getNativeRange', range);
	      return range;
	    }
	  }, {
	    key: 'getRange',
	    value: function getRange() {
	      var _this2 = this;

	      var range = this.getNativeRange();
	      if (range == null) return [null, null];
	      var positions = [[range.start.node, range.start.offset]];
	      if (!range.native.collapsed) {
	        positions.push([range.end.node, range.end.offset]);
	      }
	      var indexes = positions.map(function (position) {
	        var _position = _slicedToArray(position, 2),
	            node = _position[0],
	            offset = _position[1];

	        var blot = _parchment2.default.find(node, true);
	        var index = blot.offset(_this2.scroll);
	        if (offset === 0) {
	          return index;
	        } else if (blot instanceof _parchment2.default.Container) {
	          return index + blot.length();
	        } else {
	          return index + blot.index(node, offset);
	        }
	      });
	      var start = Math.min.apply(Math, _toConsumableArray(indexes)),
	          end = Math.max.apply(Math, _toConsumableArray(indexes));
	      end = Math.min(end, this.scroll.length() - 1);
	      return [new Range(start, end - start), range];
	    }
	  }, {
	    key: 'hasFocus',
	    value: function hasFocus() {
	      return document.activeElement === this.root;
	    }
	  }, {
	    key: 'scrollIntoView',
	    value: function scrollIntoView() {
	      var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.lastRange;

	      if (range == null) return;
	      var bounds = this.getBounds(range.index, range.length);
	      if (bounds == null) return;
	      if (this.root.offsetHeight < bounds.bottom) {
	        var _scroll$line = this.scroll.line(Math.min(range.index + range.length, this.scroll.length() - 1)),
	            _scroll$line2 = _slicedToArray(_scroll$line, 1),
	            line = _scroll$line2[0];

	        this.root.scrollTop = line.domNode.offsetTop + line.domNode.offsetHeight - this.root.offsetHeight;
	      } else if (bounds.top < 0) {
	        var _scroll$line3 = this.scroll.line(Math.min(range.index, this.scroll.length() - 1)),
	            _scroll$line4 = _slicedToArray(_scroll$line3, 1),
	            _line = _scroll$line4[0];

	        this.root.scrollTop = _line.domNode.offsetTop;
	      }
	    }
	  }, {
	    key: 'setNativeRange',
	    value: function setNativeRange(startNode, startOffset) {
	      var endNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : startNode;
	      var endOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : startOffset;
	      var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	      debug.info('setNativeRange', startNode, startOffset, endNode, endOffset);
	      if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
	        return;
	      }
	      var selection = document.getSelection();
	      if (selection == null) return;
	      if (startNode != null) {
	        if (!this.hasFocus()) this.root.focus();
	        var native = (this.getNativeRange() || {}).native;
	        if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
	          var range = document.createRange();
	          range.setStart(startNode, startOffset);
	          range.setEnd(endNode, endOffset);
	          selection.removeAllRanges();
	          selection.addRange(range);
	        }
	      } else {
	        selection.removeAllRanges();
	        this.root.blur();
	        document.body.focus(); // root.blur() not enough on IE11+Travis+SauceLabs (but not local VMs)
	      }
	    }
	  }, {
	    key: 'setRange',
	    value: function setRange(range) {
	      var _this3 = this;

	      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter4.default.sources.API;

	      if (typeof force === 'string') {
	        source = force;
	        force = false;
	      }
	      debug.info('setRange', range);
	      if (range != null) {
	        (function () {
	          var indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
	          var args = [];
	          var scrollLength = _this3.scroll.length();
	          indexes.forEach(function (index, i) {
	            index = Math.min(scrollLength - 1, index);
	            var node = void 0,
	                _scroll$leaf5 = _this3.scroll.leaf(index),
	                _scroll$leaf6 = _slicedToArray(_scroll$leaf5, 2),
	                leaf = _scroll$leaf6[0],
	                offset = _scroll$leaf6[1];
	            var _leaf$position5 = leaf.position(offset, i !== 0);

	            var _leaf$position6 = _slicedToArray(_leaf$position5, 2);

	            node = _leaf$position6[0];
	            offset = _leaf$position6[1];

	            args.push(node, offset);
	          });
	          if (args.length < 2) {
	            args = args.concat(args);
	          }
	          _this3.setNativeRange.apply(_this3, _toConsumableArray(args).concat([force]));
	        })();
	      } else {
	        this.setNativeRange(null);
	      }
	      this.update(source);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter4.default.sources.USER;

	      var nativeRange = void 0,
	          oldRange = this.lastRange;

	      var _getRange = this.getRange();

	      var _getRange2 = _slicedToArray(_getRange, 2);

	      this.lastRange = _getRange2[0];
	      nativeRange = _getRange2[1];

	      if (this.lastRange != null) {
	        this.savedRange = this.lastRange;
	      }
	      if (!(0, _deepEqual2.default)(oldRange, this.lastRange)) {
	        var _emitter;

	        if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
	          this.cursor.restore();
	        }
	        var args = [_emitter4.default.events.SELECTION_CHANGE, (0, _clone2.default)(this.lastRange), (0, _clone2.default)(oldRange), source];
	        (_emitter = this.emitter).emit.apply(_emitter, [_emitter4.default.events.EDITOR_CHANGE].concat(args));
	        if (source !== _emitter4.default.sources.SILENT) {
	          var _emitter2;

	          (_emitter2 = this.emitter).emit.apply(_emitter2, args);
	        }
	      }
	    }
	  }]);

	  return Selection;
	}();

	function contains(parent, descendant) {
	  try {
	    // Firefox inserts inaccessible nodes around video elements
	    descendant.parentNode;
	  } catch (e) {
	    return false;
	  }
	  // IE11 has bug with Text nodes
	  // https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect
	  if (descendant instanceof Text) {
	    descendant = descendant.parentNode;
	  }
	  return parent.contains(descendant);
	}

	exports.Range = Range;
	exports.default = Selection;

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Theme = function () {
	  function Theme(quill, options) {
	    _classCallCheck(this, Theme);

	    this.quill = quill;
	    this.options = options;
	    this.modules = {};
	  }

	  _createClass(Theme, [{
	    key: 'init',
	    value: function init() {
	      var _this = this;

	      Object.keys(this.options.modules).forEach(function (name) {
	        if (_this.modules[name] == null) {
	          _this.addModule(name);
	        }
	      });
	    }
	  }, {
	    key: 'addModule',
	    value: function addModule(name) {
	      var moduleClass = this.quill.constructor.import('modules/' + name);
	      this.modules[name] = new moduleClass(this.quill, this.options.modules[name] || {});
	      return this.modules[name];
	    }
	  }]);

	  return Theme;
	}();

	Theme.DEFAULTS = {
	  modules: {}
	};
	Theme.themes = {
	  'default': Theme
	};

	exports.default = Theme;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Container = function (_Parchment$Container) {
	  _inherits(Container, _Parchment$Container);

	  function Container() {
	    _classCallCheck(this, Container);

	    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
	  }

	  return Container;
	}(_parchment2.default.Container);

	Container.allowedChildren = [_block2.default, _block.BlockEmbed, Container];

	exports.default = Container;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _emitter = __webpack_require__(35);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _break = __webpack_require__(30);

	var _break2 = _interopRequireDefault(_break);

	var _container = __webpack_require__(42);

	var _container2 = _interopRequireDefault(_container);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function isLine(blot) {
	  return blot instanceof _block2.default || blot instanceof _block.BlockEmbed;
	}

	var Scroll = function (_Parchment$Scroll) {
	  _inherits(Scroll, _Parchment$Scroll);

	  function Scroll(domNode, config) {
	    _classCallCheck(this, Scroll);

	    var _this = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this, domNode));

	    _this.emitter = config.emitter;
	    if (Array.isArray(config.whitelist)) {
	      _this.whitelist = config.whitelist.reduce(function (whitelist, format) {
	        whitelist[format] = true;
	        return whitelist;
	      }, {});
	    }
	    _this.optimize();
	    _this.enable();
	    return _this;
	  }

	  _createClass(Scroll, [{
	    key: 'deleteAt',
	    value: function deleteAt(index, length) {
	      var _line = this.line(index),
	          _line2 = _slicedToArray(_line, 2),
	          first = _line2[0],
	          offset = _line2[1];

	      var _line3 = this.line(index + length),
	          _line4 = _slicedToArray(_line3, 1),
	          last = _line4[0];

	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'deleteAt', this).call(this, index, length);
	      if (last != null && first !== last && offset > 0 && !(first instanceof _block.BlockEmbed) && !(last instanceof _block.BlockEmbed)) {
	        if (last instanceof _code2.default) {
	          last.deleteAt(last.length() - 1, 1);
	        }
	        var ref = last.children.head instanceof _break2.default ? null : last.children.head;
	        first.moveChildren(last, ref);
	        first.remove();
	      }
	      this.optimize();
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      this.domNode.setAttribute('contenteditable', enabled);
	    }
	  }, {
	    key: 'formatAt',
	    value: function formatAt(index, length, format, value) {
	      if (this.whitelist != null && !this.whitelist[format]) return;
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'formatAt', this).call(this, index, length, format, value);
	      this.optimize();
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, value, def) {
	      if (def != null && this.whitelist != null && !this.whitelist[value]) return;
	      if (index >= this.length()) {
	        if (def == null || _parchment2.default.query(value, _parchment2.default.Scope.BLOCK) == null) {
	          var blot = _parchment2.default.create(this.statics.defaultChild);
	          this.appendChild(blot);
	          if (def == null && value.endsWith('\n')) {
	            value = value.slice(0, -1);
	          }
	          blot.insertAt(0, value, def);
	        } else {
	          var embed = _parchment2.default.create(value, def);
	          this.appendChild(embed);
	        }
	      } else {
	        _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'insertAt', this).call(this, index, value, def);
	      }
	      this.optimize();
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      if (blot.statics.scope === _parchment2.default.Scope.INLINE_BLOT) {
	        var wrapper = _parchment2.default.create(this.statics.defaultChild);
	        wrapper.appendChild(blot);
	        blot = wrapper;
	      }
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'insertBefore', this).call(this, blot, ref);
	    }
	  }, {
	    key: 'leaf',
	    value: function leaf(index) {
	      return this.path(index).pop() || [null, -1];
	    }
	  }, {
	    key: 'line',
	    value: function line(index) {
	      if (index === this.length()) {
	        return this.line(index - 1);
	      }
	      return this.descendant(isLine, index);
	    }
	  }, {
	    key: 'lines',
	    value: function lines() {
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;

	      var getLines = function getLines(blot, index, length) {
	        var lines = [],
	            lengthLeft = length;
	        blot.children.forEachAt(index, length, function (child, index, length) {
	          if (isLine(child)) {
	            lines.push(child);
	          } else if (child instanceof _parchment2.default.Container) {
	            lines = lines.concat(getLines(child, index, lengthLeft));
	          }
	          lengthLeft -= length;
	        });
	        return lines;
	      };
	      return getLines(this, index, length);
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	      if (this.batch === true) return;
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'optimize', this).call(this, mutations);
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_OPTIMIZE, mutations);
	      }
	    }
	  }, {
	    key: 'path',
	    value: function path(index) {
	      return _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'path', this).call(this, index).slice(1); // Exclude self
	    }
	  }, {
	    key: 'update',
	    value: function update(mutations) {
	      if (this.batch === true) return;
	      var source = _emitter2.default.sources.USER;
	      if (typeof mutations === 'string') {
	        source = mutations;
	      }
	      if (!Array.isArray(mutations)) {
	        mutations = this.observer.takeRecords();
	      }
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_BEFORE_UPDATE, source, mutations);
	      }
	      _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'update', this).call(this, mutations.concat([])); // pass copy
	      if (mutations.length > 0) {
	        this.emitter.emit(_emitter2.default.events.SCROLL_UPDATE, source, mutations);
	      }
	    }
	  }]);

	  return Scroll;
	}(_parchment2.default.Scroll);

	Scroll.blotName = 'scroll';
	Scroll.className = 'ql-editor';
	Scroll.tagName = 'DIV';
	Scroll.defaultChild = 'block';
	Scroll.allowedChildren = [_block2.default, _block.BlockEmbed, _container2.default];

	exports.default = Scroll;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.matchText = exports.matchSpacing = exports.matchNewline = exports.matchBlot = exports.matchAttributor = exports.default = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(37);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _align = __webpack_require__(45);

	var _background = __webpack_require__(46);

	var _color = __webpack_require__(47);

	var _direction = __webpack_require__(48);

	var _font = __webpack_require__(49);

	var _size = __webpack_require__(50);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:clipboard');

	var DOM_KEY = '__ql-matcher';

	var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], ['br', matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchSpacing], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ['b', matchAlias.bind(matchAlias, 'bold')], ['i', matchAlias.bind(matchAlias, 'italic')], ['style', matchIgnore]];

	var ATTRIBUTE_ATTRIBUTORS = [_align.AlignAttribute, _direction.DirectionAttribute].reduce(function (memo, attr) {
	  memo[attr.keyName] = attr;
	  return memo;
	}, {});

	var STYLE_ATTRIBUTORS = [_align.AlignStyle, _background.BackgroundStyle, _color.ColorStyle, _direction.DirectionStyle, _font.FontStyle, _size.SizeStyle].reduce(function (memo, attr) {
	  memo[attr.keyName] = attr;
	  return memo;
	}, {});

	var Clipboard = function (_Module) {
	  _inherits(Clipboard, _Module);

	  function Clipboard(quill, options) {
	    _classCallCheck(this, Clipboard);

	    var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this, quill, options));

	    _this.quill.root.addEventListener('paste', _this.onPaste.bind(_this));
	    _this.container = _this.quill.addContainer('ql-clipboard');
	    _this.container.setAttribute('contenteditable', true);
	    _this.container.setAttribute('tabindex', -1);
	    _this.matchers = [];
	    CLIPBOARD_CONFIG.concat(_this.options.matchers).forEach(function (pair) {
	      _this.addMatcher.apply(_this, _toConsumableArray(pair));
	    });
	    return _this;
	  }

	  _createClass(Clipboard, [{
	    key: 'addMatcher',
	    value: function addMatcher(selector, matcher) {
	      this.matchers.push([selector, matcher]);
	    }
	  }, {
	    key: 'convert',
	    value: function convert(html) {
	      if (typeof html === 'string') {
	        this.container.innerHTML = html;
	      }

	      var _prepareMatching = this.prepareMatching(),
	          _prepareMatching2 = _slicedToArray(_prepareMatching, 2),
	          elementMatchers = _prepareMatching2[0],
	          textMatchers = _prepareMatching2[1];

	      var delta = traverse(this.container, elementMatchers, textMatchers);
	      // Remove trailing newline
	      if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
	        delta = delta.compose(new _quillDelta2.default().retain(delta.length() - 1).delete(1));
	      }
	      debug.log('convert', this.container.innerHTML, delta);
	      this.container.innerHTML = '';
	      return delta;
	    }
	  }, {
	    key: 'dangerouslyPasteHTML',
	    value: function dangerouslyPasteHTML(index, html) {
	      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _quill2.default.sources.API;

	      if (typeof index === 'string') {
	        return this.quill.setContents(this.convert(index), html);
	      } else {
	        var paste = this.convert(html);
	        return this.quill.updateContents(new _quillDelta2.default().retain(index).concat(paste), source);
	      }
	    }
	  }, {
	    key: 'onPaste',
	    value: function onPaste(e) {
	      var _this2 = this;

	      if (e.defaultPrevented || !this.quill.isEnabled()) return;
	      var range = this.quill.getSelection();
	      var delta = new _quillDelta2.default().retain(range.index);
	      var scrollTop = this.quill.scrollingContainer.scrollTop;
	      this.container.focus();
	      setTimeout(function () {
	        _this2.quill.selection.update(_quill2.default.sources.SILENT);
	        delta = delta.concat(_this2.convert()).delete(range.length);
	        _this2.quill.updateContents(delta, _quill2.default.sources.USER);
	        // range.length contributes to delta.length()
	        _this2.quill.setSelection(delta.length() - range.length, _quill2.default.sources.SILENT);
	        _this2.quill.scrollingContainer.scrollTop = scrollTop;
	        _this2.quill.selection.scrollIntoView();
	      }, 1);
	    }
	  }, {
	    key: 'prepareMatching',
	    value: function prepareMatching() {
	      var _this3 = this;

	      var elementMatchers = [],
	          textMatchers = [];
	      this.matchers.forEach(function (pair) {
	        var _pair = _slicedToArray(pair, 2),
	            selector = _pair[0],
	            matcher = _pair[1];

	        switch (selector) {
	          case Node.TEXT_NODE:
	            textMatchers.push(matcher);
	            break;
	          case Node.ELEMENT_NODE:
	            elementMatchers.push(matcher);
	            break;
	          default:
	            [].forEach.call(_this3.container.querySelectorAll(selector), function (node) {
	              // TODO use weakmap
	              node[DOM_KEY] = node[DOM_KEY] || [];
	              node[DOM_KEY].push(matcher);
	            });
	            break;
	        }
	      });
	      return [elementMatchers, textMatchers];
	    }
	  }]);

	  return Clipboard;
	}(_module2.default);

	Clipboard.DEFAULTS = {
	  matchers: []
	};

	function computeStyle(node) {
	  if (node.nodeType !== Node.ELEMENT_NODE) return {};
	  var DOM_KEY = '__ql-computed-style';
	  return node[DOM_KEY] || (node[DOM_KEY] = window.getComputedStyle(node));
	}

	function deltaEndsWith(delta, text) {
	  var endText = "";
	  for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
	    var op = delta.ops[i];
	    if (typeof op.insert !== 'string') break;
	    endText = op.insert + endText;
	  }
	  return endText.slice(-1 * text.length) === text;
	}

	function isLine(node) {
	  if (node.childNodes.length === 0) return false; // Exclude embed blocks
	  var style = computeStyle(node);
	  return ['block', 'list-item'].indexOf(style.display) > -1;
	}

	function traverse(node, elementMatchers, textMatchers) {
	  // Post-order
	  if (node.nodeType === node.TEXT_NODE) {
	    return textMatchers.reduce(function (delta, matcher) {
	      return matcher(node, delta);
	    }, new _quillDelta2.default());
	  } else if (node.nodeType === node.ELEMENT_NODE) {
	    return [].reduce.call(node.childNodes || [], function (delta, childNode) {
	      var childrenDelta = traverse(childNode, elementMatchers, textMatchers);
	      if (childNode.nodeType === node.ELEMENT_NODE) {
	        childrenDelta = elementMatchers.reduce(function (childrenDelta, matcher) {
	          return matcher(childNode, childrenDelta);
	        }, childrenDelta);
	        childrenDelta = (childNode[DOM_KEY] || []).reduce(function (childrenDelta, matcher) {
	          return matcher(childNode, childrenDelta);
	        }, childrenDelta);
	      }
	      return delta.concat(childrenDelta);
	    }, new _quillDelta2.default());
	  } else {
	    return new _quillDelta2.default();
	  }
	}

	function matchAlias(format, node, delta) {
	  return delta.compose(new _quillDelta2.default().retain(delta.length(), _defineProperty({}, format, true)));
	}

	function matchAttributor(node, delta) {
	  var attributes = _parchment2.default.Attributor.Attribute.keys(node);
	  var classes = _parchment2.default.Attributor.Class.keys(node);
	  var styles = _parchment2.default.Attributor.Style.keys(node);
	  var formats = {};
	  attributes.concat(classes).concat(styles).forEach(function (name) {
	    var attr = _parchment2.default.query(name, _parchment2.default.Scope.ATTRIBUTE);
	    if (attr != null) {
	      formats[attr.attrName] = attr.value(node);
	      if (formats[attr.attrName]) return;
	    }
	    if (ATTRIBUTE_ATTRIBUTORS[name] != null) {
	      attr = ATTRIBUTE_ATTRIBUTORS[name];
	      formats[attr.attrName] = attr.value(node) || undefined;
	    }
	    if (STYLE_ATTRIBUTORS[name] != null) {
	      attr = STYLE_ATTRIBUTORS[name];
	      formats[attr.attrName] = attr.value(node) || undefined;
	    }
	  });
	  if (Object.keys(formats).length > 0) {
	    delta = delta.compose(new _quillDelta2.default().retain(delta.length(), formats));
	  }
	  return delta;
	}

	function matchBlot(node, delta) {
	  var match = _parchment2.default.query(node);
	  if (match == null) return delta;
	  if (match.prototype instanceof _parchment2.default.Embed) {
	    var embed = {};
	    var value = match.value(node);
	    if (value != null) {
	      embed[match.blotName] = value;
	      delta = new _quillDelta2.default().insert(embed, match.formats(node));
	    }
	  } else if (typeof match.formats === 'function') {
	    var formats = _defineProperty({}, match.blotName, match.formats(node));
	    delta = delta.compose(new _quillDelta2.default().retain(delta.length(), formats));
	  }
	  return delta;
	}

	function matchBreak(node, delta) {
	  if (!deltaEndsWith(delta, '\n')) {
	    delta.insert('\n');
	  }
	  return delta;
	}

	function matchIgnore() {
	  return new _quillDelta2.default();
	}

	function matchNewline(node, delta) {
	  if (isLine(node) && !deltaEndsWith(delta, '\n')) {
	    delta.insert('\n');
	  }
	  return delta;
	}

	function matchSpacing(node, delta) {
	  if (isLine(node) && node.nextElementSibling != null && !deltaEndsWith(delta, '\n\n')) {
	    var nodeHeight = node.offsetHeight + parseFloat(computeStyle(node).marginTop) + parseFloat(computeStyle(node).marginBottom);
	    if (node.nextElementSibling.offsetTop > node.offsetTop + nodeHeight * 1.5) {
	      delta.insert('\n');
	    }
	  }
	  return delta;
	}

	function matchStyles(node, delta) {
	  var formats = {};
	  var style = node.style || {};
	  if (style.fontStyle && computeStyle(node).fontStyle === 'italic') {
	    formats.italic = true;
	  }
	  if (style.fontWeight && computeStyle(node).fontWeight === 'bold') {
	    formats.bold = true;
	  }
	  if (Object.keys(formats).length > 0) {
	    delta = delta.compose(new _quillDelta2.default().retain(delta.length(), formats));
	  }
	  if (parseFloat(style.textIndent || 0) > 0) {
	    // Could be 0.5in
	    delta = new _quillDelta2.default().insert('\t').concat(delta);
	  }
	  return delta;
	}

	function matchText(node, delta) {
	  var text = node.data;
	  // Word represents empty line with <o:p>&nbsp;</o:p>
	  if (node.parentNode.tagName === 'O:P') {
	    return delta.insert(text.trim());
	  }
	  if (!computeStyle(node.parentNode).whiteSpace.startsWith('pre')) {
	    // eslint-disable-next-line func-style
	    var replacer = function replacer(collapse, match) {
	      match = match.replace(/[^\u00a0]/g, ''); // \u00a0 is nbsp;
	      return match.length < 1 && collapse ? ' ' : match;
	    };
	    text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
	    text = text.replace(/\s\s+/g, replacer.bind(replacer, true)); // collapse whitespace
	    if (node.previousSibling == null && isLine(node.parentNode) || node.previousSibling != null && isLine(node.previousSibling)) {
	      text = text.replace(/^\s+/, replacer.bind(replacer, false));
	    }
	    if (node.nextSibling == null && isLine(node.parentNode) || node.nextSibling != null && isLine(node.nextSibling)) {
	      text = text.replace(/\s+$/, replacer.bind(replacer, false));
	    }
	  }
	  return delta.insert(text);
	}

	exports.default = Clipboard;
	exports.matchAttributor = matchAttributor;
	exports.matchBlot = matchBlot;
	exports.matchNewline = matchNewline;
	exports.matchSpacing = matchSpacing;
	exports.matchText = matchText;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AlignStyle = exports.AlignClass = exports.AlignAttribute = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: ['right', 'center', 'justify']
	};

	var AlignAttribute = new _parchment2.default.Attributor.Attribute('align', 'align', config);
	var AlignClass = new _parchment2.default.Attributor.Class('align', 'ql-align', config);
	var AlignStyle = new _parchment2.default.Attributor.Style('align', 'text-align', config);

	exports.AlignAttribute = AlignAttribute;
	exports.AlignClass = AlignClass;
	exports.AlignStyle = AlignStyle;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.BackgroundStyle = exports.BackgroundClass = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _color = __webpack_require__(47);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BackgroundClass = new _parchment2.default.Attributor.Class('background', 'ql-bg', {
	  scope: _parchment2.default.Scope.INLINE
	});
	var BackgroundStyle = new _color.ColorAttributor('background', 'background-color', {
	  scope: _parchment2.default.Scope.INLINE
	});

	exports.BackgroundClass = BackgroundClass;
	exports.BackgroundStyle = BackgroundStyle;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ColorStyle = exports.ColorClass = exports.ColorAttributor = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ColorAttributor = function (_Parchment$Attributor) {
	  _inherits(ColorAttributor, _Parchment$Attributor);

	  function ColorAttributor() {
	    _classCallCheck(this, ColorAttributor);

	    return _possibleConstructorReturn(this, (ColorAttributor.__proto__ || Object.getPrototypeOf(ColorAttributor)).apply(this, arguments));
	  }

	  _createClass(ColorAttributor, [{
	    key: 'value',
	    value: function value(domNode) {
	      var value = _get(ColorAttributor.prototype.__proto__ || Object.getPrototypeOf(ColorAttributor.prototype), 'value', this).call(this, domNode);
	      if (!value.startsWith('rgb(')) return value;
	      value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
	      return '#' + value.split(',').map(function (component) {
	        return ('00' + parseInt(component).toString(16)).slice(-2);
	      }).join('');
	    }
	  }]);

	  return ColorAttributor;
	}(_parchment2.default.Attributor.Style);

	var ColorClass = new _parchment2.default.Attributor.Class('color', 'ql-color', {
	  scope: _parchment2.default.Scope.INLINE
	});
	var ColorStyle = new ColorAttributor('color', 'color', {
	  scope: _parchment2.default.Scope.INLINE
	});

	exports.ColorAttributor = ColorAttributor;
	exports.ColorClass = ColorClass;
	exports.ColorStyle = ColorStyle;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DirectionStyle = exports.DirectionClass = exports.DirectionAttribute = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: ['rtl']
	};

	var DirectionAttribute = new _parchment2.default.Attributor.Attribute('direction', 'dir', config);
	var DirectionClass = new _parchment2.default.Attributor.Class('direction', 'ql-direction', config);
	var DirectionStyle = new _parchment2.default.Attributor.Style('direction', 'direction', config);

	exports.DirectionAttribute = DirectionAttribute;
	exports.DirectionClass = DirectionClass;
	exports.DirectionStyle = DirectionStyle;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FontClass = exports.FontStyle = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var config = {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['serif', 'monospace']
	};

	var FontClass = new _parchment2.default.Attributor.Class('font', 'ql-font', config);

	var FontStyleAttributor = function (_Parchment$Attributor) {
	  _inherits(FontStyleAttributor, _Parchment$Attributor);

	  function FontStyleAttributor() {
	    _classCallCheck(this, FontStyleAttributor);

	    return _possibleConstructorReturn(this, (FontStyleAttributor.__proto__ || Object.getPrototypeOf(FontStyleAttributor)).apply(this, arguments));
	  }

	  _createClass(FontStyleAttributor, [{
	    key: 'value',
	    value: function value(node) {
	      return _get(FontStyleAttributor.prototype.__proto__ || Object.getPrototypeOf(FontStyleAttributor.prototype), 'value', this).call(this, node).replace(/["']/g, '');
	    }
	  }]);

	  return FontStyleAttributor;
	}(_parchment2.default.Attributor.Style);

	var FontStyle = new FontStyleAttributor('font', 'font-family', config);

	exports.FontStyle = FontStyle;
	exports.FontClass = FontClass;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SizeStyle = exports.SizeClass = undefined;

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SizeClass = new _parchment2.default.Attributor.Class('size', 'ql-size', {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['small', 'large', 'huge']
	});
	var SizeStyle = new _parchment2.default.Attributor.Style('size', 'font-size', {
	  scope: _parchment2.default.Scope.INLINE,
	  whitelist: ['10px', '18px', '32px']
	});

	exports.SizeClass = SizeClass;
	exports.SizeStyle = SizeStyle;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getLastChangeIndex = exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var History = function (_Module) {
	  _inherits(History, _Module);

	  function History(quill, options) {
	    _classCallCheck(this, History);

	    var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, quill, options));

	    _this.lastRecorded = 0;
	    _this.ignoreChange = false;
	    _this.clear();
	    _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function (eventName, delta, oldDelta, source) {
	      if (eventName !== _quill2.default.events.TEXT_CHANGE || _this.ignoreChange) return;
	      if (!_this.options.userOnly || source === _quill2.default.sources.USER) {
	        _this.record(delta, oldDelta);
	      } else {
	        _this.transform(delta);
	      }
	    });
	    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true }, _this.undo.bind(_this));
	    _this.quill.keyboard.addBinding({ key: 'Z', shortKey: true, shiftKey: true }, _this.redo.bind(_this));
	    if (/Win/i.test(navigator.platform)) {
	      _this.quill.keyboard.addBinding({ key: 'Y', shortKey: true }, _this.redo.bind(_this));
	    }
	    return _this;
	  }

	  _createClass(History, [{
	    key: 'change',
	    value: function change(source, dest) {
	      if (this.stack[source].length === 0) return;
	      var delta = this.stack[source].pop();
	      this.lastRecorded = 0;
	      this.ignoreChange = true;
	      this.quill.updateContents(delta[source], _quill2.default.sources.USER);
	      this.ignoreChange = false;
	      var index = getLastChangeIndex(delta[source]);
	      this.quill.setSelection(index);
	      this.quill.selection.scrollIntoView();
	      this.stack[dest].push(delta);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.stack = { undo: [], redo: [] };
	    }
	  }, {
	    key: 'record',
	    value: function record(changeDelta, oldDelta) {
	      if (changeDelta.ops.length === 0) return;
	      this.stack.redo = [];
	      var undoDelta = this.quill.getContents().diff(oldDelta);
	      var timestamp = Date.now();
	      if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
	        var delta = this.stack.undo.pop();
	        undoDelta = undoDelta.compose(delta.undo);
	        changeDelta = delta.redo.compose(changeDelta);
	      } else {
	        this.lastRecorded = timestamp;
	      }
	      this.stack.undo.push({
	        redo: changeDelta,
	        undo: undoDelta
	      });
	      if (this.stack.undo.length > this.options.maxStack) {
	        this.stack.undo.shift();
	      }
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.change('redo', 'undo');
	    }
	  }, {
	    key: 'transform',
	    value: function transform(delta) {
	      this.stack.undo.forEach(function (change) {
	        change.undo = delta.transform(change.undo, true);
	        change.redo = delta.transform(change.redo, true);
	      });
	      this.stack.redo.forEach(function (change) {
	        change.undo = delta.transform(change.undo, true);
	        change.redo = delta.transform(change.redo, true);
	      });
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.change('undo', 'redo');
	    }
	  }]);

	  return History;
	}(_module2.default);

	History.DEFAULTS = {
	  delay: 1000,
	  maxStack: 100,
	  userOnly: false
	};

	function endsWithNewlineChange(delta) {
	  var lastOp = delta.ops[delta.ops.length - 1];
	  if (lastOp == null) return false;
	  if (lastOp.insert != null) {
	    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
	  }
	  if (lastOp.attributes != null) {
	    return Object.keys(lastOp.attributes).some(function (attr) {
	      return _parchment2.default.query(attr, _parchment2.default.Scope.BLOCK) != null;
	    });
	  }
	  return false;
	}

	function getLastChangeIndex(delta) {
	  var deleteLength = delta.reduce(function (length, op) {
	    length += op.delete || 0;
	    return length;
	  }, 0);
	  var changeIndex = delta.length() - deleteLength;
	  if (endsWithNewlineChange(delta)) {
	    changeIndex -= 1;
	  }
	  return changeIndex;
	}

	exports.default = History;
	exports.getLastChangeIndex = getLastChangeIndex;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _clone = __webpack_require__(38);

	var _clone2 = _interopRequireDefault(_clone);

	var _deepEqual = __webpack_require__(22);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	var _extend = __webpack_require__(25);

	var _extend2 = _interopRequireDefault(_extend);

	var _op = __webpack_require__(26);

	var _op2 = _interopRequireDefault(_op);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(37);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:keyboard');

	var SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

	var Keyboard = function (_Module) {
	  _inherits(Keyboard, _Module);

	  _createClass(Keyboard, null, [{
	    key: 'match',
	    value: function match(evt, binding) {
	      binding = normalize(binding);
	      if (!!binding.shortKey !== evt[SHORTKEY] && binding.shortKey !== null) return false;
	      if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function (key) {
	        return key != SHORTKEY && !!binding[key] !== evt[key] && binding[key] !== null;
	      })) {
	        return false;
	      }
	      return binding.key === (evt.which || evt.keyCode);
	    }
	  }]);

	  function Keyboard(quill, options) {
	    _classCallCheck(this, Keyboard);

	    var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, quill, options));

	    _this.bindings = {};
	    Object.keys(_this.options.bindings).forEach(function (name) {
	      if (_this.options.bindings[name]) {
	        _this.addBinding(_this.options.bindings[name]);
	      }
	    });
	    _this.addBinding({ key: Keyboard.keys.ENTER, shiftKey: null }, handleEnter);
	    _this.addBinding({ key: Keyboard.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function () {});
	    if (/Gecko/i.test(navigator.userAgent)) {
	      // Need to handle delete and backspace for Firefox in the general case #1171
	      _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true }, handleBackspace);
	      _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true }, handleDelete);
	    } else {
	      _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true, prefix: /^.?$/ }, handleBackspace);
	      _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true, suffix: /^.?$/ }, handleDelete);
	    }
	    _this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: false }, handleDeleteRange);
	    _this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: false }, handleDeleteRange);
	    _this.listen();
	    return _this;
	  }

	  _createClass(Keyboard, [{
	    key: 'addBinding',
	    value: function addBinding(key) {
	      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      var binding = normalize(key);
	      if (binding == null || binding.key == null) {
	        return debug.warn('Attempted to add invalid keyboard binding', binding);
	      }
	      if (typeof context === 'function') {
	        context = { handler: context };
	      }
	      if (typeof handler === 'function') {
	        handler = { handler: handler };
	      }
	      binding = (0, _extend2.default)(binding, context, handler);
	      this.bindings[binding.key] = this.bindings[binding.key] || [];
	      this.bindings[binding.key].push(binding);
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      var _this2 = this;

	      this.quill.root.addEventListener('keydown', function (evt) {
	        if (evt.defaultPrevented) return;
	        var which = evt.which || evt.keyCode;
	        var bindings = (_this2.bindings[which] || []).filter(function (binding) {
	          return Keyboard.match(evt, binding);
	        });
	        if (bindings.length === 0) return;
	        var range = _this2.quill.getSelection();
	        if (range == null || !_this2.quill.hasFocus()) return;

	        var _quill$scroll$line = _this2.quill.scroll.line(range.index),
	            _quill$scroll$line2 = _slicedToArray(_quill$scroll$line, 2),
	            line = _quill$scroll$line2[0],
	            offset = _quill$scroll$line2[1];

	        var _quill$scroll$leaf = _this2.quill.scroll.leaf(range.index),
	            _quill$scroll$leaf2 = _slicedToArray(_quill$scroll$leaf, 2),
	            leafStart = _quill$scroll$leaf2[0],
	            offsetStart = _quill$scroll$leaf2[1];

	        var _ref = range.length === 0 ? [leafStart, offsetStart] : _this2.quill.scroll.leaf(range.index + range.length),
	            _ref2 = _slicedToArray(_ref, 2),
	            leafEnd = _ref2[0],
	            offsetEnd = _ref2[1];

	        var prefixText = leafStart instanceof _parchment2.default.Text ? leafStart.value().slice(0, offsetStart) : '';
	        var suffixText = leafEnd instanceof _parchment2.default.Text ? leafEnd.value().slice(offsetEnd) : '';
	        var curContext = {
	          collapsed: range.length === 0,
	          empty: range.length === 0 && line.length() <= 1,
	          format: _this2.quill.getFormat(range),
	          offset: offset,
	          prefix: prefixText,
	          suffix: suffixText
	        };
	        var prevented = bindings.some(function (binding) {
	          if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) return false;
	          if (binding.empty != null && binding.empty !== curContext.empty) return false;
	          if (binding.offset != null && binding.offset !== curContext.offset) return false;
	          if (Array.isArray(binding.format)) {
	            // any format is present
	            if (binding.format.every(function (name) {
	              return curContext.format[name] == null;
	            })) {
	              return false;
	            }
	          } else if (_typeof(binding.format) === 'object') {
	            // all formats must match
	            if (!Object.keys(binding.format).every(function (name) {
	              if (binding.format[name] === true) return curContext.format[name] != null;
	              if (binding.format[name] === false) return curContext.format[name] == null;
	              return (0, _deepEqual2.default)(binding.format[name], curContext.format[name]);
	            })) {
	              return false;
	            }
	          }
	          if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) return false;
	          if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) return false;
	          return binding.handler.call(_this2, range, curContext) !== true;
	        });
	        if (prevented) {
	          evt.preventDefault();
	        }
	      });
	    }
	  }]);

	  return Keyboard;
	}(_module2.default);

	Keyboard.keys = {
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  ESCAPE: 27,
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  DELETE: 46
	};

	Keyboard.DEFAULTS = {
	  bindings: {
	    'bold': makeFormatHandler('bold'),
	    'italic': makeFormatHandler('italic'),
	    'underline': makeFormatHandler('underline'),
	    'indent': {
	      // highlight tab or tab at beginning of list, indent or blockquote
	      key: Keyboard.keys.TAB,
	      format: ['blockquote', 'indent', 'list'],
	      handler: function handler(range, context) {
	        if (context.collapsed && context.offset !== 0) return true;
	        this.quill.format('indent', '+1', _quill2.default.sources.USER);
	      }
	    },
	    'outdent': {
	      key: Keyboard.keys.TAB,
	      shiftKey: true,
	      format: ['blockquote', 'indent', 'list'],
	      // highlight tab or tab at beginning of list, indent or blockquote
	      handler: function handler(range, context) {
	        if (context.collapsed && context.offset !== 0) return true;
	        this.quill.format('indent', '-1', _quill2.default.sources.USER);
	      }
	    },
	    'outdent backspace': {
	      key: Keyboard.keys.BACKSPACE,
	      collapsed: true,
	      format: ['blockquote', 'indent', 'list'],
	      offset: 0,
	      handler: function handler(range, context) {
	        if (context.format.indent != null) {
	          this.quill.format('indent', '-1', _quill2.default.sources.USER);
	        } else if (context.format.blockquote != null) {
	          this.quill.format('blockquote', false, _quill2.default.sources.USER);
	        } else if (context.format.list != null) {
	          this.quill.format('list', false, _quill2.default.sources.USER);
	        }
	      }
	    },
	    'indent code-block': makeCodeBlockHandler(true),
	    'outdent code-block': makeCodeBlockHandler(false),
	    'remove tab': {
	      key: Keyboard.keys.TAB,
	      shiftKey: true,
	      collapsed: true,
	      prefix: /\t$/,
	      handler: function handler(range) {
	        this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
	      }
	    },
	    'tab': {
	      key: Keyboard.keys.TAB,
	      handler: function handler(range, context) {
	        if (!context.collapsed) {
	          this.quill.scroll.deleteAt(range.index, range.length);
	        }
	        this.quill.insertText(range.index, '\t', _quill2.default.sources.USER);
	        this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
	      }
	    },
	    'list empty enter': {
	      key: Keyboard.keys.ENTER,
	      collapsed: true,
	      format: ['list'],
	      empty: true,
	      handler: function handler(range, context) {
	        this.quill.format('list', false, _quill2.default.sources.USER);
	        if (context.format.indent) {
	          this.quill.format('indent', false, _quill2.default.sources.USER);
	        }
	      }
	    },
	    'checklist enter': {
	      key: Keyboard.keys.ENTER,
	      collapsed: true,
	      format: { list: 'checked' },
	      handler: function handler(range) {
	        this.quill.scroll.insertAt(range.index, '\n');

	        var _quill$scroll$line3 = this.quill.scroll.line(range.index + 1),
	            _quill$scroll$line4 = _slicedToArray(_quill$scroll$line3, 1),
	            line = _quill$scroll$line4[0];

	        line.format('list', 'unchecked');
	        this.quill.update(_quill2.default.sources.USER);
	        this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
	        this.quill.selection.scrollIntoView();
	      }
	    },
	    'header enter': {
	      key: Keyboard.keys.ENTER,
	      collapsed: true,
	      format: ['header'],
	      suffix: /^$/,
	      handler: function handler(range) {
	        this.quill.scroll.insertAt(range.index, '\n');
	        this.quill.formatText(range.index + 1, 1, 'header', false, _quill2.default.sources.USER);
	        this.quill.setSelection(range.index + 1, _quill2.default.sources.SILENT);
	        this.quill.selection.scrollIntoView();
	      }
	    },
	    'list autofill': {
	      key: ' ',
	      collapsed: true,
	      format: { list: false },
	      prefix: /^(1\.|-)$/,
	      handler: function handler(range, context) {
	        var length = context.prefix.length;
	        this.quill.scroll.deleteAt(range.index - length, length);
	        this.quill.formatLine(range.index - length, 1, 'list', length === 1 ? 'bullet' : 'ordered', _quill2.default.sources.USER);
	        this.quill.setSelection(range.index - length, _quill2.default.sources.SILENT);
	      }
	    }
	  }
	};

	function handleBackspace(range, context) {
	  if (range.index === 0) return;

	  var _quill$scroll$line5 = this.quill.scroll.line(range.index),
	      _quill$scroll$line6 = _slicedToArray(_quill$scroll$line5, 1),
	      line = _quill$scroll$line6[0];

	  var formats = {};
	  if (context.offset === 0) {
	    var curFormats = line.formats();
	    var prevFormats = this.quill.getFormat(range.index - 1, 1);
	    formats = _op2.default.attributes.diff(curFormats, prevFormats) || {};
	  }
	  this.quill.deleteText(range.index - 1, 1, _quill2.default.sources.USER);
	  if (Object.keys(formats).length > 0) {
	    this.quill.formatLine(range.index - 1, 1, formats, _quill2.default.sources.USER);
	  }
	  this.quill.selection.scrollIntoView();
	}

	function handleDelete(range) {
	  if (range.index >= this.quill.getLength() - 1) return;
	  this.quill.deleteText(range.index, 1, _quill2.default.sources.USER);
	}

	function handleDeleteRange(range) {
	  this.quill.deleteText(range, _quill2.default.sources.USER);
	  this.quill.setSelection(range.index, _quill2.default.sources.SILENT);
	  this.quill.selection.scrollIntoView();
	}

	function handleEnter(range, context) {
	  var _this3 = this;

	  if (range.length > 0) {
	    this.quill.scroll.deleteAt(range.index, range.length); // So we do not trigger text-change
	  }
	  var lineFormats = Object.keys(context.format).reduce(function (lineFormats, format) {
	    if (_parchment2.default.query(format, _parchment2.default.Scope.BLOCK) && !Array.isArray(context.format[format])) {
	      lineFormats[format] = context.format[format];
	    }
	    return lineFormats;
	  }, {});
	  this.quill.insertText(range.index, '\n', lineFormats, _quill2.default.sources.USER);
	  this.quill.selection.scrollIntoView();
	  Object.keys(context.format).forEach(function (name) {
	    if (lineFormats[name] != null) return;
	    if (Array.isArray(context.format[name])) return;
	    if (name === 'link') return;
	    _this3.quill.format(name, context.format[name], _quill2.default.sources.USER);
	  });
	}

	function makeCodeBlockHandler(indent) {
	  return {
	    key: Keyboard.keys.TAB,
	    shiftKey: !indent,
	    format: { 'code-block': true },
	    handler: function handler(range) {
	      var CodeBlock = _parchment2.default.query('code-block');
	      var index = range.index,
	          length = range.length;

	      var _quill$scroll$descend = this.quill.scroll.descendant(CodeBlock, index),
	          _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2),
	          block = _quill$scroll$descend2[0],
	          offset = _quill$scroll$descend2[1];

	      if (block == null) return;
	      var scrollOffset = this.quill.scroll.offset(block);
	      var start = block.newlineIndex(offset, true) + 1;
	      var end = block.newlineIndex(scrollOffset + offset + length);
	      var lines = block.domNode.textContent.slice(start, end).split('\n');
	      offset = 0;
	      lines.forEach(function (line, i) {
	        if (indent) {
	          block.insertAt(start + offset, CodeBlock.TAB);
	          offset += CodeBlock.TAB.length;
	          if (i === 0) {
	            index += CodeBlock.TAB.length;
	          } else {
	            length += CodeBlock.TAB.length;
	          }
	        } else if (line.startsWith(CodeBlock.TAB)) {
	          block.deleteAt(start + offset, CodeBlock.TAB.length);
	          offset -= CodeBlock.TAB.length;
	          if (i === 0) {
	            index -= CodeBlock.TAB.length;
	          } else {
	            length -= CodeBlock.TAB.length;
	          }
	        }
	        offset += line.length + 1;
	      });
	      this.quill.update(_quill2.default.sources.USER);
	      this.quill.setSelection(index, length, _quill2.default.sources.SILENT);
	    }
	  };
	}

	function makeFormatHandler(format) {
	  return {
	    key: format[0].toUpperCase(),
	    shortKey: true,
	    handler: function handler(range, context) {
	      this.quill.format(format, !context.format[format], _quill2.default.sources.USER);
	    }
	  };
	}

	function normalize(binding) {
	  if (typeof binding === 'string' || typeof binding === 'number') {
	    return normalize({ key: binding });
	  }
	  if ((typeof binding === 'undefined' ? 'undefined' : _typeof(binding)) === 'object') {
	    binding = (0, _clone2.default)(binding, false);
	  }
	  if (typeof binding.key === 'string') {
	    if (Keyboard.keys[binding.key.toUpperCase()] != null) {
	      binding.key = Keyboard.keys[binding.key.toUpperCase()];
	    } else if (binding.key.length === 1) {
	      binding.key = binding.key.toUpperCase().charCodeAt(0);
	    } else {
	      return null;
	    }
	  }
	  return binding;
	}

	exports.default = Keyboard;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _align = __webpack_require__(45);

	var _direction = __webpack_require__(48);

	var _indent = __webpack_require__(54);

	var _blockquote = __webpack_require__(55);

	var _blockquote2 = _interopRequireDefault(_blockquote);

	var _header = __webpack_require__(56);

	var _header2 = _interopRequireDefault(_header);

	var _list = __webpack_require__(57);

	var _list2 = _interopRequireDefault(_list);

	var _background = __webpack_require__(46);

	var _color = __webpack_require__(47);

	var _font = __webpack_require__(49);

	var _size = __webpack_require__(50);

	var _bold = __webpack_require__(58);

	var _bold2 = _interopRequireDefault(_bold);

	var _italic = __webpack_require__(59);

	var _italic2 = _interopRequireDefault(_italic);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	var _script = __webpack_require__(61);

	var _script2 = _interopRequireDefault(_script);

	var _strike = __webpack_require__(62);

	var _strike2 = _interopRequireDefault(_strike);

	var _underline = __webpack_require__(63);

	var _underline2 = _interopRequireDefault(_underline);

	var _image = __webpack_require__(64);

	var _image2 = _interopRequireDefault(_image);

	var _video = __webpack_require__(65);

	var _video2 = _interopRequireDefault(_video);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	var _formula = __webpack_require__(66);

	var _formula2 = _interopRequireDefault(_formula);

	var _syntax = __webpack_require__(67);

	var _syntax2 = _interopRequireDefault(_syntax);

	var _toolbar = __webpack_require__(68);

	var _toolbar2 = _interopRequireDefault(_toolbar);

	var _icons = __webpack_require__(69);

	var _icons2 = _interopRequireDefault(_icons);

	var _picker = __webpack_require__(102);

	var _picker2 = _interopRequireDefault(_picker);

	var _colorPicker = __webpack_require__(104);

	var _colorPicker2 = _interopRequireDefault(_colorPicker);

	var _iconPicker = __webpack_require__(105);

	var _iconPicker2 = _interopRequireDefault(_iconPicker);

	var _tooltip = __webpack_require__(106);

	var _tooltip2 = _interopRequireDefault(_tooltip);

	var _bubble = __webpack_require__(107);

	var _bubble2 = _interopRequireDefault(_bubble);

	var _snow = __webpack_require__(109);

	var _snow2 = _interopRequireDefault(_snow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_core2.default.register({
	  'attributors/attribute/direction': _direction.DirectionAttribute,

	  'attributors/class/align': _align.AlignClass,
	  'attributors/class/background': _background.BackgroundClass,
	  'attributors/class/color': _color.ColorClass,
	  'attributors/class/direction': _direction.DirectionClass,
	  'attributors/class/font': _font.FontClass,
	  'attributors/class/size': _size.SizeClass,

	  'attributors/style/align': _align.AlignStyle,
	  'attributors/style/background': _background.BackgroundStyle,
	  'attributors/style/color': _color.ColorStyle,
	  'attributors/style/direction': _direction.DirectionStyle,
	  'attributors/style/font': _font.FontStyle,
	  'attributors/style/size': _size.SizeStyle
	}, true);

	_core2.default.register({
	  'formats/align': _align.AlignClass,
	  'formats/direction': _direction.DirectionClass,
	  'formats/indent': _indent.IndentClass,

	  'formats/background': _background.BackgroundStyle,
	  'formats/color': _color.ColorStyle,
	  'formats/font': _font.FontClass,
	  'formats/size': _size.SizeClass,

	  'formats/blockquote': _blockquote2.default,
	  'formats/code-block': _code2.default,
	  'formats/header': _header2.default,
	  'formats/list': _list2.default,

	  'formats/bold': _bold2.default,
	  'formats/code': _code.Code,
	  'formats/italic': _italic2.default,
	  'formats/link': _link2.default,
	  'formats/script': _script2.default,
	  'formats/strike': _strike2.default,
	  'formats/underline': _underline2.default,

	  'formats/image': _image2.default,
	  'formats/video': _video2.default,

	  'formats/list/item': _list.ListItem,

	  'modules/formula': _formula2.default,
	  'modules/syntax': _syntax2.default,
	  'modules/toolbar': _toolbar2.default,

	  'themes/bubble': _bubble2.default,
	  'themes/snow': _snow2.default,

	  'ui/icons': _icons2.default,
	  'ui/picker': _picker2.default,
	  'ui/icon-picker': _iconPicker2.default,
	  'ui/color-picker': _colorPicker2.default,
	  'ui/tooltip': _tooltip2.default
	}, true);

	module.exports = _core2.default;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.IndentClass = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var IdentAttributor = function (_Parchment$Attributor) {
	  _inherits(IdentAttributor, _Parchment$Attributor);

	  function IdentAttributor() {
	    _classCallCheck(this, IdentAttributor);

	    return _possibleConstructorReturn(this, (IdentAttributor.__proto__ || Object.getPrototypeOf(IdentAttributor)).apply(this, arguments));
	  }

	  _createClass(IdentAttributor, [{
	    key: 'add',
	    value: function add(node, value) {
	      if (value === '+1' || value === '-1') {
	        var indent = this.value(node) || 0;
	        value = value === '+1' ? indent + 1 : indent - 1;
	      }
	      if (value === 0) {
	        this.remove(node);
	        return true;
	      } else {
	        return _get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'add', this).call(this, node, value);
	      }
	    }
	  }, {
	    key: 'canAdd',
	    value: function canAdd(node, value) {
	      return _get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'canAdd', this).call(this, node, value) || _get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'canAdd', this).call(this, node, parseInt(value));
	    }
	  }, {
	    key: 'value',
	    value: function value(node) {
	      return parseInt(_get(IdentAttributor.prototype.__proto__ || Object.getPrototypeOf(IdentAttributor.prototype), 'value', this).call(this, node)) || undefined; // Don't return NaN
	    }
	  }]);

	  return IdentAttributor;
	}(_parchment2.default.Attributor.Class);

	var IndentClass = new IdentAttributor('indent', 'ql-indent', {
	  scope: _parchment2.default.Scope.BLOCK,
	  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
	});

	exports.IndentClass = IndentClass;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Blockquote = function (_Block) {
	  _inherits(Blockquote, _Block);

	  function Blockquote() {
	    _classCallCheck(this, Blockquote);

	    return _possibleConstructorReturn(this, (Blockquote.__proto__ || Object.getPrototypeOf(Blockquote)).apply(this, arguments));
	  }

	  return Blockquote;
	}(_block2.default);

	Blockquote.blotName = 'blockquote';
	Blockquote.tagName = 'blockquote';

	exports.default = Blockquote;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Header = function (_Block) {
	  _inherits(Header, _Block);

	  function Header() {
	    _classCallCheck(this, Header);

	    return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
	  }

	  _createClass(Header, null, [{
	    key: 'formats',
	    value: function formats(domNode) {
	      return this.tagName.indexOf(domNode.tagName) + 1;
	    }
	  }]);

	  return Header;
	}(_block2.default);

	Header.blotName = 'header';
	Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

	exports.default = Header;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.ListItem = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _block = __webpack_require__(29);

	var _block2 = _interopRequireDefault(_block);

	var _container = __webpack_require__(42);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ListItem = function (_Block) {
	  _inherits(ListItem, _Block);

	  function ListItem() {
	    _classCallCheck(this, ListItem);

	    return _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).apply(this, arguments));
	  }

	  _createClass(ListItem, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (name === List.blotName && !value) {
	        this.replaceWith(_parchment2.default.create(this.statics.scope));
	      } else {
	        _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      if (this.prev == null && this.next == null) {
	        this.parent.remove();
	      } else {
	        _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'remove', this).call(this);
	      }
	    }
	  }, {
	    key: 'replaceWith',
	    value: function replaceWith(name, value) {
	      this.parent.isolate(this.offset(this.parent), this.length());
	      if (name === this.parent.statics.blotName) {
	        this.parent.replaceWith(name, value);
	        return this;
	      } else {
	        this.parent.unwrap();
	        return _get(ListItem.prototype.__proto__ || Object.getPrototypeOf(ListItem.prototype), 'replaceWith', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'formats',
	    value: function formats(domNode) {
	      return domNode.tagName === this.tagName ? undefined : _get(ListItem.__proto__ || Object.getPrototypeOf(ListItem), 'formats', this).call(this, domNode);
	    }
	  }]);

	  return ListItem;
	}(_block2.default);

	ListItem.blotName = 'list-item';
	ListItem.tagName = 'LI';

	var List = function (_Container) {
	  _inherits(List, _Container);

	  function List() {
	    _classCallCheck(this, List);

	    return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
	  }

	  _createClass(List, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (this.children.length > 0) {
	        this.children.tail.format(name, value);
	      }
	    }
	  }, {
	    key: 'formats',
	    value: function formats() {
	      // We don't inherit from FormatBlot
	      return _defineProperty({}, this.statics.blotName, this.statics.formats(this.domNode));
	    }
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(blot, ref) {
	      if (blot instanceof ListItem) {
	        _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'insertBefore', this).call(this, blot, ref);
	      } else {
	        var index = ref == null ? this.length() : ref.offset(this);
	        var after = this.split(index);
	        after.parent.insertBefore(blot, after);
	      }
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize() {
	      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'optimize', this).call(this);
	      var next = this.next;
	      if (next != null && next.prev === this && next.statics.blotName === this.statics.blotName && next.domNode.tagName === this.domNode.tagName && next.domNode.getAttribute('data-checked') === this.domNode.getAttribute('data-checked')) {
	        next.moveChildren(this);
	        next.remove();
	      }
	    }
	  }, {
	    key: 'replace',
	    value: function replace(target) {
	      if (target.statics.blotName !== this.statics.blotName) {
	        var item = _parchment2.default.create(this.statics.defaultChild);
	        target.moveChildren(item);
	        this.appendChild(item);
	      }
	      _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'replace', this).call(this, target);
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var tagName = value === 'ordered' ? 'OL' : 'UL';
	      var node = _get(List.__proto__ || Object.getPrototypeOf(List), 'create', this).call(this, tagName);
	      if (value === 'checked' || value === 'unchecked') {
	        node.setAttribute('data-checked', value === 'checked');
	      }
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      if (domNode.tagName === 'OL') return 'ordered';
	      if (domNode.tagName === 'UL') {
	        if (domNode.hasAttribute('data-checked')) {
	          return domNode.getAttribute('data-checked') === 'true' ? 'checked' : 'unchecked';
	        } else {
	          return 'bullet';
	        }
	      }
	      return undefined;
	    }
	  }]);

	  return List;
	}(_container2.default);

	List.blotName = 'list';
	List.scope = _parchment2.default.Scope.BLOCK_BLOT;
	List.tagName = ['OL', 'UL'];
	List.defaultChild = 'list-item';
	List.allowedChildren = [ListItem];

	exports.ListItem = ListItem;
	exports.default = List;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Bold = function (_Inline) {
	  _inherits(Bold, _Inline);

	  function Bold() {
	    _classCallCheck(this, Bold);

	    return _possibleConstructorReturn(this, (Bold.__proto__ || Object.getPrototypeOf(Bold)).apply(this, arguments));
	  }

	  _createClass(Bold, [{
	    key: 'optimize',
	    value: function optimize() {
	      _get(Bold.prototype.__proto__ || Object.getPrototypeOf(Bold.prototype), 'optimize', this).call(this);
	      if (this.domNode.tagName !== this.statics.tagName[0]) {
	        this.replaceWith(this.statics.blotName);
	      }
	    }
	  }], [{
	    key: 'create',
	    value: function create() {
	      return _get(Bold.__proto__ || Object.getPrototypeOf(Bold), 'create', this).call(this);
	    }
	  }, {
	    key: 'formats',
	    value: function formats() {
	      return true;
	    }
	  }]);

	  return Bold;
	}(_inline2.default);

	Bold.blotName = 'bold';
	Bold.tagName = ['STRONG', 'B'];

	exports.default = Bold;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bold = __webpack_require__(58);

	var _bold2 = _interopRequireDefault(_bold);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Italic = function (_Bold) {
	  _inherits(Italic, _Bold);

	  function Italic() {
	    _classCallCheck(this, Italic);

	    return _possibleConstructorReturn(this, (Italic.__proto__ || Object.getPrototypeOf(Italic)).apply(this, arguments));
	  }

	  return Italic;
	}(_bold2.default);

	Italic.blotName = 'italic';
	Italic.tagName = ['EM', 'I'];

	exports.default = Italic;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sanitize = exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Link = function (_Inline) {
	  _inherits(Link, _Inline);

	  function Link() {
	    _classCallCheck(this, Link);

	    return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
	  }

	  _createClass(Link, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (name !== this.statics.blotName || !value) return _get(Link.prototype.__proto__ || Object.getPrototypeOf(Link.prototype), 'format', this).call(this, name, value);
	      value = this.constructor.sanitize(value);
	      this.domNode.setAttribute('href', value);
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Link.__proto__ || Object.getPrototypeOf(Link), 'create', this).call(this, value);
	      value = this.sanitize(value);
	      node.setAttribute('href', value);
	      node.setAttribute('target', '_blank');
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return domNode.getAttribute('href');
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return _sanitize(url, ['http', 'https', 'mailto']) ? url : this.SANITIZED_URL;
	    }
	  }]);

	  return Link;
	}(_inline2.default);

	Link.blotName = 'link';
	Link.tagName = 'A';
	Link.SANITIZED_URL = 'about:blank';

	function _sanitize(url, protocols) {
	  var anchor = document.createElement('a');
	  anchor.href = url;
	  var protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
	  return protocols.indexOf(protocol) > -1;
	}

	exports.default = Link;
	exports.sanitize = _sanitize;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Script = function (_Inline) {
	  _inherits(Script, _Inline);

	  function Script() {
	    _classCallCheck(this, Script);

	    return _possibleConstructorReturn(this, (Script.__proto__ || Object.getPrototypeOf(Script)).apply(this, arguments));
	  }

	  _createClass(Script, null, [{
	    key: 'create',
	    value: function create(value) {
	      if (value === 'super') {
	        return document.createElement('sup');
	      } else if (value === 'sub') {
	        return document.createElement('sub');
	      } else {
	        return _get(Script.__proto__ || Object.getPrototypeOf(Script), 'create', this).call(this, value);
	      }
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      if (domNode.tagName === 'SUB') return 'sub';
	      if (domNode.tagName === 'SUP') return 'super';
	      return undefined;
	    }
	  }]);

	  return Script;
	}(_inline2.default);

	Script.blotName = 'script';
	Script.tagName = ['SUB', 'SUP'];

	exports.default = Script;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Strike = function (_Inline) {
	  _inherits(Strike, _Inline);

	  function Strike() {
	    _classCallCheck(this, Strike);

	    return _possibleConstructorReturn(this, (Strike.__proto__ || Object.getPrototypeOf(Strike)).apply(this, arguments));
	  }

	  return Strike;
	}(_inline2.default);

	Strike.blotName = 'strike';
	Strike.tagName = 'S';

	exports.default = Strike;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _inline = __webpack_require__(32);

	var _inline2 = _interopRequireDefault(_inline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Underline = function (_Inline) {
	  _inherits(Underline, _Inline);

	  function Underline() {
	    _classCallCheck(this, Underline);

	    return _possibleConstructorReturn(this, (Underline.__proto__ || Object.getPrototypeOf(Underline)).apply(this, arguments));
	  }

	  return Underline;
	}(_inline2.default);

	Underline.blotName = 'underline';
	Underline.tagName = 'U';

	exports.default = Underline;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(31);

	var _embed2 = _interopRequireDefault(_embed);

	var _link = __webpack_require__(60);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ATTRIBUTES = ['alt', 'height', 'width'];

	var Image = function (_Embed) {
	  _inherits(Image, _Embed);

	  function Image() {
	    _classCallCheck(this, Image);

	    return _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).apply(this, arguments));
	  }

	  _createClass(Image, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (ATTRIBUTES.indexOf(name) > -1) {
	        if (value) {
	          this.domNode.setAttribute(name, value);
	        } else {
	          this.domNode.removeAttribute(name);
	        }
	      } else {
	        _get(Image.prototype.__proto__ || Object.getPrototypeOf(Image.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Image.__proto__ || Object.getPrototypeOf(Image), 'create', this).call(this, value);
	      if (typeof value === 'string') {
	        node.setAttribute('src', this.sanitize(value));
	      }
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return ATTRIBUTES.reduce(function (formats, attribute) {
	        if (domNode.hasAttribute(attribute)) {
	          formats[attribute] = domNode.getAttribute(attribute);
	        }
	        return formats;
	      }, {});
	    }
	  }, {
	    key: 'match',
	    value: function match(url) {
	      return (/\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url)
	      );
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return (0, _link.sanitize)(url, ['http', 'https', 'data']) ? url : '//:0';
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('src');
	    }
	  }]);

	  return Image;
	}(_embed2.default);

	Image.blotName = 'image';
	Image.tagName = 'IMG';

	exports.default = Image;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _block = __webpack_require__(29);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ATTRIBUTES = ['height', 'width'];

	var Video = function (_BlockEmbed) {
	  _inherits(Video, _BlockEmbed);

	  function Video() {
	    _classCallCheck(this, Video);

	    return _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).apply(this, arguments));
	  }

	  _createClass(Video, [{
	    key: 'format',
	    value: function format(name, value) {
	      if (ATTRIBUTES.indexOf(name) > -1) {
	        if (value) {
	          this.domNode.setAttribute(name, value);
	        } else {
	          this.domNode.removeAttribute(name);
	        }
	      } else {
	        _get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), 'format', this).call(this, name, value);
	      }
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(Video.__proto__ || Object.getPrototypeOf(Video), 'create', this).call(this, value);
	      node.setAttribute('frameborder', '0');
	      node.setAttribute('allowfullscreen', true);
	      node.setAttribute('src', this.sanitize(value));
	      return node;
	    }
	  }, {
	    key: 'formats',
	    value: function formats(domNode) {
	      return ATTRIBUTES.reduce(function (formats, attribute) {
	        if (domNode.hasAttribute(attribute)) {
	          formats[attribute] = domNode.getAttribute(attribute);
	        }
	        return formats;
	      }, {});
	    }
	  }, {
	    key: 'sanitize',
	    value: function sanitize(url) {
	      return _link2.default.sanitize(url);
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('src');
	    }
	  }]);

	  return Video;
	}(_block.BlockEmbed);

	Video.blotName = 'video';
	Video.className = 'ql-video';
	Video.tagName = 'IFRAME';

	exports.default = Video;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.FormulaBlot = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _embed = __webpack_require__(31);

	var _embed2 = _interopRequireDefault(_embed);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FormulaBlot = function (_Embed) {
	  _inherits(FormulaBlot, _Embed);

	  function FormulaBlot() {
	    _classCallCheck(this, FormulaBlot);

	    return _possibleConstructorReturn(this, (FormulaBlot.__proto__ || Object.getPrototypeOf(FormulaBlot)).apply(this, arguments));
	  }

	  _createClass(FormulaBlot, [{
	    key: 'index',
	    value: function index() {
	      return 1;
	    }
	  }], [{
	    key: 'create',
	    value: function create(value) {
	      var node = _get(FormulaBlot.__proto__ || Object.getPrototypeOf(FormulaBlot), 'create', this).call(this, value);
	      if (typeof value === 'string') {
	        window.katex.render(value, node);
	        node.setAttribute('data-value', value);
	      }
	      node.setAttribute('contenteditable', false);
	      return node;
	    }
	  }, {
	    key: 'value',
	    value: function value(domNode) {
	      return domNode.getAttribute('data-value');
	    }
	  }]);

	  return FormulaBlot;
	}(_embed2.default);

	FormulaBlot.blotName = 'formula';
	FormulaBlot.className = 'ql-formula';
	FormulaBlot.tagName = 'SPAN';

	function Formula() {
	  if (window.katex == null) {
	    throw new Error('Formula module requires KaTeX.');
	  }
	  _quill2.default.register(FormulaBlot, true);
	}

	exports.FormulaBlot = FormulaBlot;
	exports.default = Formula;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.CodeToken = exports.CodeBlock = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	var _code = __webpack_require__(28);

	var _code2 = _interopRequireDefault(_code);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SyntaxCodeBlock = function (_CodeBlock) {
	  _inherits(SyntaxCodeBlock, _CodeBlock);

	  function SyntaxCodeBlock() {
	    _classCallCheck(this, SyntaxCodeBlock);

	    return _possibleConstructorReturn(this, (SyntaxCodeBlock.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock)).apply(this, arguments));
	  }

	  _createClass(SyntaxCodeBlock, [{
	    key: 'replaceWith',
	    value: function replaceWith(block) {
	      this.domNode.textContent = this.domNode.textContent;
	      this.attach();
	      _get(SyntaxCodeBlock.prototype.__proto__ || Object.getPrototypeOf(SyntaxCodeBlock.prototype), 'replaceWith', this).call(this, block);
	    }
	  }, {
	    key: 'highlight',
	    value: function highlight(_highlight) {
	      if (this.cachedHTML !== this.domNode.innerHTML) {
	        var text = this.domNode.textContent;
	        if (text.trim().length > 0 || this.cachedHTML == null) {
	          this.domNode.innerHTML = _highlight(text);
	          this.attach();
	        }
	        this.cachedHTML = this.domNode.innerHTML;
	      }
	    }
	  }]);

	  return SyntaxCodeBlock;
	}(_code2.default);

	SyntaxCodeBlock.className = 'ql-syntax';

	var CodeToken = new _parchment2.default.Attributor.Class('token', 'hljs', {
	  scope: _parchment2.default.Scope.INLINE
	});

	var Syntax = function (_Module) {
	  _inherits(Syntax, _Module);

	  function Syntax(quill, options) {
	    _classCallCheck(this, Syntax);

	    var _this2 = _possibleConstructorReturn(this, (Syntax.__proto__ || Object.getPrototypeOf(Syntax)).call(this, quill, options));

	    if (typeof _this2.options.highlight !== 'function') {
	      throw new Error('Syntax module requires highlight.js. Please include the library on the page before Quill.');
	    }
	    _quill2.default.register(CodeToken, true);
	    _quill2.default.register(SyntaxCodeBlock, true);
	    var timer = null;
	    _this2.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
	      if (timer != null) return;
	      timer = setTimeout(function () {
	        _this2.highlight();
	        timer = null;
	      }, 100);
	    });
	    _this2.highlight();
	    return _this2;
	  }

	  _createClass(Syntax, [{
	    key: 'highlight',
	    value: function highlight() {
	      var _this3 = this;

	      if (this.quill.selection.composing) return;
	      var range = this.quill.getSelection();
	      this.quill.scroll.descendants(SyntaxCodeBlock).forEach(function (code) {
	        code.highlight(_this3.options.highlight);
	      });
	      this.quill.update(_quill2.default.sources.SILENT);
	      if (range != null) {
	        this.quill.setSelection(range, _quill2.default.sources.SILENT);
	      }
	    }
	  }]);

	  return Syntax;
	}(_module2.default);

	Syntax.DEFAULTS = {
	  highlight: function () {
	    if (window.hljs == null) return null;
	    return function (text) {
	      var result = window.hljs.highlightAuto(text);
	      return result.value;
	    };
	  }()
	};

	exports.CodeBlock = SyntaxCodeBlock;
	exports.CodeToken = CodeToken;
	exports.default = Syntax;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.addControls = exports.default = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _parchment = __webpack_require__(2);

	var _parchment2 = _interopRequireDefault(_parchment);

	var _quill = __webpack_require__(18);

	var _quill2 = _interopRequireDefault(_quill);

	var _logger = __webpack_require__(37);

	var _logger2 = _interopRequireDefault(_logger);

	var _module = __webpack_require__(39);

	var _module2 = _interopRequireDefault(_module);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var debug = (0, _logger2.default)('quill:toolbar');

	var Toolbar = function (_Module) {
	  _inherits(Toolbar, _Module);

	  function Toolbar(quill, options) {
	    _classCallCheck(this, Toolbar);

	    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, quill, options));

	    if (Array.isArray(_this.options.container)) {
	      var container = document.createElement('div');
	      addControls(container, _this.options.container);
	      quill.container.parentNode.insertBefore(container, quill.container);
	      _this.container = container;
	    } else if (typeof _this.options.container === 'string') {
	      _this.container = document.querySelector(_this.options.container);
	    } else {
	      _this.container = _this.options.container;
	    }
	    if (!(_this.container instanceof HTMLElement)) {
	      var _ret;

	      return _ret = debug.error('Container required for toolbar', _this.options), _possibleConstructorReturn(_this, _ret);
	    }
	    _this.container.classList.add('ql-toolbar');
	    _this.controls = [];
	    _this.handlers = {};
	    Object.keys(_this.options.handlers).forEach(function (format) {
	      _this.addHandler(format, _this.options.handlers[format]);
	    });
	    [].forEach.call(_this.container.querySelectorAll('button, select'), function (input) {
	      _this.attach(input);
	    });
	    _this.quill.on(_quill2.default.events.EDITOR_CHANGE, function (type, range) {
	      if (type === _quill2.default.events.SELECTION_CHANGE) {
	        _this.update(range);
	      }
	    });
	    _this.quill.on(_quill2.default.events.SCROLL_OPTIMIZE, function () {
	      var _this$quill$selection = _this.quill.selection.getRange(),
	          _this$quill$selection2 = _slicedToArray(_this$quill$selection, 1),
	          range = _this$quill$selection2[0]; // quill.getSelection triggers update


	      _this.update(range);
	    });
	    return _this;
	  }

	  _createClass(Toolbar, [{
	    key: 'addHandler',
	    value: function addHandler(format, handler) {
	      this.handlers[format] = handler;
	    }
	  }, {
	    key: 'attach',
	    value: function attach(input) {
	      var _this2 = this;

	      var format = [].find.call(input.classList, function (className) {
	        return className.indexOf('ql-') === 0;
	      });
	      if (!format) return;
	      format = format.slice('ql-'.length);
	      if (input.tagName === 'BUTTON') {
	        input.setAttribute('type', 'button');
	      }
	      if (this.handlers[format] == null) {
	        if (this.quill.scroll.whitelist != null && this.quill.scroll.whitelist[format] == null) {
	          debug.warn('ignoring attaching to disabled format', format, input);
	          return;
	        }
	        if (_parchment2.default.query(format) == null) {
	          debug.warn('ignoring attaching to nonexistent format', format, input);
	          return;
	        }
	      }
	      var eventName = input.tagName === 'SELECT' ? 'change' : 'click';
	      input.addEventListener(eventName, function (e) {
	        var value = void 0;
	        if (input.tagName === 'SELECT') {
	          if (input.selectedIndex < 0) return;
	          var selected = input.options[input.selectedIndex];
	          if (selected.hasAttribute('selected')) {
	            value = false;
	          } else {
	            value = selected.value || false;
	          }
	        } else {
	          if (input.classList.contains('ql-active')) {
	            value = false;
	          } else {
	            value = input.value || !input.hasAttribute('value');
	          }
	          e.preventDefault();
	        }
	        _this2.quill.focus();

	        var _quill$selection$getR = _this2.quill.selection.getRange(),
	            _quill$selection$getR2 = _slicedToArray(_quill$selection$getR, 1),
	            range = _quill$selection$getR2[0];

	        if (_this2.handlers[format] != null) {
	          _this2.handlers[format].call(_this2, value);
	        } else if (_parchment2.default.query(format).prototype instanceof _parchment2.default.Embed) {
	          value = prompt('Enter ' + format);
	          if (!value) return;
	          _this2.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert(_defineProperty({}, format, value)), _quill2.default.sources.USER);
	        } else {
	          _this2.quill.format(format, value, _quill2.default.sources.USER);
	        }
	        _this2.update(range);
	      });
	      // TODO use weakmap
	      this.controls.push([format, input]);
	    }
	  }, {
	    key: 'update',
	    value: function update(range) {
	      var formats = range == null ? {} : this.quill.getFormat(range);
	      this.controls.forEach(function (pair) {
	        var _pair = _slicedToArray(pair, 2),
	            format = _pair[0],
	            input = _pair[1];

	        if (input.tagName === 'SELECT') {
	          var option = void 0;
	          if (range == null) {
	            option = null;
	          } else if (formats[format] == null) {
	            option = input.querySelector('option[selected]');
	          } else if (!Array.isArray(formats[format])) {
	            var value = formats[format];
	            if (typeof value === 'string') {
	              value = value.replace(/\"/g, '\\"');
	            }
	            option = input.querySelector('option[value="' + value + '"]');
	          }
	          if (option == null) {
	            input.value = ''; // TODO make configurable?
	            input.selectedIndex = -1;
	          } else {
	            option.selected = true;
	          }
	        } else {
	          if (range == null) {
	            input.classList.remove('ql-active');
	          } else if (input.hasAttribute('value')) {
	            // both being null should match (default values)
	            // '1' should match with 1 (headers)
	            var isActive = formats[format] === input.getAttribute('value') || formats[format] != null && formats[format].toString() === input.getAttribute('value') || formats[format] == null && !input.getAttribute('value');
	            input.classList.toggle('ql-active', isActive);
	          } else {
	            input.classList.toggle('ql-active', formats[format] != null);
	          }
	        }
	      });
	    }
	  }]);

	  return Toolbar;
	}(_module2.default);

	Toolbar.DEFAULTS = {};

	function addButton(container, format, value) {
	  var input = document.createElement('button');
	  input.setAttribute('type', 'button');
	  input.classList.add('ql-' + format);
	  if (value != null) {
	    input.value = value;
	  }
	  container.appendChild(input);
	}

	function addControls(container, groups) {
	  if (!Array.isArray(groups[0])) {
	    groups = [groups];
	  }
	  groups.forEach(function (controls) {
	    var group = document.createElement('span');
	    group.classList.add('ql-formats');
	    controls.forEach(function (control) {
	      if (typeof control === 'string') {
	        addButton(group, control);
	      } else {
	        var format = Object.keys(control)[0];
	        var value = control[format];
	        if (Array.isArray(value)) {
	          addSelect(group, format, value);
	        } else {
	          addButton(group, format, value);
	        }
	      }
	    });
	    container.appendChild(group);
	  });
	}

	function addSelect(container, format, values) {
	  var input = document.createElement('select');
	  input.classList.add('ql-' + format);
	  values.forEach(function (value) {
	    var option = document.createElement('option');
	    if (value !== false) {
	      option.setAttribute('value', value);
	    } else {
	      option.setAttribute('selected', 'selected');
	    }
	    input.appendChild(option);
	  });
	  container.appendChild(input);
	}

	Toolbar.DEFAULTS = {
	  container: null,
	  handlers: {
	    clean: function clean() {
	      var _this3 = this;

	      var range = this.quill.getSelection();
	      if (range == null) return;
	      if (range.length == 0) {
	        var formats = this.quill.getFormat();
	        Object.keys(formats).forEach(function (name) {
	          // Clean functionality in existing apps only clean inline formats
	          if (_parchment2.default.query(name, _parchment2.default.Scope.INLINE) != null) {
	            _this3.quill.format(name, false);
	          }
	        });
	      } else {
	        this.quill.removeFormat(range, _quill2.default.sources.USER);
	      }
	    },
	    direction: function direction(value) {
	      var align = this.quill.getFormat()['align'];
	      if (value === 'rtl' && align == null) {
	        this.quill.format('align', 'right', _quill2.default.sources.USER);
	      } else if (!value && align === 'right') {
	        this.quill.format('align', false, _quill2.default.sources.USER);
	      }
	      this.quill.format('direction', value, _quill2.default.sources.USER);
	    },
	    link: function link(value) {
	      if (value === true) {
	        value = prompt('Enter link URL:');
	      }
	      this.quill.format('link', value, _quill2.default.sources.USER);
	    },
	    indent: function indent(value) {
	      var range = this.quill.getSelection();
	      var formats = this.quill.getFormat(range);
	      var indent = parseInt(formats.indent || 0);
	      if (value === '+1' || value === '-1') {
	        var modifier = value === '+1' ? 1 : -1;
	        if (formats.direction === 'rtl') modifier *= -1;
	        this.quill.format('indent', indent + modifier, _quill2.default.sources.USER);
	      }
	    }
	  }
	};

	exports.default = Toolbar;
	exports.addControls = addControls;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  'align': {
	    '': __webpack_require__(70),
	    'center': __webpack_require__(71),
	    'right': __webpack_require__(72),
	    'justify': __webpack_require__(73)
	  },
	  'background': __webpack_require__(74),
	  'blockquote': __webpack_require__(75),
	  'bold': __webpack_require__(76),
	  'clean': __webpack_require__(77),
	  'code': __webpack_require__(78),
	  'code-block': __webpack_require__(78),
	  'color': __webpack_require__(79),
	  'direction': {
	    '': __webpack_require__(80),
	    'rtl': __webpack_require__(81)
	  },
	  'float': {
	    'center': __webpack_require__(82),
	    'full': __webpack_require__(83),
	    'left': __webpack_require__(84),
	    'right': __webpack_require__(85)
	  },
	  'formula': __webpack_require__(86),
	  'header': {
	    '1': __webpack_require__(87),
	    '2': __webpack_require__(88)
	  },
	  'italic': __webpack_require__(89),
	  'image': __webpack_require__(90),
	  'indent': {
	    '+1': __webpack_require__(91),
	    '-1': __webpack_require__(92)
	  },
	  'link': __webpack_require__(93),
	  'list': {
	    'ordered': __webpack_require__(94),
	    'bullet': __webpack_require__(95),
	    'unchecked': __webpack_require__(96)
	  },
	  'script': {
	    'sub': __webpack_require__(97),
	    'super': __webpack_require__(98)
	  },
	  'strike': __webpack_require__(99),
	  'underline': __webpack_require__(100),
	  'video': __webpack_require__(101)
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>";

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=14 x2=4 y1=14 y2=14></line> <line class=ql-stroke x1=12 x2=6 y1=4 y2=4></line> </svg>";

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=5 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=9 y1=4 y2=4></line> </svg>";

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=3 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=3 y1=4 y2=4></line> </svg>";

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <g class=\"ql-fill ql-color-label\"> <polygon points=\"6 6.868 6 6 5 6 5 7 5.942 7 6 6.868\"></polygon> <rect height=1 width=1 x=4 y=4></rect> <polygon points=\"6.817 5 6 5 6 6 6.38 6 6.817 5\"></polygon> <rect height=1 width=1 x=2 y=6></rect> <rect height=1 width=1 x=3 y=5></rect> <rect height=1 width=1 x=4 y=7></rect> <polygon points=\"4 11.439 4 11 3 11 3 12 3.755 12 4 11.439\"></polygon> <rect height=1 width=1 x=2 y=12></rect> <rect height=1 width=1 x=2 y=9></rect> <rect height=1 width=1 x=2 y=15></rect> <polygon points=\"4.63 10 4 10 4 11 4.192 11 4.63 10\"></polygon> <rect height=1 width=1 x=3 y=8></rect> <path d=M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z></path> <path d=M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z></path> <path d=M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z></path> <rect height=1 width=1 x=12 y=2></rect> <rect height=1 width=1 x=11 y=3></rect> <path d=M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z></path> <rect height=1 width=1 x=2 y=3></rect> <rect height=1 width=1 x=6 y=2></rect> <rect height=1 width=1 x=3 y=2></rect> <rect height=1 width=1 x=5 y=3></rect> <rect height=1 width=1 x=9 y=2></rect> <rect height=1 width=1 x=15 y=14></rect> <polygon points=\"13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174\"></polygon> <rect height=1 width=1 x=13 y=7></rect> <rect height=1 width=1 x=15 y=5></rect> <rect height=1 width=1 x=14 y=6></rect> <rect height=1 width=1 x=15 y=8></rect> <rect height=1 width=1 x=14 y=9></rect> <path d=M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z></path> <rect height=1 width=1 x=14 y=3></rect> <polygon points=\"12 6.868 12 6 11.62 6 12 6.868\"></polygon> <rect height=1 width=1 x=15 y=2></rect> <rect height=1 width=1 x=12 y=5></rect> <rect height=1 width=1 x=13 y=4></rect> <polygon points=\"12.933 9 13 9 13 8 12.495 8 12.933 9\"></polygon> <rect height=1 width=1 x=9 y=14></rect> <rect height=1 width=1 x=8 y=15></rect> <path d=M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z></path> <rect height=1 width=1 x=5 y=15></rect> <path d=M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z></path> <rect height=1 width=1 x=11 y=15></rect> <path d=M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z></path> <rect height=1 width=1 x=14 y=15></rect> <rect height=1 width=1 x=15 y=11></rect> </g> <polyline class=ql-stroke points=\"5.5 13 9 5 12.5 13\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=11 y2=11></line> </svg>";

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=4 y=5></rect> <rect class=\"ql-fill ql-stroke\" height=3 width=3 x=11 y=5></rect> <path class=\"ql-even ql-fill ql-stroke\" d=M7,8c0,4.031-3,5-3,5></path> <path class=\"ql-even ql-fill ql-stroke\" d=M14,8c0,4.031-3,5-3,5></path> </svg>";

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z></path> <path class=ql-stroke d=M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z></path> </svg>";

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = "<svg class=\"\" viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=5 x2=13 y1=3 y2=3></line> <line class=ql-stroke x1=6 x2=9.35 y1=12 y2=3></line> <line class=ql-stroke x1=11 x2=15 y1=11 y2=15></line> <line class=ql-stroke x1=15 x2=11 y1=11 y2=15></line> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=7 x=2 y=14></rect> </svg>";

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polyline class=\"ql-even ql-stroke\" points=\"5 7 3 9 5 11\"></polyline> <polyline class=\"ql-even ql-stroke\" points=\"13 7 15 9 13 11\"></polyline> <line class=ql-stroke x1=10 x2=8 y1=5 y2=13></line> </svg>";

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-color-label ql-stroke ql-transparent\" x1=3 x2=15 y1=15 y2=15></line> <polyline class=ql-stroke points=\"5.5 11 9 3 12.5 11\"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=9 y2=9></line> </svg>";

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"3 11 5 9 3 7 3 11\"></polygon> <line class=\"ql-stroke ql-fill\" x1=15 x2=11 y1=4 y2=4></line> <path class=ql-fill d=M11,3a3,3,0,0,0,0,6h1V3H11Z></path> <rect class=ql-fill height=11 width=1 x=11 y=4></rect> <rect class=ql-fill height=11 width=1 x=13 y=4></rect> </svg>";

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=\"ql-stroke ql-fill\" points=\"15 12 13 10 15 8 15 12\"></polygon> <line class=\"ql-stroke ql-fill\" x1=9 x2=5 y1=4 y2=4></line> <path class=ql-fill d=M5,3A3,3,0,0,0,5,9H6V3H5Z></path> <rect class=ql-fill height=11 width=1 x=5 y=4></rect> <rect class=ql-fill height=11 width=1 x=7 y=4></rect> </svg>";

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M14,16H4a1,1,0,0,1,0-2H14A1,1,0,0,1,14,16Z /> <path class=ql-fill d=M14,4H4A1,1,0,0,1,4,2H14A1,1,0,0,1,14,4Z /> <rect class=ql-fill x=3 y=6 width=12 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M13,16H5a1,1,0,0,1,0-2h8A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H5A1,1,0,0,1,5,2h8A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=2 y=6 width=14 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15,8H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,8Z /> <path class=ql-fill d=M15,12H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,12Z /> <path class=ql-fill d=M15,16H5a1,1,0,0,1,0-2H15A1,1,0,0,1,15,16Z /> <path class=ql-fill d=M15,4H5A1,1,0,0,1,5,2H15A1,1,0,0,1,15,4Z /> <rect class=ql-fill x=2 y=6 width=8 height=6 rx=1 ry=1 /> </svg>";

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M5,8H3A1,1,0,0,1,3,6H5A1,1,0,0,1,5,8Z /> <path class=ql-fill d=M5,12H3a1,1,0,0,1,0-2H5A1,1,0,0,1,5,12Z /> <path class=ql-fill d=M13,16H3a1,1,0,0,1,0-2H13A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H3A1,1,0,0,1,3,2H13A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=8 y=6 width=8 height=6 rx=1 ry=1 transform=\"translate(24 18) rotate(-180)\"/> </svg>";

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z></path> <rect class=ql-fill height=1.6 rx=0.8 ry=0.8 width=5 x=5.15 y=6.2></rect> <path class=ql-fill d=M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z></path> </svg>";

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <line class=\"ql-stroke ql-thin\" x1=13.5 x2=15.5 y1=14.5 y2=14.5></line> <path class=ql-fill d=M14.5,15a0.5,0.5,0,0,1-.5-0.5V12.085l-0.276.138A0.5,0.5,0,0,1,13.053,12c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,15,11.5v3A0.5,0.5,0,0,1,14.5,15Z></path> </svg>";

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=3 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=11 y1=4 y2=14></line> <line class=ql-stroke x1=11 x2=3 y1=9 y2=9></line> <path class=\"ql-stroke ql-thin\" d=M15.5,14.5h-2c0-.234,1.85-1.076,1.85-2.234a0.959,0.959,0,0,0-1.85-.109></path> </svg>";

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=13 y1=4 y2=4></line> <line class=ql-stroke x1=5 x2=11 y1=14 y2=14></line> <line class=ql-stroke x1=8 x2=10 y1=14 y2=4></line> </svg>";

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=10 width=12 x=3 y=4></rect> <circle class=ql-fill cx=6 cy=7 r=1></circle> <polyline class=\"ql-even ql-fill\" points=\"5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12\"></polyline> </svg>";

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=\"ql-fill ql-stroke\" points=\"3 7 3 11 5 9 3 7\"></polyline> </svg>";

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points=\"5 7 5 11 3 9 5 7\"></polyline> </svg>";

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=11 y1=7 y2=11></line> <path class=\"ql-even ql-stroke\" d=M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z></path> <path class=\"ql-even ql-stroke\" d=M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z></path> </svg>";

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=7 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=7 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=7 x2=15 y1=14 y2=14></line> <line class=\"ql-stroke ql-thin\" x1=2.5 x2=4.5 y1=5.5 y2=5.5></line> <path class=ql-fill d=M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z></path> <path class=\"ql-stroke ql-thin\" d=M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156></path> <path class=\"ql-stroke ql-thin\" d=M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109></path> </svg>";

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=6 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=6 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=6 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=3 y1=4 y2=4></line> <line class=ql-stroke x1=3 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=3 y1=14 y2=14></line> </svg>";

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = "<svg class=\"\" viewbox=\"0 0 18 18\"> <line class=ql-stroke x1=9 x2=15 y1=4 y2=4></line> <polyline class=ql-stroke points=\"3 4 4 5 6 3\"></polyline> <line class=ql-stroke x1=9 x2=15 y1=14 y2=14></line> <polyline class=ql-stroke points=\"3 14 4 15 6 13\"></polyline> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points=\"3 9 4 10 6 8\"></polyline> </svg>";

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z /> <path class=ql-fill d=M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z /> </svg>";

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-fill d=M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z /> <path class=ql-fill d=M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z /> </svg>";

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <line class=\"ql-stroke ql-thin\" x1=15.5 x2=2.5 y1=8.5 y2=9.5></line> <path class=ql-fill d=M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z></path> <path class=ql-fill d=M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z></path> </svg>";

/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <path class=ql-stroke d=M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3></path> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=12 x=3 y=15></rect> </svg>";

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=12 width=1 x=5 y=3></rect> <rect class=ql-fill height=12 width=1 x=12 y=3></rect> <rect class=ql-fill height=2 width=8 x=5 y=8></rect> <rect class=ql-fill height=1 width=3 x=3 y=5></rect> <rect class=ql-fill height=1 width=3 x=3 y=7></rect> <rect class=ql-fill height=1 width=3 x=3 y=10></rect> <rect class=ql-fill height=1 width=3 x=3 y=12></rect> <rect class=ql-fill height=1 width=3 x=12 y=5></rect> <rect class=ql-fill height=1 width=3 x=12 y=7></rect> <rect class=ql-fill height=1 width=3 x=12 y=10></rect> <rect class=ql-fill height=1 width=3 x=12 y=12></rect> </svg>";

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dropdown = __webpack_require__(103);

	var _dropdown2 = _interopRequireDefault(_dropdown);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Picker = function () {
	  function Picker(select) {
	    var _this = this;

	    _classCallCheck(this, Picker);

	    this.select = select;
	    this.container = document.createElement('span');
	    this.buildPicker();
	    this.select.style.display = 'none';
	    this.select.parentNode.insertBefore(this.container, this.select);
	    this.label.addEventListener('mousedown', function () {
	      _this.container.classList.toggle('ql-expanded');
	    });
	    this.select.addEventListener('change', this.update.bind(this));
	  }

	  _createClass(Picker, [{
	    key: 'buildItem',
	    value: function buildItem(option) {
	      var _this2 = this;

	      var item = document.createElement('span');
	      item.classList.add('ql-picker-item');
	      if (option.hasAttribute('value')) {
	        item.setAttribute('data-value', option.getAttribute('value'));
	      }
	      if (option.textContent) {
	        item.setAttribute('data-label', option.textContent);
	      }
	      item.addEventListener('click', function () {
	        _this2.selectItem(item, true);
	      });
	      return item;
	    }
	  }, {
	    key: 'buildLabel',
	    value: function buildLabel() {
	      var label = document.createElement('span');
	      label.classList.add('ql-picker-label');
	      label.innerHTML = _dropdown2.default;
	      this.container.appendChild(label);
	      return label;
	    }
	  }, {
	    key: 'buildOptions',
	    value: function buildOptions() {
	      var _this3 = this;

	      var options = document.createElement('span');
	      options.classList.add('ql-picker-options');
	      [].slice.call(this.select.options).forEach(function (option) {
	        var item = _this3.buildItem(option);
	        options.appendChild(item);
	        if (option.hasAttribute('selected')) {
	          _this3.selectItem(item);
	        }
	      });
	      this.container.appendChild(options);
	    }
	  }, {
	    key: 'buildPicker',
	    value: function buildPicker() {
	      var _this4 = this;

	      [].slice.call(this.select.attributes).forEach(function (item) {
	        _this4.container.setAttribute(item.name, item.value);
	      });
	      this.container.classList.add('ql-picker');
	      this.label = this.buildLabel();
	      this.buildOptions();
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.container.classList.remove('ql-expanded');
	    }
	  }, {
	    key: 'selectItem',
	    value: function selectItem(item) {
	      var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	      var selected = this.container.querySelector('.ql-selected');
	      if (item === selected) return;
	      if (selected != null) {
	        selected.classList.remove('ql-selected');
	      }
	      if (item == null) return;
	      item.classList.add('ql-selected');
	      this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
	      if (item.hasAttribute('data-value')) {
	        this.label.setAttribute('data-value', item.getAttribute('data-value'));
	      } else {
	        this.label.removeAttribute('data-value');
	      }
	      if (item.hasAttribute('data-label')) {
	        this.label.setAttribute('data-label', item.getAttribute('data-label'));
	      } else {
	        this.label.removeAttribute('data-label');
	      }
	      if (trigger) {
	        if (typeof Event === 'function') {
	          this.select.dispatchEvent(new Event('change'));
	        } else if ((typeof Event === 'undefined' ? 'undefined' : _typeof(Event)) === 'object') {
	          // IE11
	          var event = document.createEvent('Event');
	          event.initEvent('change', true, true);
	          this.select.dispatchEvent(event);
	        }
	        this.close();
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var option = void 0;
	      if (this.select.selectedIndex > -1) {
	        var item = this.container.querySelector('.ql-picker-options').children[this.select.selectedIndex];
	        option = this.select.options[this.select.selectedIndex];
	        this.selectItem(item);
	      } else {
	        this.selectItem(null);
	      }
	      var isActive = option != null && option !== this.select.querySelector('option[selected]');
	      this.label.classList.toggle('ql-active', isActive);
	    }
	  }]);

	  return Picker;
	}();

	exports.default = Picker;

/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = "<svg viewbox=\"0 0 18 18\"> <polygon class=ql-stroke points=\"7 11 9 13 11 11 7 11\"></polygon> <polygon class=ql-stroke points=\"7 7 9 5 11 7 7 7\"></polygon> </svg>";

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _picker = __webpack_require__(102);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ColorPicker = function (_Picker) {
	  _inherits(ColorPicker, _Picker);

	  function ColorPicker(select, label) {
	    _classCallCheck(this, ColorPicker);

	    var _this = _possibleConstructorReturn(this, (ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call(this, select));

	    _this.label.innerHTML = label;
	    _this.container.classList.add('ql-color-picker');
	    [].slice.call(_this.container.querySelectorAll('.ql-picker-item'), 0, 7).forEach(function (item) {
	      item.classList.add('ql-primary');
	    });
	    return _this;
	  }

	  _createClass(ColorPicker, [{
	    key: 'buildItem',
	    value: function buildItem(option) {
	      var item = _get(ColorPicker.prototype.__proto__ || Object.getPrototypeOf(ColorPicker.prototype), 'buildItem', this).call(this, option);
	      item.style.backgroundColor = option.getAttribute('value') || '';
	      return item;
	    }
	  }, {
	    key: 'selectItem',
	    value: function selectItem(item, trigger) {
	      _get(ColorPicker.prototype.__proto__ || Object.getPrototypeOf(ColorPicker.prototype), 'selectItem', this).call(this, item, trigger);
	      var colorLabel = this.label.querySelector('.ql-color-label');
	      var value = item ? item.getAttribute('data-value') || '' : '';
	      if (colorLabel) {
	        if (colorLabel.tagName === 'line') {
	          colorLabel.style.stroke = value;
	        } else {
	          colorLabel.style.fill = value;
	        }
	      }
	    }
	  }]);

	  return ColorPicker;
	}(_picker2.default);

	exports.default = ColorPicker;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _picker = __webpack_require__(102);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var IconPicker = function (_Picker) {
	  _inherits(IconPicker, _Picker);

	  function IconPicker(select, icons) {
	    _classCallCheck(this, IconPicker);

	    var _this = _possibleConstructorReturn(this, (IconPicker.__proto__ || Object.getPrototypeOf(IconPicker)).call(this, select));

	    _this.container.classList.add('ql-icon-picker');
	    [].forEach.call(_this.container.querySelectorAll('.ql-picker-item'), function (item) {
	      item.innerHTML = icons[item.getAttribute('data-value') || ''];
	    });
	    _this.defaultItem = _this.container.querySelector('.ql-selected');
	    _this.selectItem(_this.defaultItem);
	    return _this;
	  }

	  _createClass(IconPicker, [{
	    key: 'selectItem',
	    value: function selectItem(item, trigger) {
	      _get(IconPicker.prototype.__proto__ || Object.getPrototypeOf(IconPicker.prototype), 'selectItem', this).call(this, item, trigger);
	      item = item || this.defaultItem;
	      this.label.innerHTML = item.innerHTML;
	    }
	  }]);

	  return IconPicker;
	}(_picker2.default);

	exports.default = IconPicker;

/***/ },
/* 106 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tooltip = function () {
	  function Tooltip(quill, boundsContainer) {
	    var _this = this;

	    _classCallCheck(this, Tooltip);

	    this.quill = quill;
	    this.boundsContainer = boundsContainer || document.body;
	    this.root = quill.addContainer('ql-tooltip');
	    this.root.innerHTML = this.constructor.TEMPLATE;
	    this.quill.root.addEventListener('scroll', function () {
	      _this.root.style.marginTop = -1 * _this.quill.root.scrollTop + 'px';
	    });
	    this.hide();
	  }

	  _createClass(Tooltip, [{
	    key: 'hide',
	    value: function hide() {
	      this.root.classList.add('ql-hidden');
	    }
	  }, {
	    key: 'position',
	    value: function position(reference) {
	      var left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
	      var top = reference.bottom + this.quill.root.scrollTop;
	      this.root.style.left = left + 'px';
	      this.root.style.top = top + 'px';
	      this.root.classList.remove('ql-flip');
	      var containerBounds = this.boundsContainer.getBoundingClientRect();
	      var rootBounds = this.root.getBoundingClientRect();
	      var shift = 0;
	      if (rootBounds.right > containerBounds.right) {
	        shift = containerBounds.right - rootBounds.right;
	        this.root.style.left = left + shift + 'px';
	      }
	      if (rootBounds.left < containerBounds.left) {
	        shift = containerBounds.left - rootBounds.left;
	        this.root.style.left = left + shift + 'px';
	      }
	      if (rootBounds.bottom > containerBounds.bottom) {
	        var height = rootBounds.bottom - rootBounds.top;
	        var verticalShift = containerBounds.bottom - rootBounds.bottom - height;
	        this.root.style.top = top + verticalShift + 'px';
	        this.root.classList.add('ql-flip');
	      }
	      return shift;
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.root.classList.remove('ql-editing');
	      this.root.classList.remove('ql-hidden');
	    }
	  }]);

	  return Tooltip;
	}();

	exports.default = Tooltip;

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.BubbleTooltip = undefined;

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(25);

	var _extend2 = _interopRequireDefault(_extend);

	var _emitter = __webpack_require__(35);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _base = __webpack_require__(108);

	var _base2 = _interopRequireDefault(_base);

	var _selection = __webpack_require__(40);

	var _icons = __webpack_require__(69);

	var _icons2 = _interopRequireDefault(_icons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TOOLBAR_CONFIG = [['bold', 'italic', 'link'], [{ header: 1 }, { header: 2 }, 'blockquote']];

	var BubbleTheme = function (_BaseTheme) {
	  _inherits(BubbleTheme, _BaseTheme);

	  function BubbleTheme(quill, options) {
	    _classCallCheck(this, BubbleTheme);

	    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
	      options.modules.toolbar.container = TOOLBAR_CONFIG;
	    }

	    var _this = _possibleConstructorReturn(this, (BubbleTheme.__proto__ || Object.getPrototypeOf(BubbleTheme)).call(this, quill, options));

	    _this.quill.container.classList.add('ql-bubble');
	    return _this;
	  }

	  _createClass(BubbleTheme, [{
	    key: 'extendToolbar',
	    value: function extendToolbar(toolbar) {
	      this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
	      this.tooltip.root.appendChild(toolbar.container);
	      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), _icons2.default);
	      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), _icons2.default);
	    }
	  }]);

	  return BubbleTheme;
	}(_base2.default);

	BubbleTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
	  modules: {
	    toolbar: {
	      handlers: {
	        link: function link(value) {
	          if (!value) {
	            this.quill.format('link', false);
	          } else {
	            this.quill.theme.tooltip.edit();
	          }
	        }
	      }
	    }
	  }
	});

	var BubbleTooltip = function (_BaseTooltip) {
	  _inherits(BubbleTooltip, _BaseTooltip);

	  function BubbleTooltip(quill, bounds) {
	    _classCallCheck(this, BubbleTooltip);

	    var _this2 = _possibleConstructorReturn(this, (BubbleTooltip.__proto__ || Object.getPrototypeOf(BubbleTooltip)).call(this, quill, bounds));

	    _this2.quill.on(_emitter2.default.events.EDITOR_CHANGE, function (type, range, oldRange, source) {
	      if (type !== _emitter2.default.events.SELECTION_CHANGE) return;
	      if (range != null && range.length > 0 && source === _emitter2.default.sources.USER) {
	        _this2.show();
	        // Lock our width so we will expand beyond our offsetParent boundaries
	        _this2.root.style.left = '0px';
	        _this2.root.style.width = '';
	        _this2.root.style.width = _this2.root.offsetWidth + 'px';
	        var lines = _this2.quill.scroll.lines(range.index, range.length);
	        if (lines.length === 1) {
	          _this2.position(_this2.quill.getBounds(range));
	        } else {
	          var lastLine = lines[lines.length - 1];
	          var index = lastLine.offset(_this2.quill.scroll);
	          var length = Math.min(lastLine.length() - 1, range.index + range.length - index);
	          var _bounds = _this2.quill.getBounds(new _selection.Range(index, length));
	          _this2.position(_bounds);
	        }
	      } else if (document.activeElement !== _this2.textbox && _this2.quill.hasFocus()) {
	        _this2.hide();
	      }
	    });
	    return _this2;
	  }

	  _createClass(BubbleTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this3 = this;

	      _get(BubbleTooltip.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip.prototype), 'listen', this).call(this);
	      this.root.querySelector('.ql-close').addEventListener('click', function () {
	        _this3.root.classList.remove('ql-editing');
	      });
	      this.quill.on(_emitter2.default.events.SCROLL_OPTIMIZE, function () {
	        // Let selection be restored by toolbar handlers before repositioning
	        setTimeout(function () {
	          if (_this3.root.classList.contains('ql-hidden')) return;
	          var range = _this3.quill.getSelection();
	          if (range != null) {
	            _this3.position(_this3.quill.getBounds(range));
	          }
	        }, 1);
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.show();
	    }
	  }, {
	    key: 'position',
	    value: function position(reference) {
	      var shift = _get(BubbleTooltip.prototype.__proto__ || Object.getPrototypeOf(BubbleTooltip.prototype), 'position', this).call(this, reference);
	      var arrow = this.root.querySelector('.ql-tooltip-arrow');
	      arrow.style.marginLeft = '';
	      if (shift === 0) return shift;
	      arrow.style.marginLeft = -1 * shift - arrow.offsetWidth / 2 + 'px';
	    }
	  }]);

	  return BubbleTooltip;
	}(_base.BaseTooltip);

	BubbleTooltip.TEMPLATE = ['<span class="ql-tooltip-arrow"></span>', '<div class="ql-tooltip-editor">', '<input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL">', '<a class="ql-close"></a>', '</div>'].join('');

	exports.BubbleTooltip = BubbleTooltip;
	exports.default = BubbleTheme;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.BaseTooltip = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _extend = __webpack_require__(25);

	var _extend2 = _interopRequireDefault(_extend);

	var _quillDelta = __webpack_require__(20);

	var _quillDelta2 = _interopRequireDefault(_quillDelta);

	var _emitter = __webpack_require__(35);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _keyboard = __webpack_require__(52);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _theme = __webpack_require__(41);

	var _theme2 = _interopRequireDefault(_theme);

	var _colorPicker = __webpack_require__(104);

	var _colorPicker2 = _interopRequireDefault(_colorPicker);

	var _iconPicker = __webpack_require__(105);

	var _iconPicker2 = _interopRequireDefault(_iconPicker);

	var _picker = __webpack_require__(102);

	var _picker2 = _interopRequireDefault(_picker);

	var _tooltip = __webpack_require__(106);

	var _tooltip2 = _interopRequireDefault(_tooltip);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ALIGNS = [false, 'center', 'right', 'justify'];

	var COLORS = ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"];

	var FONTS = [false, 'serif', 'monospace'];

	var HEADERS = ['1', '2', '3', false];

	var SIZES = ['small', false, 'large', 'huge'];

	var BaseTheme = function (_Theme) {
	  _inherits(BaseTheme, _Theme);

	  function BaseTheme(quill, options) {
	    _classCallCheck(this, BaseTheme);

	    var _this = _possibleConstructorReturn(this, (BaseTheme.__proto__ || Object.getPrototypeOf(BaseTheme)).call(this, quill, options));

	    var listener = function listener(e) {
	      if (!document.body.contains(quill.root)) {
	        return document.body.removeEventListener('click', listener);
	      }
	      if (_this.tooltip != null && !_this.tooltip.root.contains(e.target) && document.activeElement !== _this.tooltip.textbox && !_this.quill.hasFocus()) {
	        _this.tooltip.hide();
	      }
	      if (_this.pickers != null) {
	        _this.pickers.forEach(function (picker) {
	          if (!picker.container.contains(e.target)) {
	            picker.close();
	          }
	        });
	      }
	    };
	    document.body.addEventListener('click', listener);
	    return _this;
	  }

	  _createClass(BaseTheme, [{
	    key: 'addModule',
	    value: function addModule(name) {
	      var module = _get(BaseTheme.prototype.__proto__ || Object.getPrototypeOf(BaseTheme.prototype), 'addModule', this).call(this, name);
	      if (name === 'toolbar') {
	        this.extendToolbar(module);
	      }
	      return module;
	    }
	  }, {
	    key: 'buildButtons',
	    value: function buildButtons(buttons, icons) {
	      buttons.forEach(function (button) {
	        var className = button.getAttribute('class') || '';
	        className.split(/\s+/).forEach(function (name) {
	          if (!name.startsWith('ql-')) return;
	          name = name.slice('ql-'.length);
	          if (icons[name] == null) return;
	          if (name === 'direction') {
	            button.innerHTML = icons[name][''] + icons[name]['rtl'];
	          } else if (typeof icons[name] === 'string') {
	            button.innerHTML = icons[name];
	          } else {
	            var value = button.value || '';
	            if (value != null && icons[name][value]) {
	              button.innerHTML = icons[name][value];
	            }
	          }
	        });
	      });
	    }
	  }, {
	    key: 'buildPickers',
	    value: function buildPickers(selects, icons) {
	      var _this2 = this;

	      this.pickers = selects.map(function (select) {
	        if (select.classList.contains('ql-align')) {
	          if (select.querySelector('option') == null) {
	            fillSelect(select, ALIGNS);
	          }
	          return new _iconPicker2.default(select, icons.align);
	        } else if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
	          var format = select.classList.contains('ql-background') ? 'background' : 'color';
	          if (select.querySelector('option') == null) {
	            fillSelect(select, COLORS, format === 'background' ? '#ffffff' : '#000000');
	          }
	          return new _colorPicker2.default(select, icons[format]);
	        } else {
	          if (select.querySelector('option') == null) {
	            if (select.classList.contains('ql-font')) {
	              fillSelect(select, FONTS);
	            } else if (select.classList.contains('ql-header')) {
	              fillSelect(select, HEADERS);
	            } else if (select.classList.contains('ql-size')) {
	              fillSelect(select, SIZES);
	            }
	          }
	          return new _picker2.default(select);
	        }
	      });
	      var update = function update() {
	        _this2.pickers.forEach(function (picker) {
	          picker.update();
	        });
	      };
	      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, update).on(_emitter2.default.events.SCROLL_OPTIMIZE, update);
	    }
	  }]);

	  return BaseTheme;
	}(_theme2.default);

	BaseTheme.DEFAULTS = (0, _extend2.default)(true, {}, _theme2.default.DEFAULTS, {
	  modules: {
	    toolbar: {
	      handlers: {
	        formula: function formula() {
	          this.quill.theme.tooltip.edit('formula');
	        },
	        image: function image() {
	          var _this3 = this;

	          var fileInput = this.container.querySelector('input.ql-image[type=file]');
	          if (fileInput == null) {
	            fileInput = document.createElement('input');
	            fileInput.setAttribute('type', 'file');
	            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml');
	            fileInput.classList.add('ql-image');
	            fileInput.addEventListener('change', function () {
	              if (fileInput.files != null && fileInput.files[0] != null) {
	                var reader = new FileReader();
	                reader.onload = function (e) {
	                  var range = _this3.quill.getSelection(true);
	                  _this3.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert({ image: e.target.result }), _emitter2.default.sources.USER);
	                  fileInput.value = "";
	                };
	                reader.readAsDataURL(fileInput.files[0]);
	              }
	            });
	            this.container.appendChild(fileInput);
	          }
	          fileInput.click();
	        },
	        video: function video() {
	          this.quill.theme.tooltip.edit('video');
	        }
	      }
	    }
	  }
	});

	var BaseTooltip = function (_Tooltip) {
	  _inherits(BaseTooltip, _Tooltip);

	  function BaseTooltip(quill, boundsContainer) {
	    _classCallCheck(this, BaseTooltip);

	    var _this4 = _possibleConstructorReturn(this, (BaseTooltip.__proto__ || Object.getPrototypeOf(BaseTooltip)).call(this, quill, boundsContainer));

	    _this4.textbox = _this4.root.querySelector('input[type="text"]');
	    _this4.listen();
	    return _this4;
	  }

	  _createClass(BaseTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this5 = this;

	      this.textbox.addEventListener('keydown', function (event) {
	        if (_keyboard2.default.match(event, 'enter')) {
	          _this5.save();
	          event.preventDefault();
	        } else if (_keyboard2.default.match(event, 'escape')) {
	          _this5.cancel();
	          event.preventDefault();
	        }
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.hide();
	    }
	  }, {
	    key: 'edit',
	    value: function edit() {
	      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'link';
	      var preview = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      this.root.classList.remove('ql-hidden');
	      this.root.classList.add('ql-editing');
	      if (preview != null) {
	        this.textbox.value = preview;
	      } else if (mode !== this.root.getAttribute('data-mode')) {
	        this.textbox.value = '';
	      }
	      this.position(this.quill.getBounds(this.quill.selection.savedRange));
	      this.textbox.select();
	      this.textbox.setAttribute('placeholder', this.textbox.getAttribute('data-' + mode) || '');
	      this.root.setAttribute('data-mode', mode);
	    }
	  }, {
	    key: 'restoreFocus',
	    value: function restoreFocus() {
	      var scrollTop = this.quill.root.scrollTop;
	      this.quill.focus();
	      this.quill.root.scrollTop = scrollTop;
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      var value = this.textbox.value;
	      switch (this.root.getAttribute('data-mode')) {
	        case 'link':
	          {
	            var scrollTop = this.quill.root.scrollTop;
	            if (this.linkRange) {
	              this.quill.formatText(this.linkRange, 'link', value, _emitter2.default.sources.USER);
	              delete this.linkRange;
	            } else {
	              this.restoreFocus();
	              this.quill.format('link', value, _emitter2.default.sources.USER);
	            }
	            this.quill.root.scrollTop = scrollTop;
	            break;
	          }
	        case 'video':
	          {
	            var match = value.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || value.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
	            if (match) {
	              value = match[1] + '://www.youtube.com/embed/' + match[3] + '?showinfo=0';
	            } else if (match = value.match(/^(https?):\/\/(www\.)?vimeo\.com\/(\d+)/)) {
	              // eslint-disable-line no-cond-assign
	              value = match[1] + '://player.vimeo.com/video/' + match[3] + '/';
	            }
	          } // eslint-disable-next-line no-fallthrough
	        case 'formula':
	          {
	            var range = this.quill.getSelection(true);
	            var index = range.index + range.length;
	            if (range != null) {
	              this.quill.insertEmbed(index, this.root.getAttribute('data-mode'), value, _emitter2.default.sources.USER);
	              if (this.root.getAttribute('data-mode') === 'formula') {
	                this.quill.insertText(index + 1, ' ', _emitter2.default.sources.USER);
	              }
	              this.quill.setSelection(index + 2, _emitter2.default.sources.USER);
	            }
	            break;
	          }
	        default:
	      }
	      this.textbox.value = '';
	      this.hide();
	    }
	  }]);

	  return BaseTooltip;
	}(_tooltip2.default);

	function fillSelect(select, values) {
	  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  values.forEach(function (value) {
	    var option = document.createElement('option');
	    if (value === defaultValue) {
	      option.setAttribute('selected', 'selected');
	    } else {
	      option.setAttribute('value', value);
	    }
	    select.appendChild(option);
	  });
	}

	exports.BaseTooltip = BaseTooltip;
	exports.default = BaseTheme;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(25);

	var _extend2 = _interopRequireDefault(_extend);

	var _emitter = __webpack_require__(35);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _base = __webpack_require__(108);

	var _base2 = _interopRequireDefault(_base);

	var _link = __webpack_require__(60);

	var _link2 = _interopRequireDefault(_link);

	var _selection = __webpack_require__(40);

	var _icons = __webpack_require__(69);

	var _icons2 = _interopRequireDefault(_icons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TOOLBAR_CONFIG = [[{ header: ['1', '2', '3', false] }], ['bold', 'italic', 'underline', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']];

	var SnowTheme = function (_BaseTheme) {
	  _inherits(SnowTheme, _BaseTheme);

	  function SnowTheme(quill, options) {
	    _classCallCheck(this, SnowTheme);

	    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
	      options.modules.toolbar.container = TOOLBAR_CONFIG;
	    }

	    var _this = _possibleConstructorReturn(this, (SnowTheme.__proto__ || Object.getPrototypeOf(SnowTheme)).call(this, quill, options));

	    _this.quill.container.classList.add('ql-snow');
	    return _this;
	  }

	  _createClass(SnowTheme, [{
	    key: 'extendToolbar',
	    value: function extendToolbar(toolbar) {
	      toolbar.container.classList.add('ql-snow');
	      this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), _icons2.default);
	      this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), _icons2.default);
	      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
	      if (toolbar.container.querySelector('.ql-link')) {
	        this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function (range, context) {
	          toolbar.handlers['link'].call(toolbar, !context.format.link);
	        });
	      }
	    }
	  }]);

	  return SnowTheme;
	}(_base2.default);

	SnowTheme.DEFAULTS = (0, _extend2.default)(true, {}, _base2.default.DEFAULTS, {
	  modules: {
	    toolbar: {
	      handlers: {
	        link: function link(value) {
	          if (value) {
	            var range = this.quill.getSelection();
	            if (range == null || range.length == 0) return;
	            var preview = this.quill.getText(range);
	            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
	              preview = 'mailto:' + preview;
	            }
	            var tooltip = this.quill.theme.tooltip;
	            tooltip.edit('link', preview);
	          } else {
	            this.quill.format('link', false);
	          }
	        }
	      }
	    }
	  }
	});

	var SnowTooltip = function (_BaseTooltip) {
	  _inherits(SnowTooltip, _BaseTooltip);

	  function SnowTooltip(quill, bounds) {
	    _classCallCheck(this, SnowTooltip);

	    var _this2 = _possibleConstructorReturn(this, (SnowTooltip.__proto__ || Object.getPrototypeOf(SnowTooltip)).call(this, quill, bounds));

	    _this2.preview = _this2.root.querySelector('a.ql-preview');
	    return _this2;
	  }

	  _createClass(SnowTooltip, [{
	    key: 'listen',
	    value: function listen() {
	      var _this3 = this;

	      _get(SnowTooltip.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip.prototype), 'listen', this).call(this);
	      this.root.querySelector('a.ql-action').addEventListener('click', function (event) {
	        if (_this3.root.classList.contains('ql-editing')) {
	          _this3.save();
	        } else {
	          _this3.edit('link', _this3.preview.textContent);
	        }
	        event.preventDefault();
	      });
	      this.root.querySelector('a.ql-remove').addEventListener('click', function (event) {
	        if (_this3.linkRange != null) {
	          _this3.restoreFocus();
	          _this3.quill.formatText(_this3.linkRange, 'link', false, _emitter2.default.sources.USER);
	          delete _this3.linkRange;
	        }
	        event.preventDefault();
	        _this3.hide();
	      });
	      this.quill.on(_emitter2.default.events.SELECTION_CHANGE, function (range, oldRange, source) {
	        if (range == null) return;
	        if (range.length === 0 && source === _emitter2.default.sources.USER) {
	          var _quill$scroll$descend = _this3.quill.scroll.descendant(_link2.default, range.index),
	              _quill$scroll$descend2 = _slicedToArray(_quill$scroll$descend, 2),
	              link = _quill$scroll$descend2[0],
	              offset = _quill$scroll$descend2[1];

	          if (link != null) {
	            _this3.linkRange = new _selection.Range(range.index - offset, link.length());
	            var preview = _link2.default.formats(link.domNode);
	            _this3.preview.textContent = preview;
	            _this3.preview.setAttribute('href', preview);
	            _this3.show();
	            _this3.position(_this3.quill.getBounds(_this3.linkRange));
	            return;
	          }
	        } else {
	          delete _this3.linkRange;
	        }
	        _this3.hide();
	      });
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      _get(SnowTooltip.prototype.__proto__ || Object.getPrototypeOf(SnowTooltip.prototype), 'show', this).call(this);
	      this.root.removeAttribute('data-mode');
	    }
	  }]);

	  return SnowTooltip;
	}(_base.BaseTooltip);

	SnowTooltip.TEMPLATE = ['<a class="ql-preview" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join('');

	exports.default = SnowTheme;

/***/ }
/******/ ])
});
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/buffer/index.js").Buffer))

/***/ },

/***/ "./src/app/directory/quill/quill.component.css":
/***/ function(module, exports) {

module.exports = ".ql-container .ql-editor {\r\n  min-height: 200px;\r\n  padding-bottom:50px\r\n}"

/***/ },

/***/ "./src/app/directory/quill/quill.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var Quill = __webpack_require__("./node_modules/quill/dist/quill.js");
var QuillEditorComponent = (function () {
    function QuillEditorComponent(elementRef) {
        this.elementRef = elementRef;
        this.defaultModules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }]
            ]
        };
        this.onEditorCreated = new core_1.EventEmitter();
        this.onContentChanged = new core_1.EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    QuillEditorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.editorElem = this.elementRef.nativeElement.children[0];
        this.quillEditor = new Quill(this.editorElem, {
            modules: this.modules || this.defaultModules,
            placeholder: this.placeholder || 'Insert text here ...',
            readOnly: this.readOnly || false,
            theme: this.theme || 'snow',
            formats: this.formats,
            boundary: document.body
        });
        if (this.content) {
            this.quillEditor.pasteHTML(this.content);
        }
        this.onEditorCreated.emit(this.quillEditor);
        // mark model as touched if editor lost focus
        this.quillEditor.on('selection-change', function (range) {
            if (!range) {
                _this.onModelTouched();
            }
        });
        // update model if text changes
        this.quillEditor.on('text-change', function (delta, oldDelta, source) {
            var html = _this.editorElem.children[0].innerHTML;
            var text = _this.quillEditor.getText();
            if (html === '<p><br></p>') {
                html = null;
            }
            _this.onModelChange(html);
            _this.onContentChanged.emit({
                editor: _this.quillEditor,
                html: html,
                text: text
            });
        });
    };
    QuillEditorComponent.prototype.ngOnChanges = function (changes) {
        if (changes['readOnly'] && this.quillEditor) {
            this.quillEditor.enable(!changes['readOnly'].currentValue);
        }
    };
    QuillEditorComponent.prototype.writeValue = function (currentValue) {
        console.log(currentValue);
        this.content = currentValue;
        if (this.quillEditor) {
            if (currentValue) {
                this.quillEditor.pasteHTML(currentValue);
                return;
            }
            this.quillEditor.setText('');
        }
    };
    QuillEditorComponent.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    QuillEditorComponent.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], QuillEditorComponent.prototype, "theme", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QuillEditorComponent.prototype, "modules", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], QuillEditorComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], QuillEditorComponent.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], QuillEditorComponent.prototype, "formats", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], QuillEditorComponent.prototype, "onEditorCreated", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], QuillEditorComponent.prototype, "onContentChanged", void 0);
    QuillEditorComponent = __decorate([
        core_1.Component({
            selector: 'quill-editor',
            template: "\n<div></div>\n",
            styles: [__webpack_require__("./src/app/directory/quill/quill.component.css")],
            providers: [{
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return QuillEditorComponent; }),
                    multi: true
                }],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _c) || Object])
    ], QuillEditorComponent);
    return QuillEditorComponent;
    var _a, _b, _c;
}());
exports.QuillEditorComponent = QuillEditorComponent;


/***/ },

/***/ "./src/app/directory/quill/quill.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var quill_component_1 = __webpack_require__("./src/app/directory/quill/quill.component.ts");
var QuillModule = (function () {
    function QuillModule() {
    }
    QuillModule = __decorate([
        core_1.NgModule({
            declarations: [
                quill_component_1.QuillEditorComponent
            ],
            imports: [],
            exports: [quill_component_1.QuillEditorComponent],
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], QuillModule);
    return QuillModule;
}());
exports.QuillModule = QuillModule;


/***/ },

/***/ "./src/app/generic/generic.component.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"breadcrumb-item active\">Generic Groups and Topics</li>\r\n</ol>\r\n<h1 class=\"page-title\">Lists - <span class=\"fw-semi-bold\">Generic Groups for BOT</span></h1>\r\n<section class=\"widget widget2\" widget>\r\n  <header>\r\n    <h4>\r\n      Generic Group Lists\r\n    </h4>\r\n  </header>\r\n  <div class=\"widget-body\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-6 col-sm-12 col-lg-6 col-xs-12 divseparator\">\r\n        <ul class=\"list-group list-group-sortable mt-lg\">\r\n          <li class=\"list-group-item\" *ngFor=\"let blockGroups of blockGroupsModel\" id={{blockGroups.group._id}}>\r\n            <i class=\"fa fa-sort\"></i>\r\n            <a class=\"close\" *ngIf=\"blockGroups.group.isLocked == true\"><i class=\"fa fa-lock\" aria-hidden=\"true\"></i></a>\r\n            <a href=\"#\" class=\"close\" *ngIf=\"blockGroups.group.isLocked == false\" (click)=\"deleteGroup(blockGroups.group._id)\" data-dismiss=\"alert\"\r\n              aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a> &nbsp;&nbsp;&nbsp; {{blockGroups.group.order}}\r\n            &nbsp;&nbsp;&nbsp; {{blockGroups.group.name}}\r\n            <div class=\"row blocksdiv\">\r\n              <div id=\"block{{block._id}}\" class=\"blockbtns\" *ngFor=\"let block of blockGroups.blocks\" (click)=\"blockDetail(block._id)\">\r\n                {{block.name}}\r\n              </div>\r\n              <div *ngIf=\"blockGroups.group.isLocked == false\" class=\"addBlock{{blockGroups.group._id}} blockbtns addBlock2\" (click)=\"addBlock(blockGroups.group._id)\">\r\n                <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Block\r\n              </div>\r\n              <div class=\"saveBlock{{blockGroups.group._id}}\" style=\"display:none\">\r\n                <div class=\"input-group\">\r\n                  <input id=\"blockText{{blockGroups.group._id}}\" type=\"text\" class=\"form-control\" [(ngModel)]=\"blockName\" placeholder=\"Block Name\"\r\n                  />\r\n                  <div class=\"input-group-btn\">\r\n                    <button type=\"button\" (click)=\"saveBlock(blockGroups.group._id)\" class=\"btn\"><i class=\"fa fa-plus\"></i></button>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </li>\r\n\r\n        </ul>\r\n        <div class=\"row GroupBtn\">\r\n          <p>\r\n            <button type=\"button\" (click)=\"toggleDivs(1)\" class=\"btn btn-info btn-block\">Add Generic Group</button>\r\n          </p>\r\n        </div>\r\n        <div class=\"row GroupForm\">\r\n          <div class=\"form-group\">\r\n            <div class=\"input-group\">\r\n              <input type=\"text\" [(ngModel)]=\"GroupText\" class=\"form-control\" id=\"bar\">\r\n              <div class=\"input-group-btn\">\r\n                <button type=\"button\" (click)=\"toggleDivs(2)\" class=\"btn\"><i class=\"fa fa-plus\"></i></button>\r\n                <button type=\"button\" (click)=\"refreshTextBox()\" class=\"btn btn-primary\"><i class=\"fa fa-refresh\"></i></button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div id=\"emptyGroup\" style=\"display:none\" class=\"form-group\">\r\n          <div class=\"alert alert-danger alert-sm\">\r\n            <span class=\"fw-semi-bold\">Danger:</span> Please Enter Group Name.\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6 col-sm-12 col-lg-6 col-xs-12 rmdiv\" style=\"display:none\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4 col-lg-4 col-xs-6 col-sm-4\">\r\n            <h4>\r\n              {{popBlockName}}\r\n            </h4>\r\n            <input id=\"popBlockIdd\" type=\"text\" value=\"{{popBlockId}}\" style=\"visibility:hidden\" />\r\n\r\n          </div>\r\n          <div *ngIf=\"isLocked == false\" class=\"col-md-4 col-lg-4 col-xs-6 col-sm-4 offset-md-4\">\r\n            <button class=\"btn btn-danger col-md-12 col-lg-12\" (click)=\"deleteBlock(popBlock._id)\">Delete Block ?</button>\r\n          </div>\r\n        </div>\r\n        <ul class=\"list-group list-group-sortable2 mt-lg\">\r\n          <div *ngFor=\"let card of cardArray; let i = index\">\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'gallery'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row table galleryHorizontalRow\">\r\n\r\n                <div class=\"galleryColumns galleryColumns{{card._id}}\" *ngFor=\"let galleryCard of card.data\">\r\n                  <div class=\"card\">\r\n                    <div class=\"image col-md-12 col-lg-12 col-xs-12 col-sm-1\">\r\n                      <div class=\"image-inner\">\r\n                        <input accept=\"image/*\" [(ngModel)]=\"galleryImageFile\" type=\"file\" id=\"galleryImage{{galleryCard.indexId}}\" (change)=\"populateGalleryImage($event, card._id, card._blockId, galleryCard.indexId)\"\r\n                          style=\"visibility: hidden;\" name=\"files\" title=\"Load File\" />\r\n                        <div id=\"galleryImageBtn{{galleryCard.indexId}}\" *ngIf=\"galleryCard.pictureUrl == ''\">\r\n                          <button (click)=\"openGalleryImage(galleryCard.indexId)\" class=\"button-image col-xs-12 col-sm-12 btn-gray button-image--replace button-image--replace-gallery\">\r\n                            <span class=\"button-image__title\"><i class=\"fa fa-camera\" aria-hidden=\"true\"></i><br/>Upload Image</span>\r\n                          </button>\r\n                        </div>\r\n                        <div id=\"galleryImageDiv{{galleryCard.indexId}}\" *ngIf=\"galleryCard.pictureUrl != ''\" [ngStyle]=\"{ 'background-image': 'url(' + galleryCard.pictureUrl + ')'}\"></div>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"contenttitle\">\r\n                        <textarea id=\"galleryCardTitle{{galleryCard.indexId}}\" maxlength=\"80\" placeholder=\"title\" (change)=\"updateTitleGalleryCard(card._id, galleryCard.indexId)\">{{galleryCard.title}}</textarea>\r\n                      </div>\r\n                      <div class=\"contentbody contenttitle\">\r\n                        <textarea id=\"galleryCardDescription{{galleryCard.indexId}}\" maxlength=\"80\" placeholder=\"description\" (change)=\"updateDescriptionGalleryCard(card._id, galleryCard.indexId)\">{{galleryCard.description}}</textarea>\r\n                      </div>\r\n                      <div class=\"contenturl contenttitle\">\r\n                        <input id=\"galleryCardUrl{{galleryCard.indexId}}\" value=\"{{galleryCard.url}}\" type=\"url\" placeholder=\"Url\" (change)=\"updateUrlGalleryCard(card._id, galleryCard.indexId)\"\r\n                        />\r\n                      </div>\r\n                      <div *ngFor=\"let addButton of galleryCard.cardAddButton\">\r\n                        <div class=\"addbuttonResultList\">\r\n                          <a href=\"#\" class=\"close\" (click)=\"deleteAddButton(addButton._addButtonId, galleryCard.indexId, 'gallery')\" data-dismiss=\"alert\"\r\n                            aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n                          <label>{{addButton.buttonname}}</label>\r\n                          <p>{{addButton.urlblockname}}</p>\r\n                        </div>\r\n                      </div>\r\n                      <div class=\"addbutton\" *ngIf=\"galleryCard.cardAddButton.length != 3\" (click)=\"myModal.open();addButton(galleryCard.indexId, 'gallery', 'addButton')\">\r\n                        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Button\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"top-buttons\">\r\n                      <div class=\"button-remove\">\r\n                        remove\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n                <div class=\"galleryColumns galleryColumns{{card._id}}\">\r\n                  <div class=\"card add\" (click)=\"addGalleryCard(card._id, card._blockId)\">\r\n\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </li>\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'text'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row\">\r\n                <div class=\"col-md-6 col-lg-6 col-xs-12 col-sm-12\">\r\n                  <div class=\"card\">\r\n                    <div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"contenttitle textcard randomTextCard\" *ngFor=\"let text of card.data.randomText; let j = index\">\r\n                        <textarea id=\"textCardTitle{{card._id}}{{text.indexId}}\" *ngIf=\"j!=0\" maxlength=\"80\" placeholder=\"title\" (change)=\"updateTitleRandomTextCard(card._id, text.indexId)\">{{text.text}}</textarea>\r\n                      </div>\r\n                      <div class=\"addbutton\" style=\"border-radius: 0px;\" (click)=\"addTextRandom(card._id)\">\r\n                        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Text Box\r\n                      </div>\r\n                      <div *ngFor=\"let addButton of card.data.cardAddButton\">\r\n                        <div class=\"addbuttonResultList\">\r\n                          <a href=\"#\" class=\"close\" (click)=\"deleteAddButton(addButton._addButtonId, card._id, 'text')\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n                          <label>{{addButton.buttonname}}</label>\r\n                          <p>{{addButton.urlblockname}}</p>\r\n                        </div>\r\n                      </div>\r\n                      <div *ngIf=\"card.data.cardAddButton.length != 3\">\r\n                        <div class=\"addbutton\" *ngIf=\"card.data.quickReplyButton.length == 0\" (click)=\"myModal.open();addButton(card._id, 'text','addButton')\">\r\n                          <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Button\r\n                        </div>\r\n                        <!--<div class=\"or\" *ngIf=\"card.data.cardAddButton.length == 0 && card.data.quickReplyButton.length == 0\">\r\n                          Or\r\n                        </div>\r\n                        <div class=\"addbutton addquickreply\" *ngIf=\"card.data.cardAddButton.length == 0\" (click)=\"yourModal.open();addButton(card._id, 'text','addQuick')\">\r\n                          <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Quick Reply\r\n                        </div>-->\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"top-buttons\">\r\n                      <div class=\"button-remove\">\r\n                        remove\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!--<div class=\"row blocksdivAddQuickReply\">\r\n\r\n                <div class=\"addQuickReplyList addQuickReplyListDisplay\" *ngFor=\"let addButton of card.data.quickReplyButton\">\r\n                  <a href=\"#\" class=\"close\" (click)=\"deleteQuickReply(addButton._addButtonId, card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\">&#10007;</a>\r\n                  <label>{{addButton.buttonname}}</label>\r\n                  <p>{{addButton.urlblockname}}</p>\r\n                </div>\r\n\r\n              </div>-->\r\n            </li>\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'image'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row\">\r\n                <div class=\"col-md-6 col-lg-6 col-xs-12 col-sm-12\">\r\n                  <div class=\"card\">\r\n                    <div class=\"image col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"image-inner2\">\r\n                        <input accept=\"image/*\" type=\"file\" id=\"singleImage{{card._id}}\" (change)=\"populateSingleImage($event, card._id, card._blockId)\"\r\n                          style=\"visibility: hidden;\" name=\"files\" title=\"Load File\" />\r\n                        <div id=\"singleImageBtn{{card._id}}\" *ngIf=\"card.data.pictureUrl == ''\">\r\n                          <button (click)=\"openSingleImage(card._id)\" class=\"button-image button-image2 col-xs-12 col-sm-12 btn-gray button-image--replace button-image--replace-gallery\">\r\n                            <span class=\"button-image__title\"><i class=\"fa fa-camera\" aria-hidden=\"true\"></i><br/>Upload Image</span>\r\n                          </button>\r\n                        </div>\r\n                        <div id=\"singleImageDiv{{card._id}}\" *ngIf=\"card.data.pictureUrl != ''\" [ngStyle]=\"{ 'background-image': 'url(' + card.data.pictureUrl + ')'}\"></div>\r\n                      </div>\r\n                    </div>\r\n                    <!--<div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"addbutton addquickreply addquickreply2\" (click)=\"yourModal.open();addButton(card._id, 'image','addQuick')\">\r\n                        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Quick Reply\r\n                      </div>\r\n                    </div>-->\r\n                    <div class=\"top-buttons\">\r\n                      <div class=\"button-remove\">\r\n                        remove\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!--<div class=\"row blocksdivAddQuickReply\">\r\n\r\n                <div class=\"addQuickReplyList addQuickReplyListDisplay\" *ngFor=\"let addButton of card.data.quickReplyButton\">\r\n                  <a href=\"#\" class=\"close\" (click)=\"deleteQuickReply(addButton._addButtonId, card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\">&#10007;</a>\r\n                  <label>{{addButton.buttonname}}</label>\r\n                  <p>{{addButton.urlblockname}}</p>\r\n                </div>\r\n\r\n              </div>-->\r\n            </li>\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'article'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row\">\r\n                <div class=\"col-md-6 col-lg-6 col-xs-12 col-sm-12\">\r\n                  <!--<div class=\"card col-md-12 col-lg-12 col-xs-12 col-sm-12\">-->\r\n                  <div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                    <div class=\"contenttitle textcard\">\r\n                      <textarea id=\"articleCardTitle{{card._id}}\" maxlength=\"80\" placeholder=\"title\" (change)=\"updateTitleArticleCard(card._id)\">{{card.data.text}}</textarea>\r\n                    </div>\r\n                    <div class=\"addbutton\" (click)=\"openArticleText(card._id);articleModal.open()\">\r\n                      View Article\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n                <!--</div>-->\r\n              </div>\r\n            </li>\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'quickreply'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row\">\r\n                <!--id=\"block{{block._id}}\" *ngFor=\"let block of blockGroups.blocks\" (click)=\"blockDetail(block._id)\" -->\r\n                <div class=\"col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                  <div class=\"QuickReplyButtons qrbtns\" *ngFor=\"let quickReply of card.data.quickReplyBtns\">\r\n                    \r\n                    <div class=\"quickReplyClose\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></div>\r\n                    {{quickReply.buttonname}}\r\n                  </div>\r\n                  <div class=\"QuickReplyButtons QuickReplyButtonsBlack\" (click)=\"yourModal.open();addQuickReplyBtn(card._id)\">\r\n                    <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Quick Reply\r\n                  </div>\r\n                </div>\r\n                <!--</div>-->\r\n              </div>\r\n            </li>\r\n          </div>\r\n        </ul>\r\n        <div class=\"row topmargin\">\r\n          <div class=\"col-md-3 col-lg-3\">\r\n            <legend>\r\n              <span>Add a Card</span>\r\n            </legend>\r\n          </div>\r\n        </div>\r\n        <div class=\"row\">\r\n          <div class=\"col-md-12 col-lg-12\">\r\n            <div class=\"btn-group\">\r\n              <button type=\"button\" (click)=\"addCard(1)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i><br/>Gallery</button>\r\n              <button type=\"button\" (click)=\"addCard(2)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-file-text-o\" aria-hidden=\"true\"></i><br/>Text Card</button>\r\n              <button type=\"button\" (click)=\"addCard(3)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i><br/>Image</button>\r\n              <button type=\"button\" (click)=\"addCard(4)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i><br/>Article</button>\r\n              <button type=\"button\" (click)=\"addCard(5)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-link\" aria-hidden=\"true\"></i><br/>Quick Reply</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6 col-sm-12 col-lg-6 col-xs-12 articleEditor\" style=\"display:none\">\r\n\r\n      </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n<modal #myModal>\r\n  <modal-header>\r\n    <h4 class=\"modal-title text-xs-center fw-bold mt\" id=\"myModalLabel18\">Add Buttons to Response</h4>\r\n    <input id=\"buttonName\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonName\" placeholder=\"Enter Button Name\" style=\"width:88%;margin-left:5%;\"\r\n    />\r\n  </modal-header>\r\n  <modal-content>\r\n    <div class=\"col-md-12 col-lg-12\">\r\n      <ul class=\"addButtonList\">\r\n        <li (click)=\"modalChangeTab(1)\" id=\"blockBtn\" class=\"addButtonListItem modalliactive\"><a class=\"modalliitem\">Blocks</a></li>\r\n        <li (click)=\"modalChangeTab(2)\" id=\"urlBtn\" class=\"addButtonListItem\"><a class=\"modalliitem\">Url</a></li>\r\n      </ul>\r\n      <div class=\"modalContent\">\r\n        <div id=\"blockContent\" class=\"row modalContentActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <select class=\"form-control\" [(ngModel)]=\"AddButtonBlock\" name=\"blocksdd\" id=\"simple-select\">\r\n                  <option selected=\"selected\" value=\"0\">Select Block</option>\r\n                  <option *ngFor=\"let card of select2GroupedData\" value=\"{{card.id}}\">{{card.text}}</option>\r\n                  \r\n                </select>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"addButtonPost(1)\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div id=\"urlContent\" class=\"row modalContentDeActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <input id=\"urlContentData\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonUrl\" placeholder=\"Enter Url\" />\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"addButtonPost(2)\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div id=\"articleContent\" class=\"row modalContentDeActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <input id=\"urlContentData\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonUrl\" placeholder=\"Enter Url\" />\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"addButtonPost(2)\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </modal-content>\r\n  <modal-footer>\r\n  </modal-footer>\r\n</modal>\r\n<modal #yourModal>\r\n  <modal-header>\r\n    <h4 class=\"modal-title text-xs-center fw-bold mt\" id=\"myModalLabel18\">Add Quick Reply</h4>\r\n    <input id=\"buttonName\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonName\" placeholder=\"Enter Button Name\" style=\"width:88%;margin-left:5%;\"\r\n    />\r\n  </modal-header>\r\n  <modal-content>\r\n    <div class=\"col-md-12 col-lg-12\">\r\n      <ul class=\"addButtonList\">\r\n        <li id=\"blockBtn\" class=\"addButtonListItem\"><a class=\"modalliitem\" style=\"padding: 0em 6em;\">Blocks</a></li>\r\n      </ul>\r\n      <div class=\"modalContent\">\r\n        <div id=\"blockContent\" class=\"row modalContentActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <select class=\"form-control\" [(ngModel)]=\"AddButtonBlock\" name=\"blocksdd\" id=\"simple-select\">\r\n                  <option selected=\"selected\" value=\"0\">Select Block</option>\r\n                  <option *ngFor=\"let card of select2GroupedData\" value=\"{{card.id}}\">{{card.text}}</option>   \r\n                </select>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"submitQuickReplyBtns();yourModal.close()\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </modal-content>\r\n  <modal-footer>\r\n  </modal-footer>\r\n</modal>\r\n<modal #articleModal>\r\n  <modal-header>\r\n    <h4 class=\"modal-title text-xs-center fw-bold mt\" id=\"myModalLabel18\">Article for {{articleModalTitle}}</h4>\r\n  </modal-header>\r\n  <modal-content>\r\n    <div class=\"col-md-12 col-lg-12\">\r\n      <div class=\"modalContent\">\r\n        <quill-editor [(ngModel)]=\"ckeditorContent\"></quill-editor>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"submitArticleText();articleModal.close()\">Save</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </modal-content>\r\n  <modal-footer>\r\n  </modal-footer>\r\n</modal>"

/***/ },

/***/ "./src/app/generic/generic.component.scss":
/***/ function(module, exports) {

module.exports = "@charset \"UTF-8\";\n@import url(\"https://fonts.googleapis.com/css?family=Open+Sans\");\nbody {\n  overflow-x: visible; }\n\n/*! Select2 Bootstrap Theme v0.1.0-beta.9 | MIT License | github.com/select2/select2-bootstrap-theme */\n.select2-container--bootstrap {\n  display: block;\n  /*------------------------------------*      #COMMON STYLES\n  \\*------------------------------------*/\n  /**\n   * Search field in the Select2 dropdown.\n   */\n  /**\n   * No outline for all search fields - in the dropdown\n   * and inline in multi Select2s.\n   */\n  /**\n   * Adjust Select2's choices hover and selected styles to match\n   * Bootstrap 3's default dropdown styles.\n   *\n   * @see http://getbootstrap.com/components/#dropdowns\n   */\n  /**\n   * Clear the selection.\n   */\n  /**\n   * Address disabled Select2 styles.\n   *\n   * @see https://select2.github.io/examples.html#disabled\n   * @see http://getbootstrap.com/css/#forms-control-disabled\n   */\n  /*------------------------------------*      #DROPDOWN\n  \\*------------------------------------*/\n  /**\n   * Dropdown border color and box-shadow.\n   */\n  /**\n   * Limit the dropdown height.\n   */\n  /*------------------------------------*      #SINGLE SELECT2\n  \\*------------------------------------*/\n  /*------------------------------------*    #MULTIPLE SELECT2\n  \\*------------------------------------*/\n  /**\n   * Address Bootstrap control sizing classes\n   *\n   * 1. Reset Bootstrap defaults.\n   * 2. Adjust the dropdown arrow button icon position.\n   *\n   * @see http://getbootstrap.com/css/#forms-control-sizes\n   */\n  /* 1 */\n  /*------------------------------------*    #RTL SUPPORT\n  \\*------------------------------------*/ }\n  .select2-container--bootstrap .select2-selection {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    background-color: #fff;\n    border: 1px solid rgba(0, 0, 0, 0.15);\n    border-radius: 0.25rem;\n    color: #555555;\n    font-size: 1rem;\n    outline: 0; }\n    .select2-container--bootstrap .select2-selection.form-control {\n      border-radius: 0.25rem; }\n  .select2-container--bootstrap .select2-search--dropdown .select2-search__field {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    background-color: #fff;\n    border: 1px solid rgba(0, 0, 0, 0.15);\n    border-radius: 0.25rem;\n    color: #555555;\n    font-size: 1rem; }\n  .select2-container--bootstrap .select2-search__field {\n    outline: 0;\n    /* Firefox 18- */\n    /**\n     * Firefox 19+\n     *\n     * @see http://stackoverflow.com/questions/24236240/color-for-styled-placeholder-text-is-muted-in-firefox\n     */ }\n    .select2-container--bootstrap .select2-search__field::-webkit-input-placeholder {\n      color: #999; }\n    .select2-container--bootstrap .select2-search__field:-moz-placeholder {\n      color: #999; }\n    .select2-container--bootstrap .select2-search__field::-moz-placeholder {\n      color: #999;\n      opacity: 1; }\n    .select2-container--bootstrap .select2-search__field:-ms-input-placeholder {\n      color: #999; }\n  .select2-container--bootstrap .select2-results__option {\n    padding: 6px 12px;\n    /**\n     * Disabled results.\n     *\n     * @see https://select2.github.io/examples.html#disabled-results\n     */\n    /**\n     * Hover state.\n     */\n    /**\n     * Selected state.\n     */ }\n    .select2-container--bootstrap .select2-results__option[role=group] {\n      padding: 0; }\n    .select2-container--bootstrap .select2-results__option[aria-disabled=true] {\n      color: #999999;\n      cursor: not-allowed; }\n    .select2-container--bootstrap .select2-results__option[aria-selected=true] {\n      background-color: #f5f5f5;\n      color: #272727; }\n    .select2-container--bootstrap .select2-results__option--highlighted[aria-selected] {\n      background-color: #5d8fc2;\n      color: #fff; }\n    .select2-container--bootstrap .select2-results__option .select2-results__option {\n      padding: 6px 12px; }\n      .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__group {\n        padding-left: 0; }\n      .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option {\n        margin-left: -12px;\n        padding-left: 24px; }\n        .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n          margin-left: -24px;\n          padding-left: 36px; }\n          .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n            margin-left: -36px;\n            padding-left: 48px; }\n            .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n              margin-left: -48px;\n              padding-left: 60px; }\n              .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n                margin-left: -60px;\n                padding-left: 72px; }\n  .select2-container--bootstrap .select2-results__group {\n    color: #999999;\n    display: block;\n    padding: 6px 12px;\n    font-size: 0.875rem;\n    line-height: 1.5;\n    white-space: nowrap; }\n  .select2-container--bootstrap.select2-container--focus .select2-selection, .select2-container--bootstrap.select2-container--open .select2-selection {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(77, 144, 254, 0.6);\n    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n    border-color: #4D90FE; }\n  .select2-container--bootstrap.select2-container--open {\n    /**\n     * Make the dropdown arrow point up while the dropdown is visible.\n     */\n    /**\n     * Handle border radii of the container when the dropdown is showing.\n     */ }\n    .select2-container--bootstrap.select2-container--open .select2-selection .select2-selection__arrow b {\n      border-color: transparent transparent #999 transparent;\n      border-width: 0 4px 4px 4px; }\n    .select2-container--bootstrap.select2-container--open.select2-container--below .select2-selection {\n      border-bottom-right-radius: 0;\n      border-bottom-left-radius: 0;\n      border-bottom-color: transparent; }\n    .select2-container--bootstrap.select2-container--open.select2-container--above .select2-selection {\n      border-top-right-radius: 0;\n      border-top-left-radius: 0;\n      border-top-color: transparent; }\n  .select2-container--bootstrap .select2-selection__clear {\n    color: #999;\n    cursor: pointer;\n    float: right;\n    font-weight: bold;\n    margin-right: 10px; }\n    .select2-container--bootstrap .select2-selection__clear:hover {\n      color: #f8f8f8; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection {\n    border-color: rgba(0, 0, 0, 0.15);\n    box-shadow: none; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection,\n  .select2-container--bootstrap.select2-container--disabled .select2-search__field {\n    cursor: not-allowed; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection,\n  .select2-container--bootstrap.select2-container--disabled .select2-selection--multiple .select2-selection__choice {\n    background-color: #eeeeee; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection__clear,\n  .select2-container--bootstrap.select2-container--disabled .select2-selection--multiple .select2-selection__choice__remove {\n    display: none; }\n  .select2-container--bootstrap .select2-dropdown {\n    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n    border-color: #4D90FE;\n    overflow-x: hidden;\n    margin-top: -1px; }\n    .select2-container--bootstrap .select2-dropdown--above {\n      box-shadow: 0px -6px 12px rgba(0, 0, 0, 0.175);\n      margin-top: 1px; }\n  .select2-container--bootstrap .select2-results > .select2-results__options {\n    max-height: 200px;\n    overflow-y: auto; }\n  .select2-container--bootstrap .select2-selection--single {\n    height: 35px;\n    line-height: 1.5;\n    padding: 6px 24px 6px 12px;\n    /**\n     * Adjust the single Select2's dropdown arrow button appearance.\n     */ }\n    .select2-container--bootstrap .select2-selection--single .select2-selection__arrow {\n      position: absolute;\n      bottom: 0;\n      right: 12px;\n      top: 0;\n      width: 4px; }\n      .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b {\n        border-color: #999 transparent transparent transparent;\n        border-style: solid;\n        border-width: 4px 4px 0 4px;\n        height: 0;\n        left: 0;\n        margin-left: -4px;\n        margin-top: -2px;\n        position: absolute;\n        top: 50%;\n        width: 0; }\n    .select2-container--bootstrap .select2-selection--single .select2-selection__rendered {\n      color: #555555;\n      padding: 0; }\n    .select2-container--bootstrap .select2-selection--single .select2-selection__placeholder {\n      color: #999; }\n  .select2-container--bootstrap .select2-selection--multiple {\n    min-height: 35px;\n    padding: 0;\n    height: auto;\n    /**\n     * Make Multi Select2's choices match Bootstrap 3's default button styles.\n     */\n    /**\n     * Minus 2px borders.\n     */\n    /**\n     * Clear the selection.\n     */ }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__rendered {\n      box-sizing: border-box;\n      display: block;\n      line-height: 1.5;\n      list-style: none;\n      margin: 0;\n      overflow: hidden;\n      padding: 0;\n      width: 100%;\n      text-overflow: ellipsis;\n      white-space: nowrap; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__placeholder {\n      color: #999;\n      float: left;\n      margin-top: 5px; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {\n      color: #555555;\n      background: #f8f8f8;\n      border: 1px solid transparent;\n      border-radius: 0.25rem;\n      cursor: default;\n      float: left;\n      margin: 5px 0 0 6px;\n      padding: 0 6px; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {\n      background: transparent;\n      padding: 0 12px;\n      height: 33px;\n      line-height: 1.5;\n      margin-top: 0;\n      min-width: 5em; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice__remove {\n      color: #999;\n      cursor: pointer;\n      display: inline-block;\n      font-weight: bold;\n      margin-right: 3px; }\n      .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice__remove:hover {\n        color: #f8f8f8; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear {\n      margin-top: 6px; }\n  .select2-container--bootstrap .select2-selection--single.input-sm,\n  .input-group-sm .select2-container--bootstrap .select2-selection--single,\n  .form-group-sm .select2-container--bootstrap .select2-selection--single {\n    border-radius: 0.2rem;\n    font-size: 0.875rem;\n    height: 1.8125rem;\n    line-height: 1.5;\n    padding: 5px 22px 5px 10px;\n    /* 2 */ }\n    .select2-container--bootstrap .select2-selection--single.input-sm .select2-selection__arrow b,\n    .input-group-sm .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b,\n    .form-group-sm .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b {\n      margin-left: -5px; }\n  .select2-container--bootstrap .select2-selection--multiple.input-sm,\n  .input-group-sm .select2-container--bootstrap .select2-selection--multiple,\n  .form-group-sm .select2-container--bootstrap .select2-selection--multiple {\n    min-height: 1.8125rem;\n    border-radius: 0.2rem; }\n    .select2-container--bootstrap .select2-selection--multiple.input-sm .select2-selection__choice,\n    .input-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice,\n    .form-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {\n      font-size: 0.875rem;\n      line-height: 1.5;\n      margin: 4px 0 0 5px;\n      padding: 0 5px; }\n    .select2-container--bootstrap .select2-selection--multiple.input-sm .select2-search--inline .select2-search__field,\n    .input-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field,\n    .form-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {\n      padding: 0 10px;\n      font-size: 0.875rem;\n      height: -0.1875rem;\n      line-height: 1.5; }\n    .select2-container--bootstrap .select2-selection--multiple.input-sm .select2-selection__clear,\n    .input-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear,\n    .form-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear {\n      margin-top: 5px; }\n  .select2-container--bootstrap .select2-selection--single.input-lg,\n  .input-group-lg .select2-container--bootstrap .select2-selection--single,\n  .form-group-lg .select2-container--bootstrap .select2-selection--single {\n    border-radius: 0.3rem;\n    font-size: 1.25rem;\n    height: 3.16667rem;\n    line-height: 1.33333;\n    padding: 10px 28px 10px 16px;\n    /* 1 */ }\n    .select2-container--bootstrap .select2-selection--single.input-lg .select2-selection__arrow,\n    .input-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow,\n    .form-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow {\n      width: 4px; }\n      .select2-container--bootstrap .select2-selection--single.input-lg .select2-selection__arrow b,\n      .input-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b,\n      .form-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b {\n        border-width: 4px 4px 0 4px;\n        margin-left: -4px;\n        margin-left: -10px;\n        margin-top: -2px; }\n  .select2-container--bootstrap .select2-selection--multiple.input-lg,\n  .input-group-lg .select2-container--bootstrap .select2-selection--multiple,\n  .form-group-lg .select2-container--bootstrap .select2-selection--multiple {\n    min-height: 3.16667rem;\n    border-radius: 0.3rem; }\n    .select2-container--bootstrap .select2-selection--multiple.input-lg .select2-selection__choice,\n    .input-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice,\n    .form-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {\n      font-size: 1.25rem;\n      line-height: 1.33333;\n      border-radius: 0.25rem;\n      margin: 9px 0 0 8px;\n      padding: 0 10px; }\n    .select2-container--bootstrap .select2-selection--multiple.input-lg .select2-search--inline .select2-search__field,\n    .input-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field,\n    .form-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {\n      padding: 0 16px;\n      font-size: 1.25rem;\n      height: 1.16667rem;\n      line-height: 1.33333; }\n    .select2-container--bootstrap .select2-selection--multiple.input-lg .select2-selection__clear,\n    .input-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear,\n    .form-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear {\n      margin-top: 10px; }\n  .select2-container--bootstrap .select2-selection.input-lg.select2-container--open .select2-selection--single {\n    /**\n     * Make the dropdown arrow point up while the dropdown is visible.\n     */ }\n    .select2-container--bootstrap .select2-selection.input-lg.select2-container--open .select2-selection--single .select2-selection__arrow b {\n      border-color: transparent transparent #999 transparent;\n      border-width: 0 4px 4px 4px; }\n  .input-group-lg .select2-container--bootstrap .select2-selection.select2-container--open .select2-selection--single {\n    /**\n     * Make the dropdown arrow point up while the dropdown is visible.\n     */ }\n    .input-group-lg .select2-container--bootstrap .select2-selection.select2-container--open .select2-selection--single .select2-selection__arrow b {\n      border-color: transparent transparent #999 transparent;\n      border-width: 0 4px 4px 4px; }\n  .select2-container--bootstrap[dir=\"rtl\"] {\n    /**\n     * Single Select2\n     *\n     * 1. Makes sure that .select2-selection__placeholder is positioned\n     *    correctly.\n     */\n    /**\n     * Multiple Select2\n     */ }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single {\n      padding-left: 24px;\n      padding-right: 12px; }\n      .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__rendered {\n        padding-right: 0;\n        padding-left: 0;\n        text-align: right;\n        /* 1 */ }\n      .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__clear {\n        float: left; }\n      .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow {\n        left: 12px;\n        right: auto; }\n        .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow b {\n          margin-left: 0; }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice,\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__placeholder {\n      float: right; }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n      margin-left: 0;\n      margin-right: 6px; }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice__remove {\n      margin-left: 2px;\n      margin-right: auto; }\n\n/*------------------------------------*  #ADDITIONAL GOODIES\n\\*------------------------------------*/\n/**\n * Address Bootstrap's validation states\n *\n * If a Select2 widget parent has one of Bootstrap's validation state modifier\n * classes, adjust Select2's border colors and focus states accordingly.\n * You may apply said classes to the Select2 dropdown (body > .select2-container)\n * via JavaScript match Bootstraps' to make its styles match.\n *\n * @see http://getbootstrap.com/css/#forms-control-validation\n */\n.has-warning .select2-dropdown,\n.has-warning .select2-selection {\n  border-color: #8a6d3b; }\n\n.has-warning .select2-container--focus .select2-selection,\n.has-warning .select2-container--open .select2-selection {\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n  border-color: #66512c; }\n\n.has-warning.select2-drop-active {\n  border-color: #66512c; }\n  .has-warning.select2-drop-active.select2-drop.select2-drop-above {\n    border-top-color: #66512c; }\n\n.has-error .select2-dropdown,\n.has-error .select2-selection {\n  border-color: #a94442; }\n\n.has-error .select2-container--focus .select2-selection,\n.has-error .select2-container--open .select2-selection {\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n  border-color: #843534; }\n\n.has-error.select2-drop-active {\n  border-color: #843534; }\n  .has-error.select2-drop-active.select2-drop.select2-drop-above {\n    border-top-color: #843534; }\n\n.has-success .select2-dropdown,\n.has-success .select2-selection {\n  border-color: #3c763d; }\n\n.has-success .select2-container--focus .select2-selection,\n.has-success .select2-container--open .select2-selection {\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n  border-color: #2b542c; }\n\n.has-success.select2-drop-active {\n  border-color: #2b542c; }\n  .has-success.select2-drop-active.select2-drop.select2-drop-above {\n    border-top-color: #2b542c; }\n\n/**\n * Select2 widgets in Bootstrap Input Groups\n *\n * When Select2 widgets are combined with other elements using Bootstraps\n * \"Input Group\" component, we don't want specific edges of the Select2\n * container to have a border-radius.\n *\n * Use .select2-bootstrap-prepend and .select2-bootstrap-append on\n * a Bootstrap 3 .input-group to let the contained Select2 widget know which\n * edges should not be rounded as they are directly followed by another element.\n *\n * @see http://getbootstrap.com/components/#input-groups\n */\n/**\n * Mimick Bootstraps .input-group .form-control styles.\n *\n * @see https://github.com/twbs/bootstrap/blob/master/less/input-groups.less\n */\n.input-group .select2-container--bootstrap {\n  display: table;\n  table-layout: fixed;\n  position: relative;\n  z-index: 2;\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n  /**\n   * Adjust z-index like Bootstrap does to show the focus-box-shadow\n   * above appended buttons in .input-group and .form-group.\n   */ }\n  .input-group .select2-container--bootstrap.select2-container--open, .input-group .select2-container--bootstrap.select2-container--focus {\n    z-index: 3; }\n\n.input-group.select2-bootstrap-prepend .select2-container--bootstrap .select2-selection {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.input-group.select2-bootstrap-append .select2-container--bootstrap .select2-selection {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n/**\n * Adjust alignment of Bootstrap buttons in Bootstrap Input Groups to address\n * Multi Select2's height which - depending on how many elements have been selected -\n * may grow taller than its initial size.\n *\n * @see http://getbootstrap.com/components/#input-groups\n */\n.select2-bootstrap-append .select2-container--bootstrap,\n.select2-bootstrap-append .input-group-btn,\n.select2-bootstrap-append .input-group-btn .btn,\n.select2-bootstrap-prepend .select2-container--bootstrap,\n.select2-bootstrap-prepend .input-group-btn,\n.select2-bootstrap-prepend .input-group-btn .btn {\n  vertical-align: top; }\n\n/**\n * Temporary fix for https://github.com/select2/select2-bootstrap-theme/issues/9\n *\n * Provides `!important` for certain properties of the class applied to the\n * original `<select>` element to hide it.\n *\n * @see https://github.com/select2/select2/pull/3301\n * @see https://github.com/fk/select2/commit/31830c7b32cb3d8e1b12d5b434dee40a6e753ada\n */\n.form-control.select2-hidden-accessible {\n  position: absolute !important;\n  width: 1px !important; }\n\n/**\n * Display override for inline forms\n */\n.form-inline .select2-container--bootstrap {\n  display: inline-block; }\n\n.md-editor {\n  display: block;\n  border: 1px solid #ddd; }\n\n.md-editor .md-footer, .md-editor > .md-header {\n  display: block;\n  padding: 6px 4px;\n  background: #f5f5f5; }\n\n.md-editor > .md-header {\n  margin: 0; }\n\n.md-editor > .md-preview {\n  background: #fff;\n  border-top: 1px dashed #ddd;\n  border-bottom: 1px dashed #ddd;\n  min-height: 10px;\n  overflow: auto; }\n\n.md-editor > textarea {\n  font-family: Menlo,Monaco,Consolas,\"Courier New\",monospace;\n  font-size: 14px;\n  outline: 0;\n  margin: 0;\n  display: block;\n  padding: 0;\n  width: 100%;\n  border: 0;\n  border-top: 1px dashed #ddd;\n  border-bottom: 1px dashed #ddd;\n  border-radius: 0;\n  box-shadow: none;\n  background: #eee; }\n\n.md-editor > textarea:focus {\n  box-shadow: none;\n  background: #fff; }\n\n.md-editor.active {\n  border-color: #66afe9;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n\n.md-editor .md-controls {\n  float: right;\n  padding: 3px; }\n\n.md-editor .md-controls .md-control {\n  right: 5px;\n  color: #bebebe;\n  padding: 3px 3px 3px 10px; }\n\n.md-editor .md-controls .md-control:hover {\n  color: #333; }\n\n.md-editor.md-fullscreen-mode {\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 99999;\n  padding: 60px 30px 15px;\n  background: #fff !important;\n  border: 0 !important; }\n\n.md-editor.md-fullscreen-mode .md-footer {\n  display: none; }\n\n.md-editor.md-fullscreen-mode .md-input, .md-editor.md-fullscreen-mode .md-preview {\n  margin: 0 auto !important;\n  height: 100% !important;\n  font-size: 20px !important;\n  padding: 20px !important;\n  color: #999;\n  line-height: 1.6em !important;\n  resize: none !important;\n  box-shadow: none !important;\n  background: #fff !important;\n  border: 0 !important; }\n\n.md-editor.md-fullscreen-mode .md-preview {\n  color: #333;\n  overflow: auto; }\n\n.md-editor.md-fullscreen-mode .md-input:focus, .md-editor.md-fullscreen-mode .md-input:hover {\n  color: #333;\n  background: #fff !important; }\n\n.md-editor.md-fullscreen-mode .md-header {\n  background: 0 0;\n  text-align: center;\n  position: fixed;\n  width: 100%;\n  top: 20px; }\n\n.md-editor.md-fullscreen-mode .btn-group {\n  float: none; }\n\n.md-editor.md-fullscreen-mode .btn {\n  border: 0;\n  background: 0 0;\n  color: #b3b3b3; }\n\n.md-editor.md-fullscreen-mode .btn.active, .md-editor.md-fullscreen-mode .btn:active, .md-editor.md-fullscreen-mode .btn:focus, .md-editor.md-fullscreen-mode .btn:hover {\n  box-shadow: none;\n  color: #333; }\n\n.md-editor.md-fullscreen-mode .md-fullscreen-controls {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  text-align: right;\n  z-index: 1002;\n  display: block; }\n\n.md-editor.md-fullscreen-mode .md-fullscreen-controls a {\n  color: #b3b3b3;\n  clear: right;\n  margin: 10px;\n  width: 30px;\n  height: 30px;\n  text-align: center; }\n\n.md-editor.md-fullscreen-mode .md-fullscreen-controls a:hover {\n  color: #333;\n  text-decoration: none; }\n\n.md-editor.md-fullscreen-mode .md-editor {\n  height: 100% !important;\n  position: relative; }\n\n.md-editor .md-fullscreen-controls {\n  display: none; }\n\n.md-nooverflow {\n  overflow: hidden;\n  position: fixed;\n  width: 100%; }\n\n/**\r\n * Nestable\r\n */\nhtml body {\n  font-family: 'Open Sans', sans-serif; }\n\n.widget2 {\n  background-color: #eeeeee !important; }\n\n.dd {\n  position: relative;\n  display: block;\n  margin: 0;\n  padding: 0;\n  max-width: 600px;\n  list-style: none;\n  font-size: 13px;\n  line-height: 20px; }\n\n.dd-list {\n  display: block;\n  position: relative;\n  margin: 0;\n  padding: 0;\n  list-style: none; }\n\n.dd-list .dd-list {\n  padding-left: 30px; }\n\n.dd-collapsed .dd-list {\n  display: none; }\n\n.dd-item,\n.dd-empty,\n.dd-placeholder {\n  display: block;\n  position: relative;\n  margin: 0;\n  padding: 0;\n  min-height: 20px;\n  font-size: 13px;\n  line-height: 20px; }\n\n.dd-handle {\n  display: block;\n  height: 30px;\n  margin: 5px 0;\n  padding: 5px 10px;\n  color: #555555;\n  text-decoration: none;\n  background: #fff;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-sizing: border-box; }\n\n.dd-item > button {\n  display: block;\n  position: relative;\n  cursor: pointer;\n  float: left;\n  width: 25px;\n  height: 20px;\n  margin: 5px 0;\n  padding: 0;\n  text-indent: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  border: 0;\n  background: transparent;\n  font-size: 12px;\n  line-height: 1;\n  text-align: center;\n  font-weight: bold;\n  color: #555555; }\n  .dd-item > button:focus, .dd-item > button:active {\n    outline: 0; }\n\n.dd-item > button:before {\n  content: '+';\n  display: block;\n  position: absolute;\n  width: 100%;\n  text-align: center;\n  text-indent: 0; }\n\n.dd-item > button[data-action=\"collapse\"]:before {\n  content: '-'; }\n\n.dd-placeholder,\n.dd-empty {\n  margin: 5px 0;\n  padding: 0;\n  min-height: 30px;\n  background: #ddd;\n  border: 1px dashed #999999;\n  box-sizing: border-box;\n  border-radius: 0.25rem; }\n\n.dd-empty {\n  border: 1px dashed #999999;\n  min-height: 100px;\n  background-size: 60px 60px;\n  background-position: 0 0, 30px 30px;\n  background-image: -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);\n  background-image: linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF), linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF); }\n\n.dd-dragel {\n  position: absolute;\n  pointer-events: none;\n  z-index: 9999; }\n\n.dd-dragel > .dd-item .dd-handle {\n  margin-top: 0; }\n\n.dd-dragel .dd-handle {\n  -webkit-box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);\n  box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1); }\n\n/**\r\n * Nestable Extras\r\n */\n.nestable-lists {\n  display: block;\n  clear: both;\n  padding: 30px 0;\n  width: 100%;\n  border: 0;\n  border-top: 2px solid #ddd;\n  border-bottom: 2px solid #ddd; }\n\n@media only screen and (min-width: 700px) {\n  .dd + .dd {\n    margin-left: 2%; } }\n\n.dd-hover > .dd-handle {\n  background: #2ea8e5 !important; }\n\n/**\r\n * Nestable Draggable Handles\r\n */\n.dd3-content {\n  display: block;\n  height: 30px;\n  margin: 5px 0;\n  padding: 5px 10px 5px 40px;\n  color: #333;\n  text-decoration: none;\n  font-weight: bold;\n  border: 1px solid #ccc;\n  background: #fafafa;\n  background: linear-gradient(top, #fafafa 0%, #eee 100%);\n  border-radius: 3px;\n  box-sizing: border-box; }\n\n.dd3-content:hover {\n  color: #2ea8e5;\n  background: #fff; }\n\n.dd-dragel > .dd3-item > .dd3-content {\n  margin: 0; }\n\n.dd3-item > button {\n  margin-left: 30px; }\n\n.dd3-handle {\n  position: absolute;\n  margin: 0;\n  left: 0;\n  top: 0;\n  cursor: pointer;\n  width: 30px;\n  text-indent: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  border: 1px solid #aaa;\n  background: #ddd;\n  background: -webkit-linear-gradient(top, #ddd 0%, #bbb 100%);\n  background: -moz-linear-gradient(top, #ddd 0%, #bbb 100%);\n  background: linear-gradient(top, #ddd 0%, #bbb 100%);\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.dd3-handle:before {\n  content: '≡';\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 3px;\n  width: 100%;\n  text-align: center;\n  text-indent: 0;\n  color: #fff;\n  font-size: 20px;\n  font-weight: normal; }\n\n.button-ver2.trash-popup {\n  position: absolute;\n  z-index: 10000;\n  background-color: #fff;\n  color: black;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);\n  border: 1px solid rgba(0, 0, 0, 0.12);\n  border-radius: 50%;\n  transform: scale(0.3);\n  opacity: 0;\n  transition: transform 0.2s cubic-bezier(0.2, 0.7, 0.5, 1), opacity 0.2s cubic-bezier(0.2, 0.7, 0.5, 1); }\n\n.mini:hover {\n  display: block; }\n\n.trash-popup {\n  top: -6px;\n  right: -6px;\n  left: auto; }\n\n.button-ver2 {\n  width: 20px;\n  height: 20px; }\n\n.button-ver2 {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor: pointer; }\n\n.blocksdiv {\n  padding-top: 2%;\n  padding-left: 15%; }\n\n.divseparator {\n  border-right: 1px solid #eeeeee; }\n\n.list-group-item {\n  font-weight: bold; }\n\nlegend {\n  border-bottom: 0px solid #e5e5e5; }\n\n.blockbtns {\n  font-size: 12px;\n  padding-top: 7px;\n  height: 35px;\n  margin-right: 2%;\n  width: 25%;\n  border: 1px solid #a6a6a6;\n  border-radius: 10%;\n  text-align: center;\n  background-color: #a6a6a6;\n  font-weight: normal;\n  color: white;\n  cursor: pointer;\n  margin-bottom: 2%;\n  position: relative;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\n.dd3-handle:hover {\n  background: #ddd; }\n\n.GroupBtn {\n  padding-left: 3%;\n  padding-top: 3%; }\n\n.GroupForm {\n  padding-left: 3%;\n  padding-top: 3%; }\n\n/***********************************/\n/**      LIST GROUP SORTABLE      **/\n/***********************************/\n.list-group-sortable > .list-group-item {\n  margin-bottom: 0;\n  border-radius: 0.25rem; }\n  .list-group-sortable > .list-group-item + .list-group-item {\n    margin-top: 0.5rem; }\n\n.list-group-sortable > .list-group-item-placeholder {\n  border: 1px dashed #999999;\n  background-color: #ddd; }\n\n.list-group-sortable:last-of-type > .list-group-item:last-child {\n  border-bottom: 1px solid #ddd; }\n\n.list-group-sortable2 > .list-group-item {\n  margin-bottom: 0;\n  border-radius: 0.25rem; }\n  .list-group-sortable2 > .list-group-item + .list-group-item {\n    margin-top: 0.5rem; }\n\n.list-group-sortable2 > .list-group-item-placeholder {\n  border: 1px dashed #999999;\n  background-color: #ddd; }\n\n.list-group-sortable2:last-of-type > .list-group-item:last-child {\n  border-bottom: 1px solid #ddd; }\n\n.image-inner div {\n  height: 144px;\n  background-position: 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  transition: opacity .1s;\n  background-color: #fff;\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px; }\n\n.card-content .content {\n  padding: 3px; }\n\n.contenttitle textarea {\n  height: 54px;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.4;\n  top: -1px;\n  color: #1d1d1d;\n  padding: 2px 6px 0 !important; }\n\n.contenttitle textarea {\n  width: 100%;\n  display: block;\n  padding: 3px 6px 0;\n  background-color: #eee;\n  border: 1px solid transparent;\n  resize: none;\n  transition: border-color .1s;\n  margin: 0;\n  overflow: hidden;\n  white-space: inherit; }\n\n.contenttitle input {\n  width: 100%;\n  display: block;\n  padding: 3px 6px 0;\n  background-color: #eee;\n  border: 1px solid transparent;\n  resize: none;\n  transition: border-color .1s;\n  margin: 0;\n  overflow: hidden;\n  white-space: inherit;\n  font-weight: 600; }\n\ninput:focus {\n  outline: none !important;\n  border: 1px solid #5dc4bf;\n  box-shadow: 0 0 10px #719ECE;\n  border-radius: 7px; }\n\n.image-inner {\n  border-bottom: 1px solid #fff; }\n\n.image-inner2 div {\n  height: 144px;\n  background-position: 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  transition: opacity .1s;\n  background-color: #fff;\n  border-radius: 7px; }\n\ntextarea:focus {\n  outline: none !important;\n  border: 1px solid #5dc4bf;\n  box-shadow: 0 0 10px #719ECE;\n  border-radius: 7px; }\n\n.addbutton {\n  background-color: #eee;\n  font-size: 14px;\n  font-weight: normal;\n  color: #a6a6a6;\n  text-align: center;\n  line-height: 48px;\n  height: 49px;\n  cursor: pointer;\n  text-transform: uppercase;\n  border-bottom-left-radius: 7px;\n  border-bottom-right-radius: 7px; }\n\n::-webkit-input-placeholder {\n  text-align: center; }\n\n.btn-gray {\n  background-color: #eee;\n  border-color: #fff;\n  color: #a6a6a6; }\n\n.list-group-sortable .list-group-item {\n  font-weight: normal;\n  color: #a6a6a6; }\n\n.button-image--replace {\n  background-color: #eee;\n  color: #a6a6a6;\n  font-weight: normal;\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px;\n  background-position: center 51px;\n  width: 100%;\n  height: 144px !important;\n  top: 0 !important;\n  margin: 0;\n  line-height: 65px !important;\n  display: inline-block !important;\n  padding: 0;\n  border: none;\n  outline: none; }\n\n.button-image__title {\n  color: #a6a6a6;\n  font-size: 16px;\n  position: static !important;\n  display: inline-block !important;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: bottom;\n  line-height: 1.43; }\n\n:-moz-placeholder {\n  /* Firefox 18- */\n  text-align: center; }\n\n::-moz-placeholder {\n  /* Firefox 19+ */\n  text-align: center; }\n\n:-ms-input-placeholder {\n  text-align: center; }\n\n.topmargin {\n  margin-top: 5%; }\n\n.button-image:hover {\n  opacity: 1;\n  color: #555555;\n  background-color: #c4c4c4;\n  border-color: #fff; }\n\n.addbutton:hover {\n  opacity: 1;\n  color: #555555;\n  background-color: #c4c4c4;\n  border-color: #fff; }\n\n.contenturl {\n  border-bottom: 1px solid #fff; }\n\n.top-buttons {\n  position: absolute;\n  right: -8px;\n  top: -28px;\n  height: 27px;\n  width: 271px;\n  text-align: right;\n  opacity: 1;\n  transition: opacity .1s;\n  -webkit-transition: opacity .1s;\n  white-space: nowrap;\n  padding: 0 4px 0 0;\n  z-index: 10; }\n\n.button-remove {\n  top: 21px;\n  left: 238px;\n  position: absolute;\n  margin: 0;\n  width: 32px;\n  height: 32px;\n  background: #fff none;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 16px;\n  transform: scale(0.3);\n  opacity: 0;\n  transition: opacity 0.2s cubic-bezier(0.2, 0.7, 0.5, 1), transform 0.2s cubic-bezier(0.2, 0.7, 0.5, 1); }\n\n.top-buttons .button.remove::before {\n  content: \"\";\n  position: absolute;\n  background: url(assets/img/download.png) 50% no-repeat;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 31px;\n  opacity: .3;\n  transition: opasity 60ms; }\n\n.card.add::after {\n  content: \" \";\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  vertical-align: middle;\n  background: url(assets/img/plus.png) no-repeat 50%;\n  opacity: .3; }\n\n.card.add {\n  width: 85%;\n  margin-top: 8%;\n  height: 333px;\n  line-height: 333px;\n  text-align: center;\n  cursor: pointer;\n  border: 1px solid;\n  border-color: #fff;\n  background-color: #eee; }\n\n.textcard textarea {\n  background-color: white;\n  border: 1px solid #ddd;\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px; }\n\n.list-group-sortable2 .list-group-item {\n  cursor: move;\n  margin: 5px; }\n\n.or {\n  height: 24px;\n  font-size: 12px;\n  line-height: 24px;\n  text-align: center;\n  color: #a6a6a6;\n  text-transform: uppercase; }\n\n.addquickreply {\n  border-radius: 20px;\n  height: 40px;\n  line-height: 40px; }\n\n.addquickreply {\n  font-size: 14px;\n  font-weight: normal;\n  text-align: center;\n  padding: 0;\n  outline: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-transform: uppercase;\n  border-bottom-color: rgba(0, 0, 0, 0.17);\n  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.13);\n  transition: box-shadow 80ms ease 0s,border-top-color 80ms ease 0s,border-right-color 80ms ease 0s,border-bottom-color 80ms ease 0s,border-left-color 80ms ease 0s,background-color 80ms ease 0s; }\n\n.button-image2 {\n  border-radius: 7px; }\n\n.addquickreply2 {\n  margin-top: 5%; }\n\n.btn-info {\n  background-color: #a6a6a6;\n  border-color: #a6a6a6; }\n\n.galleryHorizontalRow {\n  display: -webkit-inline-box;\n  overflow-x: scroll;\n  padding-bottom: 10%; }\n\n.galleryColumns {\n  width: 50%; }\n\n.galleryHorizontalRow::-webkit-scrollbar {\n  width: 2px;\n  height: 5px; }\n\n.galleryHorizontalRow::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n  border-radius: 7px; }\n\n.galleryHorizontalRow::-webkit-scrollbar-thumb {\n  border-radius: 7px;\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); }\n\n.list-group-item {\n  border-bottom: 1px solid #ddd !important; }\n\n.addBlock2 {\n  background-color: #eee;\n  border-color: #fff;\n  color: #a6a6a6; }\n\n.blockactive {\n  background-color: #053748; }\n\n.addButtonList {\n  padding: 0;\n  list-style: none;\n  display: table;\n  table-layout: fixed;\n  width: 100%; }\n\n.addButtonListItem {\n  display: inline;\n  display: table-cell;\n  padding: 0em 4.5em;\n  cursor: pointer; }\n\n.modalliactive {\n  border: 1px solid #ddd;\n  border-bottom: none;\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  background-color: #ddd; }\n\n.modalliitem {\n  font-weight: 600;\n  font-size: 14px;\n  color: #a6a6a6; }\n\n.modal-dialog {\n  max-width: 400px !important;\n  margin: 30px auto; }\n\n.modalContentActive {\n  display: block; }\n\n.modalContentDeActive {\n  display: none; }\n\n/**\r\n * select2\r\n */\n.select2-container .select2-choice abbr {\n  background: url(\"assets/select2/select2.png\") right top no-repeat; }\n\n.select2-container .select2-choice .select2-arrow b {\n  background: url(\"assets/select2/select2.png\") no-repeat 0 1px; }\n\n.select2-search input {\n  background: #fff url(\"assets/select2/select2.png\") no-repeat 100% -22px;\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, -webkit-gradient(linear, left bottom, left top, color-stop(0.85, #fff), color-stop(0.99, #eee));\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, -webkit-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, -moz-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, linear-gradient(to bottom, #fff 85%, #eee 99%) 0 0; }\n\nhtml[dir=\"rtl\"] .select2-search input {\n  background: #fff url(\"assets/select2/select2.png\") no-repeat -37px -22px;\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, -webkit-gradient(linear, left bottom, left top, color-stop(0.85, #fff), color-stop(0.99, #eee));\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, -webkit-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, -moz-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, linear-gradient(to bottom, #fff 85%, #eee 99%) 0 0; }\n\n.select2-search-choice-close {\n  background: url(\"assets/select2/select2.png\") right top no-repeat; }\n\n.select2-search input.select2-active {\n  background: #fff url(\"assets/select2/select2-spinner.gif\") no-repeat 100%;\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, -webkit-gradient(linear, left bottom, left top, color-stop(0.85, #fff), color-stop(0.99, #eee));\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, -webkit-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, -moz-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, linear-gradient(to bottom, #fff 85%, #eee 99%) 0 0; }\n\n.select2-more-results.select2-active {\n  background: #f4f4f4 url(\"assets/select2/select2-spinner.gif\") no-repeat 100%; }\n\n.select2-container-multi .select2-choices .select2-search-field input.select2-active {\n  background: #fff url(\"assets/select2/select2-spinner.gif\") no-repeat 100% !important; }\n\n.select2-container .select2-selection--single .select2-selection__rendered {\n  color: #555555;\n  padding: 0; }\n\n.addbuttonResultList {\n  background-color: #eeeeee;\n  text-align: center;\n  margin-bottom: -13px; }\n\n.addQuickReplyList {\n  background-color: #eeeeee;\n  text-align: center;\n  margin-bottom: -13px; }\n\n.modalError {\n  border: 1px solid red; }\n\n.addQuickReplyListDisplay {\n  padding: 3px 3% 0 3%;\n  height: 55px;\n  margin-right: 2%;\n  border: 1px solid #053748;\n  border-radius: 10%;\n  text-align: center;\n  font-weight: normal;\n  color: black;\n  cursor: pointer;\n  margin-bottom: 2%;\n  position: relative;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);\n  background-color: white;\n  transition: padding .1s; }\n\n.blocksdivAddQuickReply {\n  padding-top: 2%;\n  padding-left: 7%; }\n\n.articleEditor {\n  padding: 2%; }\n\n.md-editor > textarea {\n  background-color: white; }\n\n.image-inner2 div:hover {\n  opacity: 0.2;\n  background-color: black; }\n\n.QuickReplyButtons {\n  display: inline-block;\n  font-size: 12px;\n  padding-top: 7px;\n  padding-left: 2%;\n  padding-right: 2%;\n  height: 35px;\n  margin-right: 2%;\n  border: 1px solid #a6a6a6;\n  border-radius: 10%;\n  text-align: center;\n  background-color: white;\n  font-weight: normal;\n  color: #a6a6a6;\n  cursor: pointer;\n  margin-bottom: 2%;\n  position: relative;\n  white-space: nowrap;\n  overflow: hidden; }\n\n.QuickReplyButtonsBlack {\n  color: white;\n  background-color: #a6a6a6; }\n\n.quickReplyClose {\n  position: absolute;\n  left: auto;\n  right: -6px;\n  font-size: 1.5rem;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  width: 28px;\n  height: 28px;\n  background-color: #fff; }\n"

/***/ },

/***/ "./src/app/generic/generic.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var BotTrainingService_1 = __webpack_require__("./src/app/services/BotTrainingService.ts");
var Card_1 = __webpack_require__("./src/app/models/Card.ts");
var ImageCard_1 = __webpack_require__("./src/app/models/ImageCard.ts");
var TextCard_1 = __webpack_require__("./src/app/models/TextCard.ts");
var GalleryCard_1 = __webpack_require__("./src/app/models/GalleryCard.ts");
var CardAddButton_1 = __webpack_require__("./src/app/models/CardAddButton.ts");
var ArticleCard_1 = __webpack_require__("./src/app/models/ArticleCard.ts");
var QuickReplyCard_1 = __webpack_require__("./src/app/models/QuickReplyCard.ts");
var core_2 = __webpack_require__("./node_modules/@angular/core/index.js");
var ng2_modal_1 = __webpack_require__("./node_modules/ng2-modal/index.js");
//select2GroupedData: Select2OptionData[] = [];
var Generic = (function () {
    function Generic(_botTrainingService, _rootNode) {
        this._botTrainingService = _botTrainingService;
        this._rootNode = _rootNode;
        this.baseUrl = "https://aprilappserver-staging.azurewebsites.net/";
        this.select2GroupedData = [];
        this.GroupText = "";
        this.groups = [];
        this.blockGroupsModel = [];
        this.popBlockName = "Block Name";
        this.AddButtonBlock = "";
        this.AddButtonName = "";
        this.AddButtonUrl = "";
        this.addButtonResponseMessageType = "";
        this.articleText = "";
        this.ckeditorContent = "";
        this.articleModalTitle = "";
        this.articleResponseId = "";
        this.quickResponseMessageId = "";
        this.sortOptions = {
            placeholder: 'list-group-item list-group-item-placeholder',
            forcePlaceholderSize: true
        };
        this.nest1Options = { group: 1 };
        this.nest2Options = { group: 1 };
        this.galleryCardArray = [];
        this.cardArray = [];
        this.populateGroups();
        this.populateBlocksDropdown();
    }
    Generic.prototype.updateTitleRandomTextCard = function (responseMessageId, i) {
        this._botTrainingService.updateRandomTitleText(responseMessageId, jQuery('#textCardTitle' + responseMessageId + i).val(), i).subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Generic.prototype.addTextRandom = function (responseMessageId) {
        var _this = this;
        var count = jQuery('.randomTextCard').length + 1;
        this._botTrainingService.addRandomText(responseMessageId, count).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(_this.popBlock._id);
            }
        });
    };
    Generic.prototype.deleteQuickReply = function (addButtonId, parentId) {
        var _this = this;
        this._botTrainingService.deleteQuickReply(addButtonId, parentId).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(_this.popBlock._id);
            }
        });
    };
    Generic.prototype.deleteAddButton = function (addButtonId, parentId, type) {
        var _this = this;
        this._botTrainingService.deleteAddButton(addButtonId, parentId, type).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(_this.popBlock._id);
            }
        });
    };
    Generic.prototype.deleteResponseMessage = function (resMesId) {
        var _this = this;
        this._botTrainingService.deleteResponseMessage(resMesId).subscribe(function (a) {
            if (a.code == 200) {
                for (var i = 0; i < _this.cardArray.length; i++) {
                    var obj = _this.cardArray[i];
                    if (obj._id == resMesId) {
                        _this.cardArray.splice(i, 1);
                    }
                }
            }
        });
    };
    Generic.prototype.populateBlocksDropdown = function () {
        var _this = this;
        this._botTrainingService.getAllGroups('Generic').subscribe(function (a) {
            if (a.code == 200) {
                for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                    if (_this.blockGroupsModel[i].blocks.length > 0) {
                        for (var j = 0; j < _this.blockGroupsModel[i].blocks.length; j++) {
                            _this.select2GroupedData.push({ id: _this.blockGroupsModel[i].blocks[j]._id, text: _this.blockGroupsModel[i].blocks[j].name });
                        }
                    }
                }
            }
        });
    };
    Generic.prototype.addButtonPost = function (val) {
        var _this = this;
        if (val == 1) {
            var count = 0;
            var blockname = "";
            for (var i = 0; i < this.select2GroupedData.length; i++) {
                if (this.select2GroupedData[i].id == this.AddButtonBlock) {
                    blockname = this.select2GroupedData[i].text;
                }
            }
            if (this.responseMessageDiff == 'addButton') {
                var cardAddButton = new CardAddButton_1.CardAddButton(this.AddButtonName, blockname, this.AddButtonBlock, "");
                count = jQuery('.addbuttonResultList').length;
            }
            else {
                //Add Quick Reply
                var cardAddButton = new CardAddButton_1.CardAddButton(this.AddButtonName, blockname, this.AddButtonBlock, "");
                count = jQuery('.addQuickReplyList').length;
            }
            if (this.AddButtonBlock != "" && this.AddButtonName != "") {
                jQuery('#buttonName').removeClass('modalError');
                jQuery('#simple-select').removeClass('modalError');
                if (this.responseMessageDiff == 'addButton') {
                    this._botTrainingService.addAddButton(this.addButtonResponseMessageId, cardAddButton, this.addButtonResponseMessageType, count).subscribe(function (a) {
                        if (a.code == 200) {
                            _this.AddButtonName = "";
                            _this.AddButtonBlock = "";
                            _this.blockDetail(_this.popBlock._id);
                            _this.modalComponent.close();
                        }
                    });
                }
                else {
                }
            }
            else {
                jQuery('#buttonName').addClass('modalError');
                jQuery('#simple-select').addClass('modalError');
            }
        }
        else {
            var cardAddButton = new CardAddButton_1.CardAddButton(this.AddButtonName, this.AddButtonUrl, "", "");
            if (this.AddButtonUrl != "" && this.AddButtonName != "") {
                jQuery('#buttonName').removeClass('modalError');
                jQuery('#urlContentData').removeClass('modalError');
                this._botTrainingService.addAddButton(this.addButtonResponseMessageId, cardAddButton, this.addButtonResponseMessageType, jQuery('.addbuttonResultList').length).subscribe(function (a) {
                    if (a.code == 200) {
                        _this.AddButtonName = "";
                        _this.AddButtonUrl = "";
                        _this.blockDetail(_this.popBlock._id);
                        _this.modalComponent.close();
                    }
                });
            }
            else {
                jQuery('#buttonName').addClass('modalError');
                jQuery('#urlContentData').addClass('modalError');
            }
        }
    };
    Generic.prototype.addButton = function (responseMessageId, type, diff) {
        this.responseMessageDiff = diff;
        if (diff == 'addButton') {
            jQuery('#blockContent').css('display', 'block');
            jQuery('#quickReplyContent').css('display', 'none');
        }
        else {
            jQuery('#blockContent').css('display', 'none');
            jQuery('#quickReplyContent').css('display', 'block');
        }
        this.addButtonResponseMessageType = type;
        this.addButtonResponseMessageId = responseMessageId;
    };
    Generic.prototype.getSelect2DefaultList = function () {
        return this.select2GroupedData;
    };
    Generic.prototype.modalChangeTab = function (val) {
        if (val == 2) {
            jQuery('#blockBtn').removeClass('modalliactive');
            jQuery('#urlBtn').addClass('modalliactive');
            jQuery('#blockContent').removeClass('modalContentActive');
            jQuery('#blockContent').addClass('modalContentDeActive');
            jQuery('#urlContent').addClass('modalContentActive');
            jQuery('#urlContent').removeClass('modalContentDeActive');
        }
        else {
            jQuery('#blockBtn').addClass('modalliactive');
            jQuery('#urlBtn').removeClass('modalliactive');
            jQuery('#blockContent').addClass('modalContentActive');
            jQuery('#blockContent').removeClass('modalContentDeActive');
            jQuery('#urlContent').removeClass('modalContentActive');
            jQuery('#urlContent').addClass('modalContentDeActive');
        }
    };
    //Card Functions
    Generic.prototype.addQuickReplyBtn = function (Id) {
        this.quickResponseMessageId = Id;
    };
    Generic.prototype.submitQuickReplyBtns = function () {
        var _this = this;
        console.log(this.quickResponseMessageId);
        console.log(this.AddButtonName);
        console.log(this.AddButtonBlock);
        var count = jQuery('.qrbtns').length;
        this._botTrainingService.addQuickReply(this.quickResponseMessageId, this.AddButtonName, this.AddButtonBlock, count).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(_this.popBlock._id);
            }
        });
    };
    Generic.prototype.submitArticleText = function () {
        var _this = this;
        if (this.ckeditorContent !== undefined && this.ckeditorContent != "" && this.ckeditorContent != null) {
            this._botTrainingService.updateArticleText(this.articleResponseId, this.ckeditorContent).subscribe(function (a) {
                if (a.code == 200) {
                    _this.blockDetail(_this.popBlock._id);
                }
            });
        }
    };
    Generic.prototype.openArticleText = function (Id) {
        this.articleResponseId = Id;
        for (var j = 0; j < this.cardArray.length; j++) {
            if (this.cardArray[j]._id == Id) {
                var text = this.cardArray[j].data.articleText;
                this.ckeditorContent = text;
                this.articleModalTitle = this.cardArray[j].data.text;
                break;
            }
        }
    };
    Generic.prototype.updateTitleArticleCard = function (responseMessageId) {
        this._botTrainingService.updateTitleText(responseMessageId, jQuery('#articleCardTitle' + responseMessageId).val(), 0, 'article').subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Generic.prototype.updateTitleTextCard = function (responseMessageId) {
        this._botTrainingService.updateTitleText(responseMessageId, jQuery('#textCardTitle' + responseMessageId).val(), 0, 'text').subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Generic.prototype.updateTitleGalleryCard = function (responseMessageId, indexId) {
        this._botTrainingService.updateTitleText(responseMessageId, jQuery('#galleryCardTitle' + indexId).val(), indexId, 'gallery').subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Generic.prototype.updateDescriptionGalleryCard = function (responseMessageId, indexId) {
        this._botTrainingService.updateDescriptionText(responseMessageId, jQuery('#galleryCardDescription' + indexId).val(), indexId).subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Generic.prototype.updateUrlGalleryCard = function (responseMessageId, indexId) {
        this._botTrainingService.updateUrlText(responseMessageId, jQuery('#galleryCardUrl' + indexId).val(), indexId).subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Generic.prototype.openGalleryImage = function (Id) {
        jQuery('#galleryImage' + Id).click();
    };
    Generic.prototype.openSingleImage = function (Id) {
        jQuery('#singleImage' + Id).click();
    };
    Generic.prototype.populateGalleryImage = function (event, responseMessageId, blockId, indexId) {
        var _this = this;
        var file = event.target.files[0];
        this._botTrainingService.getPictureUrl(file, responseMessageId, "gallery", indexId).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(blockId);
            }
        });
    };
    Generic.prototype.populateSingleImage = function (event, responseMessageId, blockId) {
        var _this = this;
        var file = event.target.files[0];
        this._botTrainingService.getPictureUrl(file, responseMessageId, "image", -1).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(blockId);
            }
        });
    };
    ///
    Generic.prototype.addBlock = function (Id) {
        jQuery('.addBlock' + Id).hide();
        jQuery('.saveBlock' + Id).show();
    };
    Generic.prototype.addGalleryCard = function (resMesId, blockId) {
        var _this = this;
        this.galleryCard = new GalleryCard_1.GalleryCard("", "", "", "", [], jQuery('.galleryColumns' + resMesId).length);
        //this.card = new Card("gallery", this.galleryCard);
        this._botTrainingService.addGalleryCard(this.galleryCard, resMesId).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(blockId);
            }
        });
    };
    Generic.prototype.saveBlock = function (Id) {
        var _this = this;
        jQuery('#blockText' + Id).css('border', '1px solid rgba(0, 0, 0, 0.15);');
        if (this.blockName != "" && this.blockName !== undefined) {
            this._botTrainingService.addBlocks(this.blockName, 'Generic', Id).subscribe(function (a) {
                if (a.code == 200) {
                    jQuery('.addBlock' + Id).show();
                    jQuery('.saveBlock' + Id).hide();
                    _this.blockName = "";
                    _this.addedBlock = a.data;
                    for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                        if (_this.blockGroupsModel[i].group._id == Id) {
                            _this.blockGroupsModel[i].blocks.push(_this.addedBlock);
                            break;
                        }
                    }
                }
            });
        }
        else {
            jQuery('#blockText' + Id).css('border', '1px solid red');
        }
    };
    Generic.prototype.deleteBlock = function (Id) {
        var _this = this;
        jQuery('.rmdiv').hide();
        this._botTrainingService.deleteBlock(Id)
            .subscribe(function (a) {
            if (a.code == 200) {
                for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                    for (var j = 0; j < _this.blockGroupsModel[i].blocks.length; j++) {
                        if (_this.blockGroupsModel[i].blocks[j]._id == Id) {
                            _this.blockGroupsModel[i].blocks.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        });
    };
    Generic.prototype.blockDetail = function (Id) {
        jQuery('.blockbtns').removeClass("blockactive");
        jQuery('#block' + Id).addClass("blockactive");
        this.populateResponseMessages(Id);
    };
    Generic.prototype.populateResponseMessages = function (Id) {
        var _this = this;
        this._botTrainingService.getAllResponseMessages(Id).subscribe(function (a) {
            if (a.code == 200) {
                _this.cardArray = [];
                _this.popBlock = a.data.block;
                _this.cardArray = a.data.responseMessages;
                _this.popBlockName = _this.popBlock.name;
                _this.isLocked = _this.popBlock.isLocked;
                console.log(_this.cardArray);
                jQuery('.rmdiv').show();
            }
        });
    };
    Generic.prototype.addCard = function (val) {
        var _this = this;
        if (val == 1) {
            //Gallery
            this.galleryCard = new GalleryCard_1.GalleryCard("", "", "", "", [], 1);
            this.card = new Card_1.Card("gallery", this.galleryCard);
            var galleryCardArray = [];
            galleryCardArray.push(this.galleryCard);
            this._botTrainingService.addResponseMessage(galleryCardArray, "gallery", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
        else if (val == 2) {
            //TextCard
            var obj = {
                'indexId': 1,
                'text': ''
            };
            var tempArray = [];
            tempArray.push(obj);
            this.textCard = new TextCard_1.TextCard(tempArray, [], []);
            this.card = new Card_1.Card("text", this.textCard);
            this._botTrainingService.addResponseMessage(this.textCard, "text", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
        else if (val == 3) {
            //Image
            this.imageCard = new ImageCard_1.ImageCard("", []);
            this.card = new Card_1.Card("image", this.imageCard);
            this._botTrainingService.addResponseMessage(this.imageCard, "image", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
        else if (val == 4) {
            //Article
            this.articleCard = new ArticleCard_1.ArticleCard("", "");
            this.card = new Card_1.Card("image", this.articleCard);
            this._botTrainingService.addResponseMessage(this.articleCard, "article", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
        else if (val == 5) {
            //Quick Reply
            this.quickReplyCard = new QuickReplyCard_1.QuickReplyCard([]);
            this.card = new Card_1.Card("quickreply", this.quickReplyCard);
            this._botTrainingService.addResponseMessage(this.quickReplyCard, "quickreply", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
    };
    Generic.prototype.ngOnInit = function () {
        jQuery('.nav-tabs').on('shown.bs.tab', 'a', function (e) {
            if (e.relatedTarget) {
                jQuery(e.relatedTarget).removeClass('active');
            }
        });
        var oldIndex;
        jQuery('#popover2').popover();
        jQuery('.GroupBtn').show();
        jQuery('.GroupForm').hide();
        jQuery('.list-group-sortable').sortable(this.sortOptions);
        jQuery('.list-group-sortable2').sortable(this.sortOptions);
        jQuery('#nestable1').nestable(this.nest1Options);
        jQuery('#nestable2').nestable(this.nest2Options);
        jQuery(".list-group-sortable").sortable({
            start: function (event, ui) {
                oldIndex = ui.item.index() + 1;
                jQuery(this).attr('data-previndex', ui.item[0].id);
            },
            update: function (e, ui) {
                // gets the new and old index then removes the temporary attribute
                var newIndex = ui.item.index() + 1;
                var groupId = jQuery(this).attr('data-previndex');
                jQuery.post("https://aprilappserver-staging.azurewebsites.net/responsemessage/sortingOfResponseMessages", {
                    oldIndex: oldIndex,
                    newIndex: newIndex,
                    groupId: groupId
                }, function (data, status) {
                });
                jQuery(this).removeAttr('data-previndex');
            }
        });
        //sorting of response messages
        jQuery(".list-group-sortable2").sortable({
            start: function (event, ui) {
                oldIndex = ui.item.index() + 1;
                var array = ui.item[0].childNodes;
                var id;
                array.forEach(function (entry) {
                    if (entry.id !== undefined) {
                        id = entry.id;
                    }
                });
                jQuery(this).attr('data-previndex', id);
                console.log(oldIndex);
            },
            update: function (e, ui) {
                // gets the new and old index then removes the temporary attribute
                var newIndex = ui.item.index() + 1;
                var groupId = jQuery(this).attr('data-previndex');
                jQuery.post("https://aprilappserver-staging.azurewebsites.net/responsemessage/sortingOfResponseMessages", {
                    oldIndex: oldIndex,
                    newIndex: newIndex,
                    groupId: groupId
                }, function (data, status) {
                });
                jQuery(this).removeAttr('data-previndex');
            }
        });
    };
    Generic.prototype.toggleDivs = function (val) {
        var _this = this;
        if (val == 1) {
            jQuery('.GroupBtn').fadeOut("slow");
            jQuery('.GroupForm').fadeIn("slow");
        }
        else {
            jQuery('#emptyGroup').hide();
            if (this.GroupText != "") {
                this._botTrainingService.addGroup(this.GroupText, 'Generic').subscribe(function (a) {
                    if (a.code == 200) {
                        _this.populateGroups();
                        _this.GroupText = "";
                    }
                });
            }
            else {
                jQuery('#emptyGroup').fadeIn("slow");
            }
        }
    };
    Generic.prototype.populateGroups = function () {
        var _this = this;
        this._botTrainingService.getAllGroups('Generic')
            .subscribe(function (a) {
            if (a.code == 200) {
                _this.blockGroupsModel = a.data;
                _this.blockGroupsModel.sort(function (a, b) {
                    return a.group.order - b.group.order;
                });
                if (_this.blockGroupsModel.length != 0) {
                    for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                        if (_this.blockGroupsModel[i].blocks.length > 0) {
                            _this.popBlock = _this.blockGroupsModel[i].blocks[0];
                            _this.popBlockId = _this.popBlock._id;
                            break;
                        }
                    }
                }
                console.log(a);
            }
        });
    };
    Generic.prototype.deleteGroup = function (val) {
        var _this = this;
        this._botTrainingService.deleteGroup(val)
            .subscribe(function (a) {
            if (a.code == 200) {
                _this.populateGroups();
            }
        });
    };
    Generic.prototype.refreshTextBox = function () {
        this.GroupText = "";
    };
    __decorate([
        core_1.ViewChild('myModal'), 
        __metadata('design:type', (typeof (_a = typeof ng2_modal_1.Modal !== 'undefined' && ng2_modal_1.Modal) === 'function' && _a) || Object)
    ], Generic.prototype, "modalComponent", void 0);
    __decorate([
        core_1.ViewChild('yourModal'), 
        __metadata('design:type', (typeof (_b = typeof ng2_modal_1.Modal !== 'undefined' && ng2_modal_1.Modal) === 'function' && _b) || Object)
    ], Generic.prototype, "modalComponent2", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], Generic.prototype, "GroupText", void 0);
    Generic = __decorate([
        core_1.Component({
            selector: '[generic]',
            template: __webpack_require__("./src/app/generic/generic.component.html"),
            providers: [BotTrainingService_1.BotTrainingService],
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [__webpack_require__("./src/app/generic/generic.component.scss"), './../forms/elements/elements.style.css']
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof BotTrainingService_1.BotTrainingService !== 'undefined' && BotTrainingService_1.BotTrainingService) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _d) || Object])
    ], Generic);
    return Generic;
    var _a, _b, _c, _d;
}());
exports.Generic = Generic;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/generic/generic.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
__webpack_require__("./node_modules/messenger/build/js/messenger.js");
__webpack_require__("./node_modules/jquery-ui/ui/sortable.js");
__webpack_require__("./node_modules/jquery.nestable/jquery.nestable.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var ng2_bootstrap_1 = __webpack_require__("./node_modules/ng2-bootstrap/ng2-bootstrap.js");
var ng2_bootstrap_2 = __webpack_require__("./node_modules/ng2-bootstrap/ng2-bootstrap.js");
var ng2_bootstrap_3 = __webpack_require__("./node_modules/ng2-bootstrap/ng2-bootstrap.js");
var ng2_modal_1 = __webpack_require__("./node_modules/ng2-modal/index.js");
var generic_component_1 = __webpack_require__("./src/app/generic/generic.component.ts");
var widget_module_1 = __webpack_require__("./src/app/layout/widget/widget.module.ts");
var ng2_select2_1 = __webpack_require__("./node_modules/ng2-select2/ng2-select2.js");
//import { CKEditorModule } from 'ng2-ckeditor';
var quill_module_1 = __webpack_require__("./src/app/directory/quill/quill.module.ts");
exports.routes = [
    { path: '', component: generic_component_1.Generic, pathMatch: 'full' }
];
var GenericModule = (function () {
    function GenericModule() {
    }
    GenericModule.routes = exports.routes;
    GenericModule = __decorate([
        core_1.NgModule({
            declarations: [
                // Components / Directives/ Pipes
                generic_component_1.Generic,
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule.forChild(exports.routes),
                ng2_bootstrap_1.AlertModule,
                widget_module_1.WidgetModule,
                ng2_bootstrap_1.TooltipModule,
                ng2_modal_1.ModalModule,
                ng2_bootstrap_2.ButtonsModule,
                ng2_bootstrap_2.DropdownModule,
                ng2_bootstrap_3.TabsModule,
                ng2_bootstrap_3.AccordionModule,
                ng2_select2_1.Select2Module,
                quill_module_1.QuillModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], GenericModule);
    return GenericModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GenericModule;


/***/ },

/***/ "./src/app/layout/widget/widget.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Widget = (function () {
    function Widget(el) {
        this.$el = jQuery(el.nativeElement);
        jQuery.fn.widgster.Constructor.DEFAULTS.bodySelector = '.widget-body';
        /*
         When widget is closed remove its parent if it is .col-*
         */
        jQuery(document).on('close.widgster', function (e) {
            var $colWrap = jQuery(e.target)
                .closest('.content > .row > [class*="col-"]:not(.widget-container)');
            // remove colWrap only if there are no more widgets inside
            if (!$colWrap.find('.widget').not(e.target).length) {
                $colWrap.remove();
            }
        });
    }
    Widget.prototype.ngOnInit = function () {
        this.$el.widgster();
    };
    Widget = __decorate([
        core_1.Directive({
            selector: '[widget]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], Widget);
    return Widget;
    var _a;
}());
exports.Widget = Widget;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/layout/widget/widget.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var widget_directive_1 = __webpack_require__("./src/app/layout/widget/widget.directive.ts");
var WidgetModule = (function () {
    function WidgetModule() {
    }
    WidgetModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [widget_directive_1.Widget],
            exports: [widget_directive_1.Widget]
        }), 
        __metadata('design:paramtypes', [])
    ], WidgetModule);
    return WidgetModule;
}());
exports.WidgetModule = WidgetModule;


/***/ },

/***/ "./src/app/models/ArticleCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Created by Ideofuzion on 8/4/2016.
 */
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var ArticleCard = (function (_super) {
    __extends(ArticleCard, _super);
    function ArticleCard(_titleText, _articleText) {
        _super.call(this);
        this.articleText = _articleText;
        this.titleText = _titleText;
    }
    ArticleCard.prototype.GetTitleText = function () { return this.titleText; };
    ArticleCard.prototype.GetArticleText = function () { return this.articleText; };
    return ArticleCard;
}(Serializable));
exports.ArticleCard = ArticleCard;


/***/ },

/***/ "./src/app/models/Card.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Created by Ideofuzion on 8/4/2016.
 */
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var Card = (function (_super) {
    __extends(Card, _super);
    function Card(_type, _card) {
        _super.call(this);
        this.type = _type;
        this.card = _card;
    }
    Card.prototype.GetType = function () { return this.type; };
    Card.prototype.GetCard = function () { return this.card; };
    return Card;
}(Serializable));
exports.Card = Card;


/***/ },

/***/ "./src/app/models/CardAddButton.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Created by Ideofuzion on 8/4/2016.
 */
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var CardAddButton = (function (_super) {
    __extends(CardAddButton, _super);
    function CardAddButton(_buttonname, _urlblockname, _blockId, _addButtonId) {
        _super.call(this);
        this.buttonname = _buttonname;
        this.urlblockname = _urlblockname;
        this._blockId = _blockId;
        this._addButtonId = _addButtonId;
    }
    CardAddButton.prototype.GetName = function () { return this.buttonname; };
    CardAddButton.prototype.GetUrlBlock = function () { return this.urlblockname; };
    CardAddButton.prototype.GetBlockId = function () { return this._blockId; };
    CardAddButton.prototype.GetAddButtonId = function () { return this._addButtonId; };
    return CardAddButton;
}(Serializable));
exports.CardAddButton = CardAddButton;


/***/ },

/***/ "./src/app/models/GalleryCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var GalleryCard = (function (_super) {
    __extends(GalleryCard, _super);
    function GalleryCard(_pictureUrl, _title, _description, _url, _cardAddButton, _indexId) {
        _super.call(this);
        this.pictureUrl = _pictureUrl;
        this.title = _title;
        this.description = _description;
        this.url = _url;
        this.cardAddButton = _cardAddButton;
        this.indexId = _indexId;
    }
    GalleryCard.prototype.GetPictureUrl = function () { return this.pictureUrl; };
    GalleryCard.prototype.GetTitle = function () { return this.title; };
    GalleryCard.prototype.GetDescription = function () { return this.description; };
    GalleryCard.prototype.GetUrl = function () { return this.url; };
    GalleryCard.prototype.GetCardAddButton = function () { return this.cardAddButton; };
    GalleryCard.prototype.GetIndexId = function () { return this.indexId; };
    return GalleryCard;
}(Serializable));
exports.GalleryCard = GalleryCard;


/***/ },

/***/ "./src/app/models/ImageCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var ImageCard = (function (_super) {
    __extends(ImageCard, _super);
    function ImageCard(_pictureUrl, _quickReplyButton) {
        _super.call(this);
        this.pictureUrl = _pictureUrl;
        this.quickReplyButton = _quickReplyButton;
    }
    ImageCard.prototype.GetPictureUrl = function () { return this.pictureUrl; };
    ImageCard.prototype.GetCardQuickReplyButton = function () { return this.quickReplyButton; };
    return ImageCard;
}(Serializable));
exports.ImageCard = ImageCard;


/***/ },

/***/ "./src/app/models/QuickReplyCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var QuickReplyCard = (function (_super) {
    __extends(QuickReplyCard, _super);
    function QuickReplyCard(_quickReplyButton) {
        _super.call(this);
        this.quickReplyBtns = _quickReplyButton;
    }
    QuickReplyCard.prototype.GetQuickReplyButtons = function () { return this.quickReplyBtns; };
    return QuickReplyCard;
}(Serializable));
exports.QuickReplyCard = QuickReplyCard;


/***/ },

/***/ "./src/app/models/TextCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var TextCard = (function (_super) {
    __extends(TextCard, _super);
    function TextCard(_text, _cardAddButton, _quickReplyButton) {
        _super.call(this);
        this.randomText = _text;
        this.cardAddButton = _cardAddButton;
        this.quickReplyButton = _quickReplyButton;
    }
    TextCard.prototype.GetText = function () { return this.randomText; };
    TextCard.prototype.GetCardAddButton = function () { return this.cardAddButton; };
    TextCard.prototype.GetCardQuickReplyButton = function () { return this.quickReplyButton; };
    return TextCard;
}(Serializable));
exports.TextCard = TextCard;


/***/ },

/***/ "./src/app/services/BotTrainingService.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
var BotTrainingService = (function () {
    //baseUrl:string = "http://localhost/";
    function BotTrainingService(http) {
        this.http = http;
        this.baseUrl = "https://aprilappserver-staging.azurewebsites.net/";
    }
    BotTrainingService.prototype.getAllGroups = function (type) {
        return this.http.get(this.baseUrl + 'groups/getGroupsBlocks/' + type)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.getAlBlocks = function () {
        return this.http.get(this.baseUrl + 'blocks/getAllBlocks')
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.getAllResponseMessages = function (blockId) {
        return this.http.get(this.baseUrl + 'blocks/getResponseMessagesOfBlock/' + blockId)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteGroup = function (Id) {
        return this.http.get(this.baseUrl + 'groups/deleteOrderById/' + Id)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateTitleText = function (Id, Text, indexId, type) {
        return this.http.get(this.baseUrl + 'responsemessage/updateTitle/' + Id + '/' + indexId + '/' + type + '/' + Text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateRandomTitleText = function (Id, text, indexId) {
        return this.http.get(this.baseUrl + 'responsemessage/updateRandomTitle/' + Id + '/' + indexId + '/' + text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateArticleText = function (Id, Text) {
        var body = JSON.stringify({ "responseMessageId": Id, "text": Text });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/updateArticle", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateDescriptionText = function (Id, Text, indexId) {
        return this.http.get(this.baseUrl + 'responsemessage/updateDescription/' + Id + '/' + indexId + '/' + Text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateUrlText = function (Id, Text, indexId) {
        return this.http.get(this.baseUrl + 'responsemessage/updateUrl/' + Id + '/' + indexId + '/' + Text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteBlock = function (Id) {
        return this.http.get(this.baseUrl + 'blocks/deleteBlock/' + Id)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteResponseMessage = function (Id) {
        return this.http.get(this.baseUrl + 'responsemessage/deleteResponseMessage/' + Id)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteAddButton = function (AddButtonId, ParentId, type) {
        return this.http.get(this.baseUrl + 'responsemessage/deleteAddButton/' + ParentId + '/' + AddButtonId + '/' + type)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteQuickReply = function (AddButtonId, ParentId) {
        return this.http.get(this.baseUrl + 'responsemessage/deleteQuickReply/' + ParentId + '/' + AddButtonId)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addRandomText = function (Id, count) {
        return this.http.get(this.baseUrl + 'responsemessage/addTextRandom/' + Id + '/' + count)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addGroup = function (group, type) {
        var body = JSON.stringify({ "name": group, "type": type, "description": group });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "groups/addGroup", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addBlocks = function (block, type, groupId) {
        var body = JSON.stringify({ "name": block, "type": type, "description": block, "_groupId": groupId });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "blocks/addBlock", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addResponseMessage = function (data, type, blockId) {
        var body = JSON.stringify({ "data": data, "type": type, "_blockId": blockId });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/addResponseMessage", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addGalleryCard = function (data, responseMessageId) {
        var body = JSON.stringify({ "data": data, "responseMessageId": responseMessageId });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/addGalleryCard", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addAddButton = function (responseMessageId, data, type, index) {
        var body = JSON.stringify({ "data": data, "responseMessageId": responseMessageId, "type": type, "index": index });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/addAddButton", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addQuickReply = function (responseMessageId, buttonName, _blockId, count) {
        return this.http.get(this.baseUrl + 'responsemessage/addQuickReply/' + responseMessageId + '/' + buttonName + '/' + _blockId + '/' + count)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.getPictureUrl = function (file, Id, type, indexId) {
        var formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("responseMessageId", Id);
        formData.append("type", type);
        formData.append("indexId", indexId);
        //let body = JSON.stringify({ "name":group, "type":type, "description":group });
        var options = new http_1.RequestOptions({ method: 'post' });
        return this.http.post(this.baseUrl + "usercode/uploadPicture", formData, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], BotTrainingService);
    return BotTrainingService;
    var _a;
}());
exports.BotTrainingService = BotTrainingService;


/***/ }

});
//# sourceMappingURL=10.map