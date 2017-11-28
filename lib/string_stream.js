'use strict';

const stream = require('stream');

/**
 * StringStream is a class that Extends form Readable class that allows to make
 * streams from strings.
 * @class StringStream
 */
class StringStream extends stream.Readable {
  /**
  * constructor of the class StringStream.
  * @param {String} str string of the readable stream.
  */
  constructor(str) {
    super();
    this._str = str;
  }

  /**
  * _read is a function that reads the stream
  */
  _read() {
    if (!this.ended) {
      const self = this;
      process.nextTick(() => {
        self.push(Buffer.from(self._str));
        self.push(null);
      });
      this.ended = true;
    }
  }
  /**
  * bytesToWrite is a function that returns the number of bytes of the stream.
  * @return {Number} number of bytes to be written in the stram.
  */
  bytesToWrite() {
    return this._str.length;
  }
}

module.exports = StringStream;
