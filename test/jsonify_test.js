const expect = require('chai').expect;
const jsonify = require('../lib/jsonify');
const mock = require('mock-fs');

describe('jsonify', () => {

  describe('toJSON', () => {

    beforeEach(() => {
      mock({
        'fake/dir/deep': {
          'file2.txt': 'file2',
          dir2: {
            'file3.txt': 'file3',
          },
        },
        'fake/dir/shallow': {
          'file4.txt': 'file4',
        },
        'file.txt': 'file',
      });
    });

    describe('when a file is given', () => {

      it('should return a json', () => {
        return jsonify.toJSON(['file.txt'])
          .then((result) => {
            expect(result).to.deep.equal({ 'file.txt': { content: 'file' } });
          });
      });
    });

    describe('when a shallow directory is given', () => {

      it('should return a json', () => {
        return jsonify.toJSON(['fake/dir/shallow'])
          .then((result) => {
            expect(result).to.deep.equal({ 'file4.txt': { content: 'file4' } });
          });
      });
    });

    describe('when a deep directory is given', () => {

      it('should return a json', () => {
        return jsonify.toJSON(['fake/dir/deep'])
          .then((result) => {
            expect(result).to.deep.equal({ 'file3.txt': { content: 'file3' }, 'file2.txt': { content: 'file2' } });
          });
      });
    });

    describe('when a file that does not exists is given', () => {

      it('should return ENOENT', () => {
        return jsonify.toJSON(['filethatdontexist.txt'])
          .catch((error) => {
            expect(error.code).to.deep.equal('ENOENT');
          });
      });
    });

    describe('when a shallow directory that does not exist is given', () => {

      it('should return ENOENT', () => {
        return jsonify.toJSON(['fake/dir/shallow/that/does/not/exist'])
          .catch((error) => {
            expect(error.code).to.deep.equal('ENOENT');
          });
      });
    });

    describe('when a deep directory that does not exist is given', () => {

      it('should return ENOENT', () => {
        return jsonify.toJSON(['fake/dir/deep/that/does/not/exist'])
          .catch((error) => {
            expect(error.code).to.deep.equal('ENOENT');
          });
      });
    });
  });
});
