// // instantiate a server
// const http = require('http');
const fs = require('fs');
const path = require('path');
// // const fetch = require('node-fetch');
// const { answer } = require('../cli/cli.js');
// const PORT = 3000;

// const doOnIncoming = (req, res) => {
//   console.log(answer);
//   res.end();
// };

// const server = http.createServer(doOnIncoming);

// server.listen(PORT, () => `listening on port ${PORT}`);

// fs.opendir(path.resolve(__dirname, '../cli'), (err, data) => {
//   if (err) {
//     console.error(err);
//   } else {
//     for await (const dirent in data) {
//       console.log(dirent.name);
//     }
//   }
// });

function readDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      console.log(files); // files is an array of fileNames
    }
  });
}

const directory = path.resolve(__dirname, '../cli');
readDirectory(directory);
