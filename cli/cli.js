const readline = require('readline');
const fetch = require('node-fetch');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const directoryMap = require('../utils/directoryMap');
const ReadableStreamClone = require('readable-stream-clone');
// const { opendir } = require('fs/promises');
// const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const directoryThreshold = 1000000; // in bytes

function writeToDirectory(responseBody, directory, fileName) {
  responseBody.pipe(fs.createWriteStream(path.resolve(directory, fileName)));
}

async function readDirectory(directoryPath) {
  const files = await fsPromises.readdir(directoryPath);
  if (files) {
    console.log('these are the files in readdir: ', files);
    return files;
  } else {
    console.log('files was never resolved');
    return;
  }
}

async function readFilesAndDetermineByteSize(filesArray, absolutePath) {
  let byteSize = 0;
  console.log('this is the filesArray: ', filesArray);
  for await (const file of filesArray) {
    let fileInfo = await fsPromises.stat(path.join(absolutePath, file));
    byteSize += fileInfo.size;
  }
  return byteSize;
}

function informDirectorySizeAndPromptDownload(byteSize, filePath) {
  rl.question(
    `Currently ${byteSize} in directory. The threshold for this directory is ${directoryThreshold}. Please provide URL for download: `,
    async (url) => {
      const extension = path.extname(url);
      console.log('file extension: ', extension);
      const tempFilePath = path.join(
        path.dirname(filePath),
        `temp/file1${extension}`
      );

      const response = await fetch(url);
      const responseCopy = new ReadableStreamClone(response.body);
      response.body.pipe(fs.createWriteStream(tempFilePath));
      response.body.on('end', async () => {
        const fileSize = (await fsPromises.stat(tempFilePath)).size;
        console.log('fileSize: ', fileSize);
        if (fileSize + byteSize <= directoryThreshold) {
          responseCopy.pipe(
            fs.createWriteStream(path.join(filePath, `file1${extension}`))
          );
        } else {
          console.log(
            'file is too big for this directory, exceeded maximum threshold'
          );
        }
        await fsPromises.unlink(tempFilePath);
        rl.close();
      });
    }
  );
}
informDirectorySizeAndPromptDownload(
  74797,
  '/Users/aramkrakirian/Desktop/Codesmith/Node-UTH/ImageProcessor/cli'
);

async function saveToDirectory() {
  rl.question('What folder do you want to save this in?', async (folder) => {
    const absoluteFilePath = directoryMap(folder);
    console.log('absolute file path: ', absoluteFilePath);
    if (absoluteFilePath) {
      // tell them how much space is left in this directory
      const filesInDirectory = await readDirectory(absoluteFilePath);
      console.log('this is the filesInDirectory: ', filesInDirectory);
      const byteSize = await readFilesAndDetermineByteSize(
        filesInDirectory,
        absoluteFilePath
      );
      console.log('byteSize: ', byteSize);
      console.log('writing to the folder');
    }
  });
}

// test URL
// https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2021/12/30151747/Pembroke-Welsh-Corgi-smiling-and-happy-outdoors.jpeg

// async function downloadFile() {
//   await rl.question('Paste image url: ', async (url) => {
//     const response = await fetch(
//       'https://imgs.search.brave.com/J3Y-3lT_zrQnrVS8y92fWz6CDD0yGpdwxpymeByTzc0/rs:fit:1200:900:1/g:ce/aHR0cHM6Ly9pbWFn/ZXN2Yy5tZXJlZGl0/aGNvcnAuaW8vdjMv/bW0vaW1hZ2U_dXJs/PWh0dHBzOiUyRiUy/RnN0YXRpYy5vbmVj/bXMuaW8lMkZ3cC1j/b250ZW50JTJGdXBs/b2FkcyUyRnNpdGVz/JTJGMjglMkYyMDE5/JTJGMDglMkZjb3Jn/aS1kb2ctbmFtZS1Q/T1BET0dTMDgxOS5q/cGc'
//     );

//     console.log(response.body);
//     rl.question('What folder do you want to save this in? ', (folder) => {
//       if (directoryMap(folder)) {
//         console.log('writing to the folder');
//         response.body.pipe(
//           fs.createWriteStream(path.resolve(folder, 'anotherTest.jpeg'))
//         );
//         console.log();
//       } else {
//         const desktopPath = directoryMap('Desktop');
//         if (desktopPath) {
//           console.log('found path to desktop');
//           if (directoryMap(path.join(desktopPath, 'ImageProcessor'))) {
//             console.log(
//               'ImageProcessor already exists, adding the file to folder'
//             );
//             response.body.on('end', () => console.log('placeholder'));
//             response.body.pipe(
//               fs.createWriteStream(
//                 path.join(desktopPath, 'ImageProcessor', 'anotherTest.jpeg')
//               )
//             );
//             console.log('after pipe method has started');
//           } else {
//             fs.mkdir(path.join(desktopPath, 'ImageProcessor'), (err) => {
//               console.log('making directory for ImageProcessor');
//               if (err) {
//                 console.log('got an error making a directory, ', err);
//               } else {
//                 console.log(
//                   'writing the file to the new directory ImageProcessor'
//                 );
//                 response.body.pipe(
//                   fs.createWriteStream(
//                     path.join(desktopPath, 'ImageProcessor', 'anotherTest.jpeg')
//                   )
//                 );
//               }
//             });
//           }
//         } else {
//           console.log('ur fucked');
//         }
//       }
//       rl.close();
//       console.log('inside download file function');
//     });
//   });
// }
