'use strict';

const expect = require('chai').expect;
const config = require('config');
const File = require('../lib/file_dispatcher');
const nock = require('nock');
const mock = require('mock-fs');
const URL = require('url');

const url = URL.parse(config.get('github.url'), true);
const origin = `${url.protocol}//${url.host}`;
const service = url.pathname;

describe('filehande', () => {

  describe('handle', () => {
    const description = 'somedescription';
    const callback = () => {};

    beforeEach(() => {
      mock({
        'file.txt': 'file',
      });
    });

    describe('when an existing file is given and it is public', () => {

      beforeEach(() => {
        nock(origin).post(service).reply(201, { html_url: 'someurl' });
      });

      it('should return 201 and the url', () => {
        return File.dispatch('file.txt', true, description, callback)
          .then((result) => {
            expect(result).to.deep.equal({ status: 201, url: 'someurl' });
          });
      });
    });

    describe('when an existing file is given and it is private', () => {

      beforeEach(() => {
        nock(origin).post(service).reply(201, { html_url: 'someurl' });
      });

      it('should return 201 and the url', () => {
        return File.dispatch('file.txt', false, description, callback)
          .then((result) => {
            expect(result).to.deep.equal({ status: 201, url: 'someurl' });
          });
      });
    });

    describe('when a non existing file is given', () => {

      it('should return file does not exist error', () => {
        return File.dispatch('file2.txt', true, description, callback)
          .catch((result) => {
            expect(result.code).to.deep.equal('ENOENT');
          });
      });
    });

    describe('when there is an error in the network', () => {
      const errorResponse = {
        code: 'ENOTFOUND',
        errno: 'ENOTFOUND',
        syscall: 'getaddrinfo',
        hostname: 'api.github.com',
        host: 'api.github.com',
        port: 443,
      };

      beforeEach(() => {
        nock(origin).post(service).replyWithError(errorResponse);
      });

      it('should return an error and a message', () => {
        return File.dispatch('file.txt', true, description, callback)
          .catch((result) => {
            expect(result).to.deep.equal(errorResponse);
          });
      });
    });
  });
});
