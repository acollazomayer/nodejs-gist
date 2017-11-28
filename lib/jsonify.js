'use strict';

const fs = require('fs');
const flatten = require('array-flatten');
const path = require('path');

/**
 * Jsonify module is in charge of converting a file or a directory into an
 * object.
 * @module jsonify
 */

/**
* solveDirectory is a function that receives a path and returns the files in the path
* if its a directory or returns the path if it is only a mere file.
* @param  {String} path of a name or a directory
* @returns {Promise} promise
* @resolve {Array} containing a file or files in the input path.
* @reject {Object} error reading the file
*/
function solveDirectory(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.stat(directoryPath, (error, stat) => {
      if (error) return reject(error);
      if (stat.isDirectory()) {
        fs.readdir(directoryPath, (errorReadDir, files) => {
          const pathedFiles = files.map((file) => {
            return `${directoryPath}/${file}`;
          });
          return resolve(pathedFiles);
        });
      } else {
        return resolve([directoryPath]);
      }
    });
  });
}

/**
* listFiles is a function that receives a list of paths involving either files
* or directories and returns a list of all the files inside the input directories and
* the given files
* @param  {Array} paths a list of paths containing either files or directories.
* @returns {Promise} promise
* @resolve {Array} containing all the files in the input paths
* @reject {Object} error reading the file
*/
function listFiles(paths) {
  return new Promise((resolve, reject) => {
    const filesObjectList = Promise.all(paths.map(solveDirectory));
    filesObjectList.then((result) => {
      result = flatten(result);
      if (result.length === paths.length) {
        return resolve(result);
      }
      listFiles(result).then((filesList) => {
        return resolve(filesList);
      });
    }).catch((error) => {
      return reject(error);
    });
  });
}

/**
* readFile is a function that receives a file name and returns a Promise containing
* the name of the file and its contents
* @param  {String} fileName name of the file
* @returns {Promise} promise
* @resolve {Object} fileObject containing the name of the file and its contents
* @reject {Object} error reading the file
*/
function readFile(fileName) {
  return new Promise((resolve, reject) => {
    const file = {};
    fs.readFile(fileName, 'utf8', (error, content) => {
      if (error) return reject(error);
      fileName = path.basename(fileName);
      file[fileName] = { content };
      return resolve(file);
    });
  });
}

/**
* readFiles is a function that receives a list of paths involving either files
* or directories and returns an object containing all the filenames and its contents.
* @param  {String} paths a list of paths containing either files or directories.
* @return {Promise} promise
* @resolve {Object} fileObject containing the name of the files and its contents
* @reject {Object} error reading the directory
*/
function readFiles(paths) {
  return new Promise((resolve, reject) => {
    listFiles(paths)
      .then((filesList) => {
        const filePromises = filesList.map(readFile);
        const filesObjectList = Promise.all(filePromises);
        filesObjectList.then((result) => {
          const files = Object.assign.apply(Object, result);
          return resolve(files);
        });
      }).catch((error) => {
        return reject(error);
      });
  });
}

/**
* toJson is a function that receives a directory or a file and returns the contents
* of the file or files and its name or names in an object
* @param  {String} inputFile name of a directory or a file
* @return {Promise} promise
* @resolve {Object} json containing the name and the contents of the files
* @reject {Object} error reading the directory
*/
module.exports = {
  toJSON(inputFiles) {
    return Promise.resolve(readFiles(inputFiles));
  },
};
