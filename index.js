'use strict';

const File = require('./lib/file_dispatcher');
const ProgressBar = require('./lib/progress_bar');

const pathArrayLocation = 2;
const isPublicArrayLocation = 3;
const descriptionArrayLocation = 4;

const path = process.argv[pathArrayLocation];
const isPublic = process.argv[isPublicArrayLocation];
const description = process.argv[descriptionArrayLocation];

console.log('Preparing Files...');
File.dispatch(path, isPublic, description, ProgressBar.onDrainCallback())
  .then((result) => {
    console.log(`Gist location: ${result.url}`);
  })
  .catch((error) => {
    console.log(error.message);
    ProgressBar.clearProgressBar();
  });
