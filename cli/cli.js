const readline = require('readline');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const directoryMap = require('../utils/directoryMap');
// const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Paste image url: ', async (url) => {
  const response = await fetch(
    'https://imgs.search.brave.com/J3Y-3lT_zrQnrVS8y92fWz6CDD0yGpdwxpymeByTzc0/rs:fit:1200:900:1/g:ce/aHR0cHM6Ly9pbWFn/ZXN2Yy5tZXJlZGl0/aGNvcnAuaW8vdjMv/bW0vaW1hZ2U_dXJs/PWh0dHBzOiUyRiUy/RnN0YXRpYy5vbmVj/bXMuaW8lMkZ3cC1j/b250ZW50JTJGdXBs/b2FkcyUyRnNpdGVz/JTJGMjglMkYyMDE5/JTJGMDglMkZjb3Jn/aS1kb2ctbmFtZS1Q/T1BET0dTMDgxOS5q/cGc'
  );
  // const data = await response.blob();
  // console.log(__dirname);
  rl.question('What folder do you want to save this in? ', (folder) => {
    if (directoryMap(folder)) {
      response.body.pipe(fs.createWriteStream(path.resolve(folder, 'anotherTest.jpeg')));
    } else {
      const desktopPath = directoryMap('Desktop');
      if (desktopPath) {
        fs.mkdir(path.join(desktopPath, 'ImageProcessor'), (err) => {
          if (err) {
            console.log('got an error making a directory, ', err);
          }
        });
      } else {
        console.log('ur fucked');
      }
    }
  });

  // console.log(data);
  // request(
  //   'https://imgs.search.brave.com/J3Y-3lT_zrQnrVS8y92fWz6CDD0yGpdwxpymeByTzc0/rs:fit:1200:900:1/g:ce/aHR0cHM6Ly9pbWFn/ZXN2Yy5tZXJlZGl0/aGNvcnAuaW8vdjMv/bW0vaW1hZ2U_dXJs/PWh0dHBzOiUyRiUy/RnN0YXRpYy5vbmVj/bXMuaW8lMkZ3cC1j/b250ZW50JTJGdXBs/b2FkcyUyRnNpdGVz/JTJGMjglMkYyMDE5/JTJGMDglMkZjb3Jn/aS1kb2ctbmFtZS1Q/T1BET0dTMDgxOS5q/cGc'
  // )
  //   .pipe(fs.createWriteStream('testfile.jpeg'))
  //   .on('close', () => console.log('done'));
  rl.close();
});
