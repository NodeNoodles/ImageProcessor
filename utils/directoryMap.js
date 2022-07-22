const fs = require('fs');
const path = require('path');

function find(targetPath) {
  return findStartingWith(path.dirname(require.main.filename), targetPath);
}

// console.log(require.main.filename);
// console.log(path.dirname(require.main.filename));

function findStartingWith(start, target) {
  const dirPath = path.join(path.dirname(start), target);
  try {
    const exists = fs.statSync(dirPath);
    if (exists.isDirectory()) {
      return dirPath;
    }
    if (path.dirname(start) !== start) {
      return findStartingWith(path.dirname(start), target);
    }
  } catch (err) {
    if (path.dirname(start) !== start) {
      return findStartingWith(path.dirname(start), target);
    }
  }
}

module.exports = find;
