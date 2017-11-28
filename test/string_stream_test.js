const expect = require('chai').expect;
const StringStream = require('../lib/string_stream');
const concat = require('concat-stream');

describe('stringStream', () => {

  describe('when a string is given', () => {

    const testString = 'this is a test string';
    const stream = new StringStream(testString);

    it('should return the same string', (done) => {
      stream.pipe(concat((data) => {
        expect(data.toString()).to.equal(testString);
        done();
      }));
    });
  });

  describe('when an empty string is given', () => {

    const testString = '';
    const stream = new StringStream(testString);

    it('should return the same string', (done) => {
      stream.pipe(concat((data) => {
        expect(data.toString()).to.equal(testString);
        done();
      }));
    });
  });


  describe('bytesToWrite', () => {

    describe('when a string is given', () => {
      const testString = 'testing a stream';
      const stream = new StringStream(testString);

      it('should return a number', (done) => {
        expect(stream.bytesToWrite()).to.equal(16);
        done();
      });
    });

    describe('when an empty string is given', () => {
      const testString = '';
      const stream = new StringStream(testString);

      it('should return a number', (done) => {
        expect(stream.bytesToWrite()).to.equal(0);
        done();
      });
    });
  });
});
