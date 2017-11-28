'use strict';

const ProgressBar = require('ascii-progress');

/**
 * Progress Bar module is in charge of updating the upload progress bar
 * @module Progress_bar
 */

const width = 80;
const total = 100;

const progressBar = new ProgressBar({
  schema: 'Uploading [:filled.gradient(red,green):blank] :percent :elapseds',
  width,
  total,
});

module.exports = {
  /**
  * makeCallback is a function that makes the callback to handle the on drain event of the
  * upload request.
  * @param  {String} inputFile name of a directory or a file
  * @return {function} function that calculates the percentage of bytes written
  * to the upload request;
  */
  onDrainCallback() {
    let bytesWritten = 0;
    let progress = 0;

    const ProgressBarInterval = setInterval(() => {
      progressBar.tick(progress);
      if (progressBar.completed) {
        clearInterval(ProgressBarInterval);
      }
    }, 100);

    return (chunk, httpRequest) => {
      bytesWritten += chunk;
      const size = httpRequest.src.bytesToWrite();
      progress = (bytesWritten.length * 100) / size;
    };
  },
  clearProgressBar() {
    progressBar.completed = true;
    progressBar.clear();
  },
};
