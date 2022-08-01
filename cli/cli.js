const readline = require('readline');
const fetch = require('node-fetch');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const ReadableStreamClone = require('readable-stream-clone');
const directoryMap = require('../utils/directoryMap');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const directoryThreshold = 350000; // in bytes

function writeToDirectory(responseBody, directory, fileName) {
  responseBody.pipe(fs.createWriteStream(path.resolve(directory, fileName)));
}

async function readDirectory(directoryPath) {
  const files = await fsPromises.readdir(directoryPath);
  if (files) {
    return files;
  }
  console.log('files was never resolved');
}

async function readFilesAndDetermineByteSize(filesArray, absolutePath) {
  let byteSize = 0;
  for await (const file of filesArray) {
    const fileInfo = await fsPromises.stat(path.join(absolutePath, file));
    byteSize += fileInfo.size;
  }
  return byteSize;
}

async function informDirectorySizeAndPromptDownload(
  byteSize,
  filePath,
  counter = 1
) {
  rl.question(
    `Currently ${byteSize} in directory. The threshold for this directory is ${directoryThreshold}. Please provide URL for download (Type STOP to cancel downloads): `,
    async (url) => {
      if (url.toUpperCase() === 'STOP') {
        rl.close();
        return;
      }
      const extension = path.extname(url);
      console.log('file extension: ', extension);
      const tempFilePath = path.join(
        path.resolve(__dirname, '../'),
        `temp/file${counter}${extension}`
      );

      const response = await fetch(url);
      const responseCopy = new ReadableStreamClone(response.body);
      response.body.pipe(fs.createWriteStream(tempFilePath));
      response.body.on('end', async () => {
        const fileSize = (await fsPromises.stat(tempFilePath)).size;
        console.log('fileSize: ', fileSize);
        if (fileSize + byteSize <= directoryThreshold) {
          responseCopy.pipe(
            fs.createWriteStream(
              path.join(filePath, `file${counter}${extension}`)
            )
          );
          await fsPromises.unlink(tempFilePath);
          await informDirectorySizeAndPromptDownload(
            fileSize + byteSize,
            filePath,
            counter + 1
          );
        } else {
          console.log(
            'file is too big for this directory, exceeded maximum threshold'
          );
          await fsPromises.unlink(tempFilePath);
          rl.close();
        }
      });
    }
  );
}

async function saveToDirectory() {
  rl.question('What folder do you want to save this in? ', async (folder) => {
    const absoluteFilePath = directoryMap(folder);
    if (absoluteFilePath) {
      const filesInDirectory = await readDirectory(absoluteFilePath);
      const byteSize = await readFilesAndDetermineByteSize(
        filesInDirectory,
        absoluteFilePath
      );
      console.log('byteSize: ', byteSize);
      informDirectorySizeAndPromptDownload(byteSize, absoluteFilePath);
    } else {
      const desktopPath = await directoryMap('Desktop');
      if (desktopPath) {
        const imageProcessorDirectory = path.join(
          desktopPath,
          'ImageProcessor'
        );
        if (directoryMap(imageProcessorDirectory)) {
          console.log(
            'The directory you inputted does not exist. ImageProcessor default directory exists - adding files to this directory'
          );
          const filesInDirectory = await readDirectory(imageProcessorDirectory);
          const byteSize = await readFilesAndDetermineByteSize(
            filesInDirectory,
            imageProcessorDirectory
          );
          console.log('byteSize: ', byteSize);
          informDirectorySizeAndPromptDownload(
            byteSize,
            imageProcessorDirectory
          );
        } else {
          fs.mkdir(path.join(desktopPath, 'ImageProcessor'), async (err) => {
            if (err) {
              console.log('got an error making a directory, ', err);
            } else {
              // next add files to imageProcessorDirectory
              console.log(
                'Directory does not exist. Creating ImageProcessor folder in Desktop'
              );
              const filesInDirectory = await readDirectory(
                imageProcessorDirectory
              );
              const byteSize = await readFilesAndDetermineByteSize(
                filesInDirectory,
                imageProcessorDirectory
              );
              console.log('byteSize: ', byteSize);
              informDirectorySizeAndPromptDownload(
                byteSize,
                imageProcessorDirectory
              );
            }
          });
        }
      } else {
        console.log('an error has occurred');
      }
    }
  });
}

saveToDirectory();
