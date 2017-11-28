'use strict';

const expect = require('chai').expect;
const config = require('config');
const Gist = require('../lib/gist');
const nock = require('nock');
const URL = require('url');

const url = URL.parse(config.get('github.url'), true);
const origin = `${url.protocol}//${url.host}`;
const service = url.pathname;

describe('gist', () => {

  describe('filesupload', () => {
    let gist;

    beforeEach(() => {
      gist = {
        files: {
          'file2.txt': {
            content: 'String file contents',
          }
        },
        description: 'some gist',
        public: 'true',
      };
    });

    describe('when the response is successful', () => {
      beforeEach(() => {
        nock(origin).post(service).reply(201, { html_url: 'someurl' });
      });

      it('should return 201 and the url', () => {
        return Gist.upload(gist)
          .then((result) => {
            expect(result).to.deep.equal({ status: 201, url: 'someurl' });
          });
      });
    });

    describe('when the response is unsuccessful', () => {
      const errorResponse = {
        message: 'Validation Failed',
        errors: [
          {
            resource: 'Issue',
            field: 'title',
            code: 'missing_field',
          }
        ]
      };

      beforeEach(() => {
        nock(origin).post(service).reply(422, errorResponse);
      });

      it('should return an error and a message', () => {
        return Gist.upload(gist)
          .catch((result) => {
            expect(result).to.deep.equal(errorResponse);
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
        return Gist.upload(gist)
          .catch((result) => {
            expect(result).to.deep.equal(errorResponse);
          });
      });
    });
  });
});
