const fs = require('fs');
const request = require('request');

function download(uri, filename) {
  return new Promise((resolve) => {
    request.head(uri, () => {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
    });
  });
}

const checkDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = {
  checkDirectory,
  download,
};
