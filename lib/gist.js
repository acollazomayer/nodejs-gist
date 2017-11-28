'use strict';

const config = require('config');
const request = require('request');
const StringStream = require('./string_stream');
/**
 * Gist module is in charge of uploading the files to a gist.
 * @module gist
 */
const token = config.get('github.token');
const url = config.get('github.url');

/**
* getPostOptions is a function that recieves an object of data and returns the
* configurations of the post request.
* @return {Object} containing configuration of the post request
*/
function buildPostOptions() {
  return {
    url,
    headers: {
      Authorization: `token ${token}`,
      'content-type': 'application/json',
      'User-Agent': 'request',
    },
    json: true,
  };
}

module.exports = {
  /**
  * Upload is a function that recieves a gist object which contains the
  * parameters, files, isPublic and its description, and then its uploaded to
  * github.
  * @param  {Object} gist object ready to be uploaded
  * @param {String} gist.files - The files of the Gist
  * @param {Boolean} gist.public - True for public Gist, false for private Gist
  * @param {String} gist.description - The description of the Gist
  * @param {function} callback functions that gets executed on drain event
  * @return {Promise} promise
  * @resolve {Object} object containing the gist location url
  * @reject {Object} error uploading the gist
  */
  upload(gist, callback = Function()) {
    const options = buildPostOptions();
    return new Promise(
      (resolve, reject) => {
        const stream = new StringStream(JSON.stringify(gist));
        const httpRequest = stream.pipe(request.post(options, (error, response, body) => {
          if (error) return reject(error);
          if (response.statusCode === 201) {
            const result = { status: response.statusCode, url: body.html_url };
            return resolve(result);
          }
          return reject(body);
        }))
          .on('data', (chunk) => { callback(chunk, httpRequest); });
      });
  },
};
