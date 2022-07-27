const readline = require('readline');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const directoryMap = require('../utils/directoryMap');
const { checkPrimeSync } = require('crypto');
// const { opendir } = require('fs/promises');
// const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const directoryThreshold = 100000; // in bytes

function writeToDirectory(responseBody, directory, fileName) {
  responseBody.pipe(
    fs.createWriteStream(path.resolve(directory, fileName))
  );
}

function readDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      return files; // files is an array of fileNames
    }
  })
}

function readFilesAndDetermineByteSize(filesArray) {
  let byteSize = 0;
  for await (const file of filesArray) {
    fs.stat
  }
  return 
}


function saveToDirectory() {
  rl.question('What folder do you want to save this in?', (folder) => {
    if (directoryMap(folder)) {
      // tell them how much space is left in this directory
      

      console.log('writing to the folder');
    } else {
  })
}

async function downloadFile() {
  await rl.question('Paste image url: ', async (url) => {
    const response = await fetch(
      'https://imgs.search.brave.com/J3Y-3lT_zrQnrVS8y92fWz6CDD0yGpdwxpymeByTzc0/rs:fit:1200:900:1/g:ce/aHR0cHM6Ly9pbWFn/ZXN2Yy5tZXJlZGl0/aGNvcnAuaW8vdjMv/bW0vaW1hZ2U_dXJs/PWh0dHBzOiUyRiUy/RnN0YXRpYy5vbmVj/bXMuaW8lMkZ3cC1j/b250ZW50JTJGdXBs/b2FkcyUyRnNpdGVz/JTJGMjglMkYyMDE5/JTJGMDglMkZjb3Jn/aS1kb2ctbmFtZS1Q/T1BET0dTMDgxOS5q/cGc'
    );
    // const data = await response.blob();
    // console.log(__dirname);
    console.log(response.body);
    rl.question('What folder do you want to save this in? ', (folder) => {
      if (directoryMap(folder)) {
        console.log('writing to the folder');
        response.body.pipe(
          fs.createWriteStream(path.resolve(folder, 'anotherTest.jpeg'))
        );
        console.log();
      } else {
        const desktopPath = directoryMap('Desktop');
        if (desktopPath) {
          console.log('found path to desktop');
          if (directoryMap(path.join(desktopPath, 'ImageProcessor'))) {
            console.log(
              'ImageProcessor already exists, adding the file to folder'
            );
            response.body.on('end', () => console.log('placeholder'));
            response.body.pipe(
              fs.createWriteStream(
                path.join(desktopPath, 'ImageProcessor', 'anotherTest.jpeg')
              )
            );
            console.log('after pipe method has started');
          } else {
            fs.mkdir(path.join(desktopPath, 'ImageProcessor'), (err) => {
              console.log('making directory for ImageProcessor');
              if (err) {
                console.log('got an error making a directory, ', err);
              } else {
                console.log(
                  'writing the file to the new directory ImageProcessor'
                );
                response.body.pipe(
                  fs.createWriteStream(
                    path.join(desktopPath, 'ImageProcessor', 'anotherTest.jpeg')
                  )
                );
              }
            });
          }
        } else {
          console.log('ur fucked');
        }
      }
      rl.close();
      console.log('inside download file function');
    });

    // console.log(data);
    // request(
    //   'https://imgs.search.brave.com/J3Y-3lT_zrQnrVS8y92fWz6CDD0yGpdwxpymeByTzc0/rs:fit:1200:900:1/g:ce/aHR0cHM6Ly9pbWFn/ZXN2Yy5tZXJlZGl0/aGNvcnAuaW8vdjMv/bW0vaW1hZ2U_dXJs/PWh0dHBzOiUyRiUy/RnN0YXRpYy5vbmVj/bXMuaW8lMkZ3cC1j/b250ZW50JTJGdXBs/b2FkcyUyRnNpdGVz/JTJGMjglMkYyMDE5/JTJGMDglMkZjb3Jn/aS1kb2ctbmFtZS1Q/T1BET0dTMDgxOS5q/cGc'
    // )
    //   .pipe(fs.createWriteStream('testfile.jpeg'))
    //   .on('close', () => console.log('done'));
  });
}

// console.log('outside rl functionality');
downloadFile();
