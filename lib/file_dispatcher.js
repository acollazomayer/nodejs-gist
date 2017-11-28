'use strict';

const fs = require('fs');
const Gist = require('./gist');
const jsonify = require('./jsonify');

/**
 * file_dispatcher is module that in charge of building the gist object and then uploading it.
 * its main aim is to take care of everything realated to files.
 * @module
 */

/**
  * buildGist is a function that is sole purpose is to build the gist object with its
  * files, description and if iy is public or not.
  * @param {Object} files an object containing the file names and its contents.
  * @param {Boolean} isPublic sets its publicity.
  * @param {String} description of the gist.
  * @return {Object} object structure of a gist.
  */
function buildGist(files, isPublic, description) {
  return {
    files,
    description,
    public: isPublic,
  };
}

/**
  * sendToUpload is a function that is in charge of sending the gist to be uploaded
  * @param  {Object} gist object ready to be uploaded
  * @param {function} callback function that handles the upload.
  * @return {Promise} with the result of the request or the error;
  */
function sendToUpload(gist, callback) {
  return new Promise((resolve, reject) => {
    Gist.upload(gist, callback)
      .then((result) => { return resolve(result); })
      .catch((uploadError) => { return reject(uploadError); });
  });
}

function transformAndUpload(path, description, isPublic, callback) {
  return new Promise((resolve, reject) => {
    jsonify.toJSON([path])
      .then((filesObject) => {
        const gist = buildGist(filesObject, description, isPublic);
        return resolve(sendToUpload(gist, callback));
      })
      .catch((toJSONError) => {
        return reject(toJSONError);
      });
  });
}

module.exports = {
  /**
  * dispatch is a function that recieves a path of a file, a description, if it is public,
  * and a function that it is given to the upload method.
  * @param {String} path of a file
  * @param {Boolean} isPublic sets its publicity.
  * @param {String} description of the gist.
  * @param {function} callback function that handles the upload.
  * @return {Promise} promise
  * @resolve {Object} object containing the gist location url
  * @reject {Object} error uploading or reading the file or files
  */
  dispatch(path, description, isPublic, callback) {
    return new Promise((resolve, reject) => {
      fs.access(path, fs.constants.R_OK, (error) => {
        if (error) return reject(error);
        return resolve(transformAndUpload(path, description, isPublic, callback));
      });
    });
  },
};
